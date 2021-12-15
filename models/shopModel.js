const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
  reauthorize: {
    unit: {
      type: 'string',
      default: 'day'
    },
    value: {
      type: 'number',
      default: 1
    }
  }
});

const ShopModel = mongoose.model('Shop', shopSchema);

module.exports = ShopModel;