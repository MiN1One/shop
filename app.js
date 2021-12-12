const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/errorController');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorController);

module.exports = app;