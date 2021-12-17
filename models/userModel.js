const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const { v4: uuid } = require('uuid');

const validatePassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  // contains numbers
  if (!(/\d/.test(password))) {
    return false;
  }
  // contains letters
  if (!(/[a-zA-Z]/g.test(password))) {
    return false;
  }
  // contains capital chars
  if (!(/[A-Z]/g.test(password))) {
    return false;
  }
  // contains lowercase chars
  if (!(/[a-z]/g.test(password))) {
    return false;
  }
  return true;
};

const userSchema = mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'User name is required']
  },
  lastName: {
    type: 'string',
    required: [true, 'Last name is required']
  },
  email: {
    type: 'string',
    unique: true,
    validate: {
      validator: emailValidator.validate,
      message: 'Please provide valid email address'
    }
  },
  phoneNumber: {
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
  password: {
    type: 'string',
    required: [true, 'Password is required'],
    select: false,
    validate: {
      validator: validatePassword,
      message: 'Password does not meet the security criteria'
    }
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

// ------ MIDDLEWARES ------
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 14);
  next();
});

// ------ METHODS ------
userSchema.methods.checkPassword = function(currentPassword, candidatePassword) {
  return bcrypt.compare(candidatePassword, currentPassword);
}

userSchema.methods.passwordChanged = function(passwordChangedTimeStamp, jwtTimeStamp) {
  if (passwordChangedTimeStamp) {
    passwordChangedTimeStamp = parseInt(
      new Date(passwordChangedTimeStamp).getTime() * 1000, 10
    );
    return passwordChangedTimeStamp > jwtTimeStamp;
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const token = uuid();
  this.passwordResetToken = token;
  this.passwordResetExpires = parseInt(
    Date.now() + +process.env.PASSWORD_RESET_EXPIRESIN * 60 * 60 * 1000
  );
  return token;
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;