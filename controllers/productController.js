const ProductModel = require("../models/productModel");
const {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getSingleDocument
} = require("../utils/factory");

exports.createProduct = createDocument(ProductModel, 'product');
exports.getAllProducts = getAllDocuments(ProductModel, 'products');
exports.updateProduct = updateDocument(ProductModel, 'product');
exports.deleteProduct = deleteDocument(ProductModel, 'product');
exports.getSingleProduct = getSingleDocument(ProductModel, 'product', 'reviews', 'orders');