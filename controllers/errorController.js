const getDevelopmentError = (error, request) => {
  return {
    status: error.status || 'error',
    message: error.message,
    error: error
  };
};

const getProductionError = (error, request) => {
  return {
    status: error.status || 'error',
    message: error.message
  }
};

module.exports = (error, req, res, next) => {
  console.log(error);
  let errorObj;
  if (process.env.NODE_ENV === 'development') {
    errorObj = getDevelopmentError(error, req);
  } else if (process.env.NODE_ENV === 'production') {
    errorObj = getProductionError(error, req);
  }
  res.status(error.statusCode || 500).json(errorObj);
};