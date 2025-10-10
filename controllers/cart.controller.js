const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

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
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, action } = req.body;

        const cart = await Cart.findOne({ user: userId });
        //const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Product not in cart" });

        if (action === "increment") {
            item.quantity += 1;
        } else if (action === "decrement") {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(i => i.product.toString() !== productId);
            }
        }

        await cart.save();

        res.status(200).json(cart.items);
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {

        const userId = req.userId;
        //  console.log(userId)
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.json({ items: [] });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing product", error: error.message });
    }
};

// Add item to cart
// exports.addToCart = async (req, res) => {
//     try {
//         const userId = req.userId; // from JWT middleware
//         const { productId, quantity } = req.body;

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ message: "Product not found" });

//         // Check if already in cart
//         const existingItem = user.cart.find(
//             (item) => item.product.toString() === productId
//         );

//         if (existingItem) {
//             existingItem.quantity += quantity || 1;
//         } else {
//             user.cart.push({ product: productId, quantity: quantity || 1 });
//         }

//         await user.save();
//         res.status(200).json({ message: "Added to cart", cart: user.cart });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Get user cart
// exports.getCart = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const user = await User.findById(userId).populate("cart.product");

//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ cart: user.cart });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Remove item from cart
// exports.removeFromCart = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { productId } = req.body;

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         user.cart = user.cart.filter(
//             (item) => item.product.toString() !== productId
//         );

//         await user.save();
//         res.status(200).json({ message: "Removed from cart", cart: user.cart });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.updateCartQuantity = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { productId, action } = req.body;
//         console.log(req.body)// action = "increment" | "decrement"

//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         const item = cart.items.find(i => i.product.toString() === productId);
//         if (!item) return res.status(404).json({ message: "Product not in cart" });

//         if (action === "increment") {
//             item.quantity += 1;
//         } else if (action === "decrement") {
//             item.quantity -= 1;
//             if (item.quantity <= 0) {
//                 cart.items = cart.items.filter(i => i.product.toString() !== productId); // remove item if 0
//             }
//         }

//         await cart.save();
//         res.status(200).json(cart);

//     } catch (error) {
//         res.status(500).json({ message: "Error updating cart", error: error.message });
//     }
// };
