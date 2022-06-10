const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '../data');

exports.getShopSettings = async () => {
  let settings = await promisify(fs.readFile)(SETTINGS_PATH + 'shopConfig.json');
  if (typeof settings === 'string') {
    settings = JSON.parse(settings);
  }
  return settings;
};