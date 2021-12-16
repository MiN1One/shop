const { OrderModel } = require('../models/orderModel');
const {
  getAllDocuments,
  getSingleDocument,
  deleteDocument,
  updateDocument,
  createDocument
} = require('../utils/factory');

exports.getAllOrders = getAllDocuments(OrderModel, 'orders');
exports.getSingleOrder = getSingleDocument(OrderModel, 'order');
exports.deleteOrder = deleteDocument(OrderModel, 'order');
exports.updateOrder = updateDocument(OrderModel, 'order');
exports.createOrder = createDocument(OrderModel, 'order');