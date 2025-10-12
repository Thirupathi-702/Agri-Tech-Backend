
const Contact = require("../models/Contact");
const { sendAdminContactAlert } = require("../utils/mailer");
const { errorResponse, successResponse } = require("../utils/response");
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message, phone } = req.body;
        if (!name || !email || !message || !phone) {
            return errorResponse(res, "name, email, message and phone are required");
        }

        const newContact = await Contact.create({ name, email, subject, message, phone });

        // Fire-and-forget email (no need to block response)
        sendAdminContactAlert({ name, email, subject, message, phone })
            .catch(err => console.error("Email send failed:", err?.message || err));

        return successResponse(res, "Your message has been received!", { id: newContact._id });
    } catch (error) {
        return errorResponse(res, "Server error", error.message);
    }
};
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message || !phone) {
      return errorResponse(res, "name, email, message and phone are required");
    }

    const newContact = await Contact.create({ name, email, subject, message, phone });

    // Wait for email to finish
    const emailResponse = await sendAdminContactAlert({ name, email, subject, message, phone });

    console.log("Email response:", emailResponse);

    // You can check success based on how sendAdminContactAlert() is implemented
    if (emailResponse?.accepted?.length > 0 || emailResponse?.success) {
      return successResponse(res, "Your message has been received and email sent successfully!", { id: newContact._id });
    } else {
      return errorResponse(res, "Message saved, but email sending failed");
    }

  } catch (error) {
    console.error("Error submitting contact form:", error);
    return errorResponse(res, "Server error", error.message);
  }
};
