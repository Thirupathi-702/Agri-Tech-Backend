const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/wishlist', require('./wishlistRoutes'));


router.use("/contact", require("./contactRoutes"));
router.use("/admin/contacts", require("./contactAdminRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/otp", require("./otpRoutes"));
module.exports = router;