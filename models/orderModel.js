const mongoose = require('mongoose');
const { v5: uuid } = require('uuid');

const lineItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'Line item must have a product ID']
  },
  quantity: {
    type: 'number',
    required: [true, 'Line item must have a quantity']
  }
});

const orderSchema = mongoose.Schema({
  package: [lineItemSchema],
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID must be provided']
  },
  orderId: {
    type: 'string',
    default: uuid(),
    unique: true
  },
  click_trans_id: 'string',
  totalPrice: 'number',
  totalQuantity: {
    type: 'number',
    required: [true, 'Quantity must be given']
  },
  prepareId: {
    type: 'string',
    default: uuid(),
    unique: true
  },
  cancelled: {
    type: 'boolean',
    default: false
  },
  refunded: {
    type: 'boolean',
    default: false
  },
  paid: {
    type: 'boolean',
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;