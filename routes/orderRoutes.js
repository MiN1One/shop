const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route('/:orderId')
  .get(orderController.getSingleOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;