
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
