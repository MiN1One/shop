const dotenv = require('dotenv');
const mongoose = require('mongoose');
const next = require('next');

process.on('uncaughtException', (er) => {
  console.log('---- UNCAUGHT EXCEPTION ----');
  console.log(er);
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
  .then(() => console.log('MONGODB CONNECTION SUCCESSFUL'))
  .catch(() => console.log('ERROR! MONGODB CONNECTION FAILED'));

const port = +process.env.PORT || 3200;

nextApp
  .prepare()
  .then(() => {
    app.get('*', (req, res) => (
      nextApp.render(req, res, req.path, req.query)
    ));

    const server = app.listen(port, () => (
      console.log(`APP LISTENING ON PORT ${port}`)
    ));
    
    process.on('unhandledRejection', (er) => {
      console.log('---- UNHANDLED REJECTION ----');
      console.log(er);
      server.close(() => process.exit(1));
    });
  })
  .catch((er) => {
    console.log('---- ERROR SETTING UP NEXT SERVER ----');
    console.log(er);
    process.exit(1);
  });
