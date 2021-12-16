const ReviewModel = require('../models/reviewModel');
const {
  getAllDocuments,
  createDocument,
  deleteDocument,
  updateDocument,
  getSingleDocument
} = require('../utils/factory');

exports.getAllReviews = getAllDocuments(ReviewModel, 'reviews');
exports.createReview = createDocument(ReviewModel, 'review');
exports.deleteReview = deleteDocument(ReviewModel, 'review');
exports.updateReview = updateDocument(ReviewModel, 'review');
exports.getSingleReview = getSingleDocument(ReviewModel, 'review', 'userId', 'productId');