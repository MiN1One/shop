const ProductModel = require("../models/productModel");

exports.createProduct = async (req, res, next) => {
  const product = await ProductModel.create(req.body.product);
  res.status(201).json({
    status: 'success',
    data: { product }
  });
};

exports.getAllProducts = async (req, res, next) => {
  const products = await ProductModel.find();
  res.status(200).json({
    status: 'success',
    data: { products }
  });
};