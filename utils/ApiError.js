module.exports = class ApiError extends Error {
  constructor(message, statusCode, paymentError) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = this.statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.paymentError = typeof paymentError === 'number' 
      ? { error: paymentError }
      : paymentError;
    Error.captureStackTrace(this, this.constructor);
  }
}