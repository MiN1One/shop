const express = require('express');
const productController = require('../controllers/productController');
const reviewRoutes = require('./reviewRoutes');
const orderRoutes = require('./orderRoutes');
const authController = require('../controllers/authController');
const prefixParam = require('../utils/prefixParam');
const imagesRoute = require('./imagesRoute');
const ProductModel = require('../models/productModel');

const router = express.Router({ mergeParams: true });

router.use('/:productId/reviews', reviewRoutes);
router.use('/:productId/orders', orderRoutes);
router.use('/:productId/images', imagesRoute(ProductModel, 10, 500, 768));

router
  .route('/')
  .post(productController.createProduct)
  .get(
    prefixParam('collection'),
    productController.getAllProducts
  );
  
router
  .route('/:productId')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .get(productController.getSingleProduct);

module.exports = router;