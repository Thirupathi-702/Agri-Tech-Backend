const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      SKU,
      price,
      originalPrice,
      category,
      brand,
      quantity,
      description,
      rating,
      reviewCounts,
      discount,
      badge,
      inStock
    } = req.body;

    // Validate required fields
    if (!productName || !SKU || !price) {
      return res.status(400).json({ message: "Product name, SKU, and price are required." });
    }

    // Check for image uploads
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // Extract image URLs (local path or Cloudinary URLs)
    const images = req.files.map(file => file.path);

    // Create a new product
    const newProduct = new Product({
      productName,
      SKU,
      price,
      originalPrice,
      category,
      brand,
      quantity,
      description,
      rating,
      reviewCounts,
      discount,
      badge,
      inStock,
      images
    });

    // Save to DB
    await newProduct.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "❌ Server error while creating product",
      error: error.message
    });
  }
};

// Get all products
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // get product ID from URL params
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle new image uploads (replace old ones)
    let imageUrls = existingProduct.images;
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => file.path);
      images = uploadedImages; // Replace existing images
    }

    // Build updated product data
    const updatedData = {
      productName: req.body.productName || existingProduct.productName,
      SKU: req.body.SKU || existingProduct.SKU,
      price: req.body.price || existingProduct.price,
      originalPrice: req.body.originalPrice || existingProduct.originalPrice,
      category: req.body.category || existingProduct.category,
      brand: req.body.brand || existingProduct.brand,
      quantity: req.body.quantity || existingProduct.quantity,
      description: req.body.description || existingProduct.description,
      rating: req.body.rating || existingProduct.rating,
      reviewCounts: req.body.reviewCounts || existingProduct.reviewCounts,
      discount: req.body.discount || existingProduct.discount,
      badge: req.body.badge || existingProduct.badge,
      inStock: req.body.inStock ?? existingProduct.inStock,
      images// ✅ correct field
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "❌ Error updating product",
      error: error.message
    });
  }
};



// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { storage } = require('./config/cloudinary');
// const Product = require('./models/Product');

// const upload = multer({ storage });

// // Upload product with multiple images
// router.post('/upload', upload.array('images', 5), async (req, res) => {
//   try {
//     const { name, price, quantity } = req.body;

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'Please upload at least one image' });
//     }

//     // Extract Cloudinary URLs from uploaded files
//     const imageUrls = req.files.map(file => file.path);

//     const newProduct = new Product({
//       name,
//       price,
//       quantity,
//       images: imageUrls
//     });

//     await newProduct.save();

//     res.status(201).json({
//       message: 'Product created successfully',
//       product: newProduct
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get all products
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
