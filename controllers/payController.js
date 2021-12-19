const catchAsync = require('../../holis/holis-api/utils/catchAsync');
const CartItemModel = require('../models/cartModel');
const ApiError = require('../utils/ApiError');
const md5 = require('md5');
const sha1 = require('sha1');
const OrderModel = require('../models/orderModel');
const axios = require('axios');
const ProductModel = require('../models/productModel');

const CLICK_API = 'https://api.click.uz/v2/merchant/payment';

const verifySignToken = (clickRequest) => {
  const hash = md5(
    clickRequest.click_trans_id + 
    clickRequest.service_id + 
    process.env.CLICK_SECRET_KEY + 
    clickRequest.merchant_trans_id + 
    clickRequest.amount + 
    clickRequest.action + 
    clickRequest.sign_time
  );
  return hash === clickRequest.sign_string;
};

const verifyRequest = (clickRequest) => {
  if (!clickRequest || !Object.keys(clickRequest).length) {
    return new ApiError('Unacceptable params provided', 400);
  }
  if (+clickRequest.error < 0) {
    return new ApiError(
      clickRequest.error_note || 'Something went wrong, payment failed',
      500
    );
  }
  if (!verifySignToken(clickRequest)) {
    return new ApiError('Access denied. Invalid signature', 200, -1);
  }
  return null;
};

exports.clickRefund = catchAsync(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.orderId);
  if (!order) {
    return next(new ApiError('Order with this ID was not found', 200, -6));
  }
  const serviceId = process.env.CLICK_SERVICE_ID;
  const paymentId = order.click_trans_id;
  const timeStamp = Date.now();
  const authDigest = sha1(timeStamp + process.env.CLICK_SECRET_KEY);
  const authToken = `${process.env.CLICK_MERCHANT_USER_ID}:${authDigest}:${timeStamp}`;
  const cancelResponse = await axios({
    url: `${CLICK_API}/reversal/${serviceId}/${paymentId}`,
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Auth': authToken,
      'Content-Type': 'application/json'
    }
  });
  res.status(204).json({ transaction: cancelResponse });
});

const verifyPendingOrder = (cartItem) => {
  let validOrder = true;
  cartItem.package.findIndex(package => {
    validOrder = validOrder && (package.productId.quantity >= package.quantity);
    return !validOrder;
  });
  return validOrder;
};

const calculateTotalPrice = (cartItem) => {
  const totalPrice = cartItem.package.reduce((acc, package) => (
    acc + package.productId.price
  ), 0);
  const totalPriceWithDiscount = cartItem.package.reduce((acc, package) => (
    acc + (package.productId.discount / 100) * package.productId.price
  ), 0);
  return {
    finalPrice: totalPrice > totalPriceWithDiscount 
      ? totalPriceWithDiscount 
      : totalPrice,
    totalPrice,
    totalPriceWithDiscount
  };
};

const createNewOrder = async (cartItem) => {
  const { totalPrice, totalPriceWithDiscount } = calculateTotalPrice(cartItem);
  const order = await OrderModel.create({
    package: cartItem.package,
    userId: cartItem.userId,
    totalPrice,
    totalPriceWithDiscount
  });
  return order;
};

exports.clickPrepare = catchAsync(async (req, res, next) => {
  const verificationError = verifyRequest(req.body);
  if (verificationError) {
    return next(verificationError);
  }

  const headPayload = {
    click_trans_id: req.body.click_trans_id,
    merchant_trans_id: req.body.merchant_trans_id,
    merchant_prepare_id: req.body.merchant_prepare_id,
    merchant_confirm_id: req.body.merchant_confirm_id
  };
  const pendingOrder = await CartItemModel
    .findById(req.body.merchant_trans_id)
    .populate('package.productId');

  if (!pendingOrder) {
    return next(new ApiError('Such order does not exist', 200, -5));
  }
  if (pendingOrder.processed) {
    return next(new ApiError('Payment has already been made', 200, -4));
  }
  if (calculateTotalPrice(pendingOrder).finalPrice !== +req.body.amount) {
    return next(new ApiError('Invalid amount', 200, -2));
  }
  if (verifyPendingOrder(pendingOrder)) {
    return next(new ApiError('Cannot complete the transaction', 200, -6))
  }

  const order = await createNewOrder(pendingOrder);

  res.status(200).json({
    ...headPayload,
    merchant_prepare_id: order.prepareId,
    error: 0
  });
});

const restockProducts = async (order) => {
  const updatePromises = order.package.map(async (package) => (
    await ProductModel.findByIdAndUpdate(package.productId, {
      $inc: { quantity: package.quantity } 
    })
  ));
  await Promise.all(updatePromises);
};

const unstockProducts = async (order) => {
  const updatePromises = order.package.map(async (package) => (
    await ProductModel.findByIdAndUpdate(
      package.productId,
      { $inc: -package.quantity }
    )
  ));
  Promise.all(updatePromises);
};

exports.clickComplete = catchAsync(async (req, res, next) => {
  const verificationError = verifyRequest(req.body);
  if (verificationError) {
    return next(verificationError);
  }
  const headPayload = {
    click_trans_id: req.body.click_trans_id,
    merchant_confirm_id: req.body.merchant_confirm_id,
    merchant_trans_id: req.body.merchant_trans_id
  };
  const order = await OrderModel.findOne({
    click_trans_id: +req.body.click_trans_id,
    _id: req.body.merchant_trans_id
  });
  if (!order) {
    return next(new ApiError('Transation is not found', 200, -6));
  }
  if (+req.body.error === -5017) {
    order.refunded = true;
    order.cancelled = true;
    await restockProducts(order);
    return next(new ApiError('Payment cancelled', 200, -9));
  }
  if (+req.body.error === -1 && order.paid) {
    return next(new ApiError('Transaction has already been made', 200, -4));
  }
  if (order.cancelled) {
    order.cancelled = false;
    return next(new ApiError('Reconfirmation for cancelled order', 200, -9));
  }
  if (order.paid) {
    return next(new ApiError('Transaction has already been made', 200, -4));
  }
  await unstockProducts(order);
  order.paid = true;
  await CartItemModel.findByIdAndUpdate(
    req.body.merchant_trans_id, 
    { processed: true }
  );
  await order.save();
  res.status(200).json({
    ...headPayload,
    error: 0
  });
});