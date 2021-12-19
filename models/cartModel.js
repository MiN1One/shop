const mongoose = require('mongoose');
const { lineItemSchema } = require('./orderModel');

const cartItemSchema = mongoose.Schema({
  package: [lineItemSchema],
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'User must be known for cart item']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  processed: {
    type: 'boolean',
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const CartItemModel = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItemModel;