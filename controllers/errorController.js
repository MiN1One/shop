module.exports = (error, req, res, next) => {

  res.status(er.statusCode).json({
    status: error.status,
    message: error.message
  });
};