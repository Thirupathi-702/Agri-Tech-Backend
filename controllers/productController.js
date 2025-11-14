const Product = require('../models/Product');
const { sendResponse, successResponse, errorResponse } = require("../utils/response");

exports.createProduct = async (req, res) => {
 
  try {
    const {
      productName,
      SKU,
      price,
      originalPrice,
      category,
      brand,
      youTubeUrl,
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
      return sendResponse(res, 400, false, "Product name, SKU, and price are required.");
    }

    // Check for image uploads
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, "Please upload at least one image.");
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
      youTubeUrl,
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
   // console.log("New product created:", newProduct);
    return successResponse(res, "Product created successfully", newProduct, 201);

  } catch (error) {
    console.error("Error creating product:", error);
    return errorResponse(res, "❌ Server error while creating product", error);
  };
};


// Get all products
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return errorResponse(res, "Product not found", {}, 404);

    return successResponse(res, "Product fetched successfully", product);
  } catch (err) {
    return errorResponse(res, "Error fetching product", err, 500);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successResponse(res, "Products fetched successfully", products);
  } catch (error) {
    return errorResponse(res, "Error fetching products", error);
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendResponse(res, 404, false, "Product not found");
    return sendResponse(res, 200, true, "Product deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, "Error deleting product", { error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return sendResponse(res, 404, false, "Product not found");
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
      youTubeUrl: req.body.youTubeUrl || existingProduct.youTubeUrl,
      reviewCounts: req.body.reviewCounts || existingProduct.reviewCounts,
      discount: req.body.discount || existingProduct.discount,
      badge: req.body.badge || existingProduct.badge,
      inStock: req.body.inStock ?? existingProduct.inStock,
      images
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true, runValidators: true }
    );

    return sendResponse(res, 200, true, "✅ Product updated successfully", { product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return sendResponse(res, 500, false, "❌ Error updating product", { error: error.message });
  };
}


