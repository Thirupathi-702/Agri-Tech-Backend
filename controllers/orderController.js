
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const cartSchema = require("../models/Cart");
const Product = require("../models/Product");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
exports.createOrder = async (req, res) => {
  try {
    const { amount, items, address, paymentType } = req.body; // 👈 new field "paymentType"
    const userId = req.userId;

    // console.log("Creating order for user:", userId, "Payment type:", paymentType,
    //     amount  
    // );

    // ✅ Fetch product details
    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        return {
          product: product._id,
          name: product.productName,
          price: product.price,
          quantity: item.quantity,
          images: product.images?.[0] || null,
        };
      })
    );

    // ✅ If advance payment selected, set amount to ₹2000
    const payableAmount = paymentType === "advance" ? 2000 : amount;

    // ✅ Create Razorpay order
    const options = {
      amount: payableAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ Calculate remaining amount
    const remainingAmount =
      paymentType === "advance" ? amount - 2000 : 0;

    // ✅ Save order in DB
    const newOrder = new Order({
      user: userId,
      items: formattedItems,
      address,
      amount,
      paidAmount :paymentType === "advance" ? 2000 : amount,
      advanceAmount: paymentType === "advance" ? 2000 : 0,
      remainingAmount,
      paymentType,
      razorpayOrderId: order.id,
      status: "pending",
      paymentStatus: "Pending",
    });

    await newOrder.save();

    // ✅ Send response to frontend
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      message:
        paymentType === "advance"
          ? "Advance payment of ₹2000 initiated"
          : "Full payment initiated",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentType, // "full", "advance", "remaining"
      orderId,     // must be sent from frontend
    } = req.body;

    // 🔐 Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.json({ success: false, message: "Invalid signature" });
    }

    // 🧩 Fetch order from DB
    
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.json({ success: false, message: "Order not found in DB" });
    }
    // ✅ Stock check and update
    // 🧠 Deduct stock ONLY for advance or full payments (first time purchase)
// if (paymentType === "advance" || paymentType === "full") {
//   for (let item of order.items) {
//     const product = await Product.findById(item.product);

//     if (product.quantity < item.quantity) {
//       return res.status(400).json({
//         message: `${product.name} does not have enough stock`,
//       });
//     }

//     product.quantity -= item.quantity;  // subtract ONLY ONCE
//     await product.save();
//   }
// }



    // 🔄 Update common payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    // 🧠 Update based on paymentType
    if (paymentType === "advance") {
      order.paymentStatus = "Partially Paid";
      order.paidAmount = order.advanceAmount;   // ₹2000
      order.remainingAmount = order.amount - order.advanceAmount;
      order.status = "Pending";

    } else if (paymentType === "remaining") {
      order.paymentStatus = "Fully Paid";
      order.paidAmount = order.amount;
      order.remainingAmount = 0;
      order.paymentType="full";
      order.status = "Confirmed";

      // 🛒 Clear cart ONLY when full payment is done
      await cartSchema.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );

    } else if (paymentType === "full") {
      order.paymentStatus = "Fully Paid";
      order.paidAmount = order.amount;
      order.remainingAmount = 0;
      order.status = "Confirmed";

      // 🛒 Clear cart
      await cartSchema.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );
    }

    await order.save();

    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Fetch user orders

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("items.product") // fetch product info
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ✅ Fetch all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
       
       const orders = await Order.find({
  $or: [
    { paymentStatus: "Fully Paid" },
    { paymentStatus: "Partially Paid" }
  ]
})
  .populate("user", "name email")
  .sort({ createdAt: -1 });
 
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
// ✅ Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
    console.log("Update order status called",req.body);
    try {
        const { orderId } = req.params;
        const { deliveryStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { deliveryStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

exports.payRemaining = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.paymentStatus === "Fully Paid") {
      return res.json({ success: true, message: "Already fully paid" });
    }

    if (order.remainingAmount <= 0) {
      return res.json({ success: true, message: "No remaining amount" });
    }

    // Razorpay order for remaining payment
    const razorpayOrder = await razorpay.orders.create({
      amount: order.remainingAmount * 100,
      currency: "INR",
      receipt: `remaining_${Date.now()}`,
    });

    // Save new Razorpay order id
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      message: "Remaining payment initiated",
    });

  } catch (error) {
    console.error("Error initiating remaining payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
