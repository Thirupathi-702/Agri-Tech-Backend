// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: ['Seeds', 'Fertilizers', 'Equipment', 'Pesticides', 'Tools', 'Organic']
//   },
//   rating: {
//     type: Number,
//     min: [0, 'Rating must be at least 0'],
//     max: [5, 'Rating cannot be more than 5'],
//     default: 0
//   },
//   reviews: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     comment: String,
//     rating: Number,
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   originalPrice: {
//     type: Number,
//     required: [true, 'Original price is required'],
//     min: [0, 'Price cannot be negative']
//   },
//   offerPrice: {
//     type: Number,
//     validate: {
//       validator: function(value) {
//         return !value || value <= this.originalPrice;
//       },
//       message: 'Offer price cannot be higher than original price'
//     }
//   },
//   SKU: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   brand: {
//     type: String,
//     required: [true, 'Brand is required']
//   },
//   // Updated images field to store objects with url and public_id
//   images: [{
//     url: {
//       type: String,
//       required: true
//     },
//     public_id: {
//       type: String,
//       required: true
//     }
//   }],
//   discount: {
//     type: Number,
//     min: [0, 'Discount cannot be negative'],
//     max: [100, 'Discount cannot be more than 100%'],
//     default: 0
//   },
//   badge: {
//     type: String,
//     enum: ['Best Seller', 'New Arrival', 'Trending', 'Limited Stock', '']
//   },
//   inStock: {
//     type: Boolean,
//     default: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Validate at least one image is provided
// ProductSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
  
//   if (!this.images || this.images.length === 0) {
//     const error = new Error('At least one image is required');
//     error.name = 'ValidationError';
//     return next(error);
//   }
  
//   next();
// });

// module.exports = mongoose.model('Product', ProductSchema);
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     //required: true
//   },
//   price: {
//     type: Number,
//     //required: true
//   },
//   quantity: {
//     type: Number,
//     //required: true
//   },
//   imageUrl: {
//     type: String,
//     //required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  images: [String], // Array of image URLs
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);


// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     enum: ["Seeds", "Tools", "Machinery", "Fertilizers", "Pesticides"],
//     required: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   discountPrice: {
//     type: Number,
//     default: null
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   images: {
//     type: [String], // array of Cloudinary URLs
//     validate: {
//       validator: (val) => Array.isArray(val) && val.length > 0,
//       message: "At least one image is required"
//     }
//   },
//   brand: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   rating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Product", productSchema);
