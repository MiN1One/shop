const UserModel = require('../models/userModel');
const {
  getAllDocuments,
  getSingleDocument,
  updateDocument,
  deleteDocument,
  createDocument
} = require('../utils/factory');

exports.getAllUsers = getAllDocuments(UserModel, 'users');
exports.getSingleUser = getSingleDocument(UserModel, 'user');
exports.updateUser = updateDocument(UserModel, 'user');
exports.deleteUser = deleteDocument(UserModel, 'user');
exports.createUser = createDocument(UserModel, 'user');