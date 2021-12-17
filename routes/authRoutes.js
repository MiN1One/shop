const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/resetPassword', authController.resetPassword);

router.post(
  '/updateSelf', 
  authController.protect, 
  authController.updateSelf
);

router.post(
  '/updatePassword', 
  authController.protect,
  authController.updatePassword
);

module.exports = router;