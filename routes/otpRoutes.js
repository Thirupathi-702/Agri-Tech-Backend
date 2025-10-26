const express = require("express");
const User = require("../models/User");
const { generateOTP, sendOtp } = require("../utils/otp");

const router = express.Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const otp = generateOTP();
    console.log("Generated OTP:", otp); // For testing purposes 
    await sendOtp(phone, otp);

    // Save OTP and expiry in user or OTP collection
    // let user = await User.findOne({ phone });
    // if (!user) user = new User({ phone, verified: false });

    // user.otp = otp; // temporary field
    // user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    // await user.save();

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    //const user = await User.findOne({ phone });
    // if (!user) return res.status(404).json({ message: "User not found" });

    // if (user.otp !== otp || Date.now() > user.otpExpiry) {
    //   return res.status(400).json({ message: "Invalid or expired OTP" });
    // }

    // user.verified = true;
    // user.otp = undefined;
    // user.otpExpiry = undefined;
    // await user.save();

    return res.status(200).json({ message: "Phone verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
