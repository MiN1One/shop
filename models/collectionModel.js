const mongoose = require('mongoose');

const collectionFiltersSchema = mongoose.Schema({
  path: {
    type: 'string',
    required: [true, 'Filter path is required']
  },
  relation: {
    type: 'string',
    enum: ['equals', 'includes']
  }
});

const collectionSchema = mongoose.Schema({
  title: {
    type: 'string',
    unique: true,
    maxLength: 25,
    required: [true, 'Collection title is required']
  },
  description: {
    type: 'string',
    maxLength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  filters: {
    
  },
  active: {
    type: 'boolean',
    default: true
  },
  tags: ['string']
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

collectionSchema.virtuals('products', {
  foreignField: 'collectionId',
  localField: '_id',
  ref: 'Product',
  justOne: false
});

const CollectionModel = mongoose.model('Collection', collectionSchema);