
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const cartSchema = require("../models/Cart");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create order and save in DB
exports.createOrder = async (req, res) => {
    try {
        const { amount, items,address } = req.body;
        
        const userId = req.userId; // From auth middleware
       console.log("Creating order for user:", items);
        const formattedItems=items
    //     const formattedItems = items.map((item) => ({
    //         product: item.product._id,            
    //         name: item.product.productName,      
    //         price: item.product.price,            
    //         quantity: item.quantity,       
    //         images: item.product.images[0],      
    // }));
        // Create Razorpay order
        const options = {
            amount: amount * 100, // in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save order in DB
        const newOrder = new Order({
            user: userId,
            amount,
            address,
            items: formattedItems,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "created",
        });

        await newOrder.save();

        res.json({
            success: true,
           orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Verify payment and update DB
exports.verifyPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: "paid",
                },
                { new: true }
            );
       await cartSchema.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
    );
            return res.json({ success: true, message: "Payment verified & order updated", order });
        } else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed" }
            );
            return res.json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, error: error.message });
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
