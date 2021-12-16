const ApiError = require('../utils/ApiError');
const ApiFeatures = require('./ApiFeatures');
const catchAsync = require('./catchAsync')

exports.getAllDocuments = (Model, suffix, ...populateObjects) => (
  catchAsync(async (req, res) => {
    const query = new ApiFeatures(req.query, Model.find())
      .filter()
      .paginate()
      .project()
      .mongooseQuery;
      
    if (populateObjects) {
      populateObjects.forEach(p => query.populate(p));
    }
    const documents = await query;
    res.status(200).json({
      status: 'success',
      data: { [suffix]: documents }
    });
  })
);

exports.createDocument = (Model, suffix) => (
  catchAsync(async (req, res, next) => {
    if (!req.body[suffix]) {
      return next(new ApiError('Invalid payload', 400));
    }
    const document = await Model.create(req.body[suffix]);
    res.status(201).json({
      status: 'success',
      data: { [suffix]: document }
    });
  })
);

exports.getSingleDocument = (Model, suffix, ...populateObjects) => (
  catchAsync(async (req, res, next) => {
    const query = new ApiFeatures(
      req.query,
      Model.findById(req.params[`${suffix}Id`])
    )
      .project()
      .mongooseQuery;

    if (populateObjects) {
      populateObjects.forEach(p => query.populate(p));
    }
    const document = await query;
    if (!document) {
      return next(new ApiError('No product is found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { [suffix]: document }
    });
  })
);

exports.deleteDocument = (Model, suffix) => (
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params[`${suffix}Id`]);
    if (!document) {
      return next(new ApiError('No product is found with this ID', 404));
    }
    res.status(204).end();
  })
);

exports.updateDocument = (Model, suffix) => (
  catchAsync(async (req, res, next) => {
    if (!req.body[suffix]) {
      return next(new ApiError('Invalid payload', 400));
    }
    const document = await Model.findByIdAndUpdate(
      req.params[`${suffix}Id`], 
      req.body[suffix],
      { new: true }
    );
    res.status(201).json({
      status: 'success',
      data: { [suffix]: document } 
    });
  })
);