const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errorController');

const productsRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(errorController);

module.exports = app;