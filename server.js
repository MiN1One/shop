const dotenv = require('dotenv');
const mongoose = require('mongoose');
const next = require('next');

dotenv.config();

const app = require('./app');
const nextApp = next({ dev: process.env.NODE_ENV === 'development' });

const mongoUrl = process.env.MONGO_CONNECTION.replace(
  '<PASSWORD>', 
  process.env.MONGO_PASSWORD
);

mongoose.connect(mongoUrl)
  .then(() => console.log('MONGODB CONNECTION SUCCESSFUL'))
  .catch(() => console.log('MONGODB CONNECTION FAILED'));

const port = +process.env.PORT || 3200;
nextApp.prepare().then(() => {
  app.get('*', (req, res) => (
    nextApp.render(req, res, req.path, req.query)
  ));
  app.listen(port, (er) => {
    if (er) throw er;
    console.log(`APP LISTENING ON PORT ${port}`)
  });
});
