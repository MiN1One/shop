const { format, transports, createLogger } = require('winston');

module.exports = createLogger({
  transports: new transports.Console(),
  format: format.combine(
    format.label(),
    format.colorize(),
    format.simple()
  )
});
