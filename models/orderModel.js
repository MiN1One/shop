const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

exports.lineItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: [true, 'Line item must have a product ID']
  },
  quantity: {
    type: 'number',
    required: [true, 'Line item must have a quantity']
  }
});

const orderSchema = mongoose.Schema({
  package: [this.lineItemSchema],
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID must be provided']
  },
  pickedUp: {
    type: 'boolean',
    default: false
  },
  cartItemId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CartItem'
  },
  click_trans_id: 'string',
  totalPriceWithDiscount: {
    type: 'number',
    required: [true, 'Total price with discount is required']
  },
  totalPrice: {
    type: 'number',
    required: [true, 'Total price must be provided']
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
  },
  updatedAt: Date
});

orderSchema.pre('updateOne', function() {
  this.set({ updatedAt: Date.now() });
});

const OrderModel = mongoose.model('Order', orderSchema);

exports.OrderModel = OrderModel;