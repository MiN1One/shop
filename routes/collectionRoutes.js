const express = require('express');
const collectionController = require('../controllers/collectionController');
const authController = require('../controllers/authController');
const productRoutes = require('../routes/productRoutes');

const router = express.Router();

router.use('/:collectionId/products', productRoutes);

router
  .route('/')
  .get(collectionController.getAllCollections)
  .post(
    authController.protect,
    authController.restrict('admin'),
    collectionController.createCollection
  );

router
  .route('/:collectionId')
  .get(collectionController.getSingleCollection)
  .delete(
    authController.protect,
    authController.restrict('admin'),
    collectionController.deleteCollection
  )
  .patch(
    authController.protect,
    authController.restrict('admin'),
    collectionController.updateCollection
  );

module.exports = router;