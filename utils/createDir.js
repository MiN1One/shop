const fs = require('fs');
const { promisify } = require('util');

module.exports = async (dir) => {
  if (!fs.existsSync(dir)) {
    await promisify(fs.mkdir)(dir, { recursive: true });
  }
};