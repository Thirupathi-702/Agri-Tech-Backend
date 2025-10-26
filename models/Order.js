const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items:
        {type : Object , required : true},//[
            // {
            //     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            //     quantity: { type: Number, default: 1 },
            //     price: { type: Number, required: true },
            //      name: { type: String, required: true },
            //         images: { type: String },
            // },
        //],
        address : {type : Object , required : true},
        amount: { type: Number, required: true },
        status: { type: String, default: "pending" },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
