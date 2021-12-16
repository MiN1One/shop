const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

exports.login = catchAsync(async (req, res, next) => {
  const { password, phoneNumber } = req.body;
  if (!password || !phoneNumber) {
    return next(new ApiError('Please provide both password and phone number'), 400);
  }
  const user = await UserModel.findOne({ phoneNumber }).select('+password');
  if (!user || !(await user.checkPassword(user.password, password))) {
    return next(new ApiError('Wrong password or user does not exist'), 401);
  }
  const token = jwt.sign(
    { phoneNumber }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRESIN }
  );
  res.cookie('token', token, {
    httpOnly: process.env.NODE_ENV !== 'development',
    secure: process.env.NODE_ENV !== 'development',
    sameSite: true,
    expires: new Date(
      Date.now() + process.env.AUTH_COOKIE_EXPIRESIN * 60 * 60 * 1000
    )
  });
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const candidateUser = req.body.user;
  const user = await UserModel.create({
    phoneNumber: candidateUser.phoneNumber,
    email: candidateUser.email,
    name: candidateUser.name,
    lastName: candidateUser.lastName,
    password: candidateUser.password
  });
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const authToken = req.cookies.token || (
    req.headers.authorization?.startsWith('Bearer') && 
    req.headers.authorization.split(' ')[1]
  );

  if (!authToken) {
    return next(new ApiError('Invalid auth token provided', 401));
  }

  const parsedToken = jwt.verify(authToken, process.env.JWT_SECRET);
  const user = await UserModel.findOne({ phoneNumber: parsedToken.phoneNumber });
  
  if (!user) {
    return next(new ApiError('Such user does no longer exist', 403));
  }

  req.user = user;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {

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