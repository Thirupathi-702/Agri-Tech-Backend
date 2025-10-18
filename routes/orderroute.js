const express = require("express");
const {
    createOrder,
    verifyPayment,
    getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();
const auth = require("../middleware/auth"); // if you have JWT

router.post("/create-order", auth, createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/my-orders", auth, getUserOrders);

module.exports = router;
