'use strict';
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const next = require('next');
const logger = require('./utils/logger');

process.on('uncaughtException', (er) => {
  logger.error('uncaughtException' + er);
  process.exit(1);
});

dotenv.config();

const app = require('./app');
const nextApp = next({ dev: process.env.NODE_ENV === 'development' });

const mongoUrl = process.env.MONGO_CONNECTION.replace(
  '<PASSWORD>', 
  process.env.MONGO_PASSWORD
);

mongoose.connect(mongoUrl)
  .then(() => logger.info('MongoDB connection successful'))
  .catch(() => logger.info('MongoDB connection failed'));

const port = +process.env.PORT || 3200;

nextApp
  .prepare()
  .then(() => {
    app.get('*', (req, res) => (
      nextApp.render(req, res, req.path, req.query)
    ));

    const server = app.listen(port, () => (
      logger.info(`App listening on ${port}`)
    ));
    
    process.on('unhandledRejection', (er) => {
      logger.error('unhandledRejection: ' + er);
      server.close(() => process.exit(1));
    });
  })
  .catch((er) => {
    logger.error(er);
    process.exit(1);
  });
