const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errorController');

const productsRoutes = require('./routes/productRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/products', productsRoutes);

app.use(errorController);

module.exports = app;