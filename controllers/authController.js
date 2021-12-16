const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');

exports.login = catchAsync((req, res, next) => {

});

exports.signup = catchAsync((req, res, next) => {
  
});

exports.protect = catchAsync((req, res, next) => {

  req.user = user;
  next();
});

exports.updatePassword = catchAsync((req, res, next) => {

});

exports.restrict = (...roles) => (
  (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permissions to access this route', 403)
      );
    }
    next();
  }
);