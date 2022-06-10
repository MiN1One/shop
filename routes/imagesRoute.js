const express = require('express');
const authController = require('../controllers/authController');
const imagesController = require('../controllers/imagesController');

const createImagesRouter = (Model, imageCount, imageWidth) => {
  const router = express.Router({ mergeParams: true });
  const resourceName = Model.modelName.toLowerCase();

  router
    .route('/')
    .post(
      authController.protect,
      imagesController.saveImages(imageCount),
      imagesController.processImages(resourceName, imageWidth),
      imagesController.updateDatabase(Model)
    );

  return router;
};

module.exports = (Model, imageCount, ...imageWidth) => (
  createImagesRouter(Model, imageCount, imageWidth || [500, 768, 1200])
);