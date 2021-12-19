const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errorController');
const cookieParser = require('cookie-parser');

const collectionRoutes = require('./routes/collectionRoutes');
const productsRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const payRoutes = require('./routes/payRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cartItems', cartRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pay', payRoutes);

app.use(errorController);

module.exports = app;