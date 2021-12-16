const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(cartController.getAllCartItems)
  .post(cartController.createCartItem)

router
  .route('/:carItemId')
  .get(cartController.getSingleCartItem)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

module.exports = router;