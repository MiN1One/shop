const CollectionModel = require('../models/collectionModel');
const {
  getAllDocuments,
  createDocument,
  getSingleDocument,
  updateDocument,
  deleteDocument
} = require('../utils/factory');

exports.getAllCollections = getAllDocuments(CollectionModel, 'collection');
exports.createCollection = createDocument(CollectionModel, 'collection');
exports.updateCollection = updateDocument(CollectionModel, 'collection');
exports.deleteCollection = deleteDocument(CollectionModel, 'collection');

exports.getSingleCollection = getSingleDocument(
  CollectionModel, 
  'collection', 
  { path: 'products', limit: 20 }
);
