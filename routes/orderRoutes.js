const express = require("express");
const {
    createOrder,
    verifyPayment,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();
const auth = require("../middleware/auth"); 
const adminOnly = require("../middleware/adminOnly");
router.post("/place-order", auth, createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/my-orders", auth, getUserOrders);
router.get("/all-orders",auth, adminOnly, getAllOrders); 
router.get("/update-status/:orderId", auth, adminOnly, updateOrderStatus); 
module.exports = router;
