const express = require('express');
const productController = require('../controllers/productController');
const reviewRoutes = require('./reviewRoutes');
const orderRoutes = require('./orderRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/:productId/reviews', reviewRoutes);
router.use('/:productId/orders', orderRoutes);

router
  .route('/')
  .post(productController.createProduct)
  .get(
    authController.protect,
    productController.getAllProducts
  )
  
router
  .route('/:productId')
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct)
  .get(productController.getSingleProduct);

module.exports = router;