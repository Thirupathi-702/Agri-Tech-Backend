
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    SKU: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String },
    brand: { type: String },
    quantity: { type: Number, default: 0 },
    description: { type: String }, 
    youtubeUrl: { type: String },   
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCounts: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    badge: { type: String },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }  // ✅ Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Product", productSchema);

