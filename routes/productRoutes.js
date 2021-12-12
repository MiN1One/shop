const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(productController.createProduct)
  .get(productController.getAllProducts);

module.exports = router;