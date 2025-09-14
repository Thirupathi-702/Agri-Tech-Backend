const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth"); // JWT middleware

// ✅ Get wishlist items
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
        if (!wishlist) return res.json({ products: [] });

        res.json({ products: wishlist.products });
    } catch (err) {
        res.status(500).json({ message: "Error fetching wishlist", error: err.message });
    }
});

// ✅ Add product to wishlist
router.post("/add/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        // check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.json({ message: "Product added to wishlist", wishlist });
    } catch (err) {
        res.status(500).json({ message: "Error adding to wishlist", error: err.message });
    }
});

// ✅ Remove product from wishlist
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();
        res.json({ message: "Product removed from wishlist", wishlist });
    } catch (err) {
        res.status(500).json({ message: "Error removing from wishlist", error: err.message });
    }
});

module.exports = router;
