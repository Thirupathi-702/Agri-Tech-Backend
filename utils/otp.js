const axios = require("axios");

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP using 2Factor.in
 * @param {string} phone - phone number
 * @param {string} otp - OTP to send
 */
const sendOtp = async (phone, otp) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}`;
    const response = await axios.get(url);

    if (response.data.Status !== "Success") {
      throw new Error("Failed to send OTP");
    }
    return response.data;
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    throw err;
  }
};

module.exports = {
  generateOTP,
  sendOtp
};
