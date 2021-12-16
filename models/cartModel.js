const mongoose = require('mongoose');
const { lineItemSchema } = require('./orderModel');

const cartItemSchema = mongoose.Schema({
  package: [lineItemSchema],
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const CartItemModel = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItemModel;