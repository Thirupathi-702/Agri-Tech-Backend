const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Cart = require("../models/Cart");
const { sendResponse } = require("../utils/response");






exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
const emailTrimmed = email ? email.trim() : "";

    if (!name || !phone || !password) {
      return sendResponse(res, 400, false, "Name, phone number, and password are required");
    }


    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return sendResponse(res, 400, false, "Phone number already in use");
    }

   
    if (emailTrimmed) {
      const existingEmail = await User.findOne({ email: emailTrimmed });
      if (existingEmail) {
        return sendResponse(res, 400, false, "Email already in use");
      }
    }

   
    const userData = {
      name,
      phone,
      password,
      email: emailTrimmed
    };

    // ✅ Create and save user
    const user = new User(userData);
    await user.save();

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    return sendResponse(res, 201, true, "User registered successfully", {
      token,
      userId: user._id,
      name: user.name,
      phone: user.phone,
      email: emailTrimmed
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return sendResponse(res, 500, false, "Internal Server Error", { error: err.message });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone

    // ✅ Basic validation
    if (!identifier || !password) {
      return sendResponse(res, 400, false, "Email/Phone and password are required");
    }

    let user;

    // ✅ Detect whether identifier is email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isEmail) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }

    if (!user) {
      return sendResponse(res, 401, false, "Invalid email/phone or password");
    }

    // ✅ Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email/phone or password");
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    // Exclude password before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return sendResponse(res, 200, true, "User signed in successfully", {
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error("Signin Error:", err);
    return sendResponse(res, 500, false, "Internal Server Error", { error: err.message });
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

    const { name,email} = req.body;

    // Only allow updating name
    if (name) user.name = name;
    if (email) user.email = email;


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
