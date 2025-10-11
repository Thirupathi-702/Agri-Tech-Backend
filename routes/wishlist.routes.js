const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth"); // JWT middleware
const { sendResponse, successResponse, errorResponse } = require('../utils/response');
// ✅ Get wishlist items
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
        if (!wishlist) return sendResponse(res, 404, false, "Wishlist not found", { products: [] });

        return sendResponse(res, 200, true, "Wishlist fetched successfully", { products: wishlist.products });
    } catch (err) {
        return sendResponse(res, 500, false, "Error fetching wishlist", { error: err.message });
    }
});

// ✅ Add product to wishlist
router.post("/add/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        // check if product exists
        const product = await Product.findById(productId);
        if (!product) return sendResponse(res, 404, false, "Product not found");

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return sendResponse(res, 400, false, "Product already in wishlist");
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();
        return sendResponse(res, 200, true, "Product added to wishlist", { wishlist });
    } catch (err) {
        return sendResponse(res, 500, false, "Error adding to wishlist", { error: err.message });
    }
});

// ✅ Remove product from wishlist
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) return sendResponse(res, 404, false, "Wishlist not found");

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();
        return sendResponse(res, 200, true, "Product removed from wishlist", { wishlist });
    } catch (err) {
        return sendResponse(res, 500, false, "Error removing from wishlist", { error: err.message });
    }
});

module.exports = router;
