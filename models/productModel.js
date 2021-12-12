const mongoose = require('mongoose');

const productVariantSchema = mongoose.Schema({
  price: {
    type: 'number',
    required: [true, 'Variant must have a price']
  },
  title: {
    type: 'string',
    required: [true, 'Variant must have a title']
  },
  images: ['string'],
  specs: 'object',
  description: {
    type: 'string',
    maxLength: 300
  }
});

const productSchema = mongoose.Schema({
  title: {
    type: 'string',
    required: [true, 'Product must have a title'],
    minLength: 1,
    maxLength: 45
  },
  price: {
    type: 'number',
    required: [true, 'Product price must be specified']
  },
  currency: {
    type: 'string',
    default: 'UZS'
  },
  images: ['string'],
  previewImage: 'string',
  createdAt: {
    default: Date.now,
    type: Date
  },
  variants: [productVariantSchema],
  description: {
    type: 'string',
    maxLength: 1000
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('reviews', {
  localField: '_id',
  foreignField: 'productId',
  ref: 'Review'
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;