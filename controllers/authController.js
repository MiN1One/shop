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
  const authToken = req.cookies?.token || (
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
  if (user.passwordChanged(parsedToken.iat)) {
    return next(new ApiError('Password had been changed, please reauthorize', 401));
  }
  req.user = user;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, candidatePassword } = req.body;
  if (!currentPassword || !candidatePassword) {
    return next(new ApiError('Please provide valid passwords', 400));
  }

  const user = await UserModel.findById(req.user._id).select('+password');
  if (!(await user.checkPassword(user.password, currentPassword))) {
    return next(new ApiError('Wrong current password is provided', 403));
  }

  user.password = candidatePassword;
  user.passwordChangedAt = Date.now();
  await user.save({ validateBeforeSave: true });
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.getPasswordResetToken = catchAsync(async (req, res, next) => {
  const { phoneNumber, email } = req.body;
  if (!phoneNumber || !email) {
    return next(new ApiError('Please provide phone number or email address', 400));
  }

  const user = await UserModel.find(
    phoneNumber ? { phoneNumber } : { email }
  );
  if (!user) {
    return next(new ApiError('Such user does not exist', 404));
  }

  const resetToken = user.createPasswordResetToken();
  // send to email service
});

exports.updateSelf = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (user.password) {
    return next(
      new ApiError('Invalid param provided, password cannot be changed via this route', 400)
    );
  }
  const update = {
    phoneNumber: user.phoneNumber,
    name: user.name,
    email: user.email,
    lastName: user.lastName
  };
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id, 
    update, 
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.restrictTo = (...roles) => (
  (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permissions to access this route', 403)
      );
    }
    next();
  }
);