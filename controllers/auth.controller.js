const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Cart = require("../models/Cart");
const { sendResponse } = require("../utils/response");
// Sign up controller
exports.signup = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "All fields (name, email, password) are required");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, "Email already in use");
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    return sendResponse(res, 201, true, "User registered successfully", { token, userId: user._id });
  } catch (err) {
    console.error("Signup Error:", err);
    return sendResponse(res, 500, false, "Internal Server Error", { error: err.message });
  }
};

// Sign in controller
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // return res.status(401).json({ message: 'Invalid credentials' });
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { password: _, ...userWithoutPassword } = user.toObject();


    return sendResponse(res, 200, true, "User signed in successfully", { token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};


exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return sendResponse(res, 401, false, "No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return sendResponse(res, 401, false, "Invalid token");

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return sendResponse(res, 404, false, "User not found");

    // ✅ Fetch the user's cart from Cart collection
    const cart = await Cart.findOne({ user: user._id })
      .populate("items.product", "productName price images SKU category brand");


    return sendResponse(res, 200, true, "Profile fetched successfully", { user, cart: cart ? cart.items : [] });
  } catch (err) {
    return sendResponse(res, 401, false, "Invalid or expired token");
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return sendResponse(res, 401, false, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const { name } = req.body;

    // Only allow updating name
    if (name) user.name = name;

    await user.save();

    // Exclude password in response
    const { password: _, ...updatedUser } = user.toObject();


    return sendResponse(res, 200, true, "Profile updated successfully", { user: updatedUser });

  } catch (err) {
    console.error(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return sendResponse(res, 401, false, "Invalid or expired token");
    }
    return sendResponse(res, 500, false, "Server error", { error: err.message });
  }
};





exports.updatePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendResponse(res, 400, false, "Both current and new passwords are required");
    }

    if (!token) {
      return sendResponse(res, 401, false, "No token provided");
    }



    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return sendResponse(res, 404, false, "User not found");


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return sendResponse(res, 400, false, "Current password is incorrect");


    user.password = newPassword; // pre-save hook will hash automatically
    await user.save();

    return sendResponse(res, 200, true, "Password updated successfully");
  } catch (err) {
    return sendResponse(res, 500, false, "Error updating password", { error: err.message });
  }
};
