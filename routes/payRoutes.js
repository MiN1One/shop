const express = require('express');
const payController = require('../controllers/payController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/click/prepare', payController.clickPrepare);
router.post('/click/complete', payController.clickComplete);

router.post(
  '/click/refund/:orderId', 
  authController.protect,
  payController.clickRefund
);

module.exports = router;