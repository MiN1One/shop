const express = require('express');
const userController = require('../controllers/userController');
const reviewRoutes = require('./reviewRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');

const router = express.Router();

router.use('/:userId/reviews', reviewRoutes);
router.use('/:userId/orders', orderRoutes);
router.use('/:userId/cartItems', cartRoutes);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:userId')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;