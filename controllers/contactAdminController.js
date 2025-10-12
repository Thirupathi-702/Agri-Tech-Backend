const Contact = require("../models/Contact");
const { errorResponse, successResponse } = require("../utils/response");
// GET /api/admin/contacts
exports.listContacts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            q = "",
            status,
            email,
            from,
            to,
            sort = "-createdAt",
        } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (email) filter.email = email.toLowerCase().trim();
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }
        if (q) {
            // text search
            filter.$text = { $search: q };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Contact.find(filter).sort(sort).skip(skip).limit(Number(limit)),
            Contact.countDocuments(filter),
        ]);

        return successResponse(res, {
            data: items,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (err) {
        return errorResponse(res, { message: "Server error", error: err.message });

    }
};

// GET /api/admin/contacts/:id
exports.getContact = async (req, res) => {
    try {
        const doc = await Contact.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Not found" });

        // mark as read once viewed
        if (!doc.readAt) {
            doc.readAt = new Date();
            await doc.save();
        }

        return successResponse(res, { message: "Fetched" }, doc);
    } catch (err) {
        return errorResponse(res, { message: "Server error", error: err.message });
    }
};

// PATCH /api/admin/contacts/:id
exports.updateContact = async (req, res) => {
    try {
        const { status, tags, replied } = req.body;

        const doc = await Contact.findById(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Not found" });

        if (status) doc.status = status;
        if (Array.isArray(tags)) doc.tags = tags;
        if (replied === true) doc.repliedAt = new Date();

        await doc.save();
        return res.json({ success: true, message: "Updated", data: doc });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// DELETE /api/admin/contacts/:id
exports.deleteContact = async (req, res) => {
    try {
        const doc = await Contact.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: "Not found" });
        return res.json({ success: true, message: "Deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
