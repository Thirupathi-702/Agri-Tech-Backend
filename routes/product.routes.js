const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const productController = require('../controllers/product.controller');

const upload = multer({ storage });


router.post('/upload', upload.array('images', 5), productController.createProduct);


router.get('/', productController.getAllProducts);

module.exports = router;














// const { check } = require('express-validator');
// const upload= require('../middleware/multer');
// // Validation middleware
// const validateProduct = [
//   check('name').not().isEmpty().withMessage('Product name is required'),
//   check('category').isIn(['Seeds', 'Fertilizers', 'Equipment', 'Pesticides', 'Tools', 'Organic'])
//     .withMessage('Invalid category'),
//   check('originalPrice').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
//   check('offerPrice').optional().isFloat({ gt: 0 }),
//   check('SKU').not().isEmpty().withMessage('SKU is required'),
//   check('brand').not().isEmpty().withMessage('Brand is required'),
//   check('images').isArray({ min: 1 }).withMessage('At least one image is required'),
//   check('discount').optional().isInt({ min: 0, max: 100 })
// ];

// // Get all products
// //router.get('/', productController.getAllProducts);

// // Get single product
// //router.get('/:id', productController.getProduct);

// // Add new product (protected route - add auth middleware later)
// //router.post('/',  productController.addProduct);
// //router.post('/',upload.fields([{name:"image1", maxCount:1}]),productController.addProduct);
// router.post("/", upload.array("images", 5), productController.addProduct);


// // Update product (protected route)
// //router.put('/:id', validateProduct, productController.updateProduct);

// // Delete product (protected route)
// //router.delete('/:id', productController.deleteProduct);

// module.exports = router;