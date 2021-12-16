const CartItemModel = require('../models/cartModel');
const {
  getAllDocuments,
  getSingleDocument,
  deleteDocument,
  updateDocument,
  createDocument
} = require('../utils/factory');

exports.getAllCartItems = getAllDocuments(CartItemModel, 'cartItems');
exports.getSingleCartItem = getSingleDocument(CartItemModel, 'cartItem');
exports.deleteCartItem = deleteDocument(CartItemModel, 'cartItem');
exports.updateCartItem = updateDocument(CartItemModel, 'cartItem');
exports.createCartItem = createDocument(CartItemModel, 'cartItem');