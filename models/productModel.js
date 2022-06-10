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

const productOptionSchema = mongoose.Schema({
  name: 'string',
  values: ['string']
});

const productSchema = mongoose.Schema({
  title: {
    type: 'string',
    required: [true, 'Product must have a title'],
    minLength: 1,
    maxLength: 45
  },
  productType: {
    type: 'string',
    required: [true, 'Product type is required'],
    maxLength: 50
  },
  active: {
    type: 'boolean',
    default: true
  },
  tags: ['string'],
  options: {
    type: [productOptionSchema],
    validate: [
      (val) => val.length < 5, 
      'Options cannot be more than 5'
    ]
  },
  averageRating: {
    type: 'number',
    default: 1
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
  vendor: {
    type: 'string',
    default: 'self'
  },
  collectionId: { 
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Collection'
  },
  discount: {
    type: 'number',
    default: 0
  },
  createdAt: {
    default: Date.now,
    type: Date
  },
  variants: [productVariantSchema],
  description: {
    type: 'string',
    maxLength: 1000
  },
  numberOfPurchases: {
    type: 'number',
    default: 0
  },
  updatedAt: Date,
  stockQuantity: {
    type: 'number',
    required: [true, 'Product stock quantity is required']
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

productSchema.pre('updateOne', function() {
  this.set({ updatedAt: Date.now() });
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;