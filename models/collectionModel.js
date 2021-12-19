const mongoose = require('mongoose');
const handleize = require('slugify');

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
  filters: [collectionFiltersSchema],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  handle: 'string',
  active: {
    type: 'boolean',
    default: true
  },
  tags: ['string']
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ------ VIRTUALS ------
collectionSchema.virtual('products', {
  foreignField: 'collectionId',
  localField: '_id',
  ref: 'Product',
  justOne: false
});

// ------ MIDDLEWARES ------
collectionSchema.pre('save', function(next) {
  this.handle = handleize(this.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g
  });
  next();
});

const CollectionModel = mongoose.model('Collection', collectionSchema);

module.exports = CollectionModel;