const paymentErrorMessages = {
  '0': 'Success Successful request',
  '-1': 'SIGN CHECK FAILED! Signature verification error',
  '-2': 'Incorrect parameter amount Invalid payment amount',
  '-3': 'Action not found The requested action is not found',
  '-4': 'Already paid The transaction was previously confirmed',
  '-5': 'User does not exist Do not find a user / order (check parameter merchant_trans_id)',
  '-6': 'Transaction does not exist The transaction is not found (check parameter merchant_prepare_id)',
  '-7': 'Failed to update user An error occurred while changing user data',
  '-8': 'Error in request from click The error in the request from CLICK',
  '-9': 'Transaction cancelled'
};

const getDevelopmentError = (error, request) => {
  return {
    status: error.status || 'error',
    message: error.message,
    error: error,
    statusCode: error.statusCode || 500
  };
};

const getProductionError = (error, request) => {
  const userError = { ...error };
  if (error.name === 'TokenExpiredError') {
    userError.message = 'Invalid auth token provided, please reauthorize';
    userError.status = 'fail';
    userError.statusCode = 401;
  }
  return userError;
};

const getPaymentError = (error) => {
  const { paymentError } = error;
  const errorCode = paymentError.error;
  return {
    content: {
      error: errorCode,
      error_note: paymentErrorMessages[errorCode],
      ...paymentError.content
    },
    statusCode: error.statusCode
  };
};

module.exports = (error, req, res, next) => {
  console.log(error, error.stack);
  let errorObj;
  if (!error.paymentError) {
    if (process.env.NODE_ENV === 'development') {
      errorObj = getDevelopmentError(error, req);
    } else if (process.env.NODE_ENV === 'production') {
      errorObj = getProductionError(error, req);
    }
  } else {
    errorObj = getPaymentError(error);
  }
  res.status(errorObj.statusCode).json(errorObj.content);
};