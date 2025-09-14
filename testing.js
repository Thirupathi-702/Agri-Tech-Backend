
// // const express = require('express');
// // const router = express.Router();
// // const multer = require('multer');
// // const { storage } = require('./config/cloudinary'); 
// // const Product = require('./models/Product'); 

// // const upload = multer({ storage });


// // router.post('/upload', upload.single('image'), async (req, res) => {
// //   try {
// //     const { name, price, quantity } = req.body;
    
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'Please upload an image' });
// //     }

// //     const newProduct = new Product({
// //       name,
// //       price,
// //       quantity,
// //       imageUrl: req.file.path // Cloudinary URL
// //     });

// //     await newProduct.save();
    
// //     res.status(201).json({
// //       message: 'Product created successfully',
// //       product: newProduct
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // // Get all products
// // router.get('/', async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // module.exports = router;
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
