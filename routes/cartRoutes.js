const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth"); // JWT auth

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCart);
router.delete("/remove/:productId", authMiddleware, cartController.removeFromCart);
router.put("/update", authMiddleware, cartController.updateCartQuantity);

module.exports = router;
