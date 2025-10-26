const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/profile', authController.getProfile);
router.put('/update-profile', authController.updateProfile);
router.put('/update-password', authController.updatePassword);


module.exports = router;