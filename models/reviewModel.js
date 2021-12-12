const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'User ID must be provided']
  },
  rating: {
    type: 'number',
    min: [1, 'Rating cannot be below 1'],
    max: [5, 'Rating cannot be above 5']
  },
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'Product ID must be provided']
  },
  userComment: {
    type: 'string',
    required: [true, 'User comment must be provided'],
    minLength: 10,
    maxLength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;