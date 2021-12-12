const ProductModel = require("../models/productModel");

exports.createProduct = (req, res, next) => {
  const product = ProductModel.create(req.body.product);
  res.status(200).json({
    status: 'success',
    data: { product }
  });
};