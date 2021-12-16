const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'User name is required']
  },
  lastName: {
    type: 'string',
    required: [true, 'Last name is required']
  },
  email: 'string',
  phone_number: {
    type: 'string',
    required: [true, 'Phone number is required'],
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  favorites: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product'
  }],
  active: {
    type: 'boolean',
    default: false
  },
  role: {
    type: 'string',
    enum: {
      values: ['admin', 'user', 'superadmin'],
      message: '{VALUE} user role is not supported'
    },
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: 'string',
  passwordResetExpires: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('reviews', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'Review'
});

userSchema.virtual('orders', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'Order'
});

userSchema.virtual('cartItems', {
  localField: '_id',
  foreignField: 'userId',
  ref: 'CartItem'
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;