const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "in_progress", "resolved", "archived"], default: "new", index: true },
    tags: [{ type: String, trim: true }],
    readAt: { type: Date },
    repliedAt: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ subject: "text", message: "text", name: "text" });

module.exports = mongoose.model("Contact", contactSchema);
