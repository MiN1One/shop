const getDevelopmentError = (error, request) => {
  return {
    status: error.status || 'error',
    message: error.message,
    error: error
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

module.exports = (error, req, res, next) => {
  console.log(error);
  let errorObj;
  if (process.env.NODE_ENV === 'development') {
    errorObj = getDevelopmentError(error, req);
  } else if (process.env.NODE_ENV === 'production') {
    errorObj = getProductionError(error, req);
  }
  res.status(errorObj.statusCode).json(errorObj.content);
};