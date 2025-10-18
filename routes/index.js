const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/wishlist', require('./wishlist.routes'));


router.use("/contact", require("./contactRoutes"));
router.use("/admin/contacts", require("./contactAdminRoutes"));
router.use("/orders", require("./orderroute"));
module.exports = router;