module.exports = (resourceName) => (
  (req, _, next) => {
    const prefix = `${resourceName}Id`;
    const param = req.params[prefix];
    if (param) {
      req.query[prefix] = param;
    }
    next();
  }
)