const ReviewModel = require('../models/reviewModel');
const { getAllDocuments } = require('../utils/factory');

exports.getAllReviews = getAllDocuments(ReviewModel, 'reviews');