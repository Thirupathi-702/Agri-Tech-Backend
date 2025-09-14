const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/wishlist', require('./wishlist.routes'));
module.exports = router;