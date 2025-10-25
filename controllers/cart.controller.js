const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { sendResponse } = require('../utils/response');
exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            return sendResponse(res, 400, false, "Product ID is required");
        }
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [{ product: productId, quantity: 1 }] });
        } else {
            const item = cart.items.find(i => i.product.toString() === productId);
            if (item) {
                item.quantity += 1;
            } else {
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        await cart.save();
        return sendResponse(res, 200, true, "Product added to cart", { cart });
    } catch (error) {
        return sendResponse(res, 500, false, "Error adding to cart", { error: error.message });
    }
};
exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, action } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return sendResponse(res, 404, false, "Cart not found", { cart: [] });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return sendResponse(res, 404, false, "Product not in cart", { cart: [] });

        if (action === "increment") {
            item.quantity += 1;
        } else if (action === "decrement") {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(i => i.product.toString() !== productId);
            }
        }

        await cart.save();

        // ✅ Re-fetch the cart with populated product details
        cart = await Cart.findOne({ user: userId }).populate("items.product");

        return sendResponse(res, 200, true, "Cart updated successfully", { cart });
    } catch (error) {
        return sendResponse(res, 500, false, "Error updating cart", { error: error.message });
    }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return sendResponse(res, 200, true, "Cart is empty", { items: [] });
    }

    return sendResponse(res, 200, true, "Cart fetched successfully", { items: cart.items });
  } catch (error) {
    return sendResponse(res, 500, false, "Error fetching cart", { error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return sendResponse(res, 404, false, "Cart not found", { cart: [] });

        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();

        return sendResponse(res, 200, true, "Product removed from cart", { cart });
    } catch (error) {
        return sendResponse(res, 500, false, "Error removing product", { error: error.message });
    }
};

