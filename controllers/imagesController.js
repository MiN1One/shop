const multer = require('multer');
const sharp = require('sharp');
const createDir = require('../utils/createDir');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const path = require('path');

const multerFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ApiError('Bad input', 400), false);
  }
  cb(null, true);
};

const upload = multer({
  fileFilter: multerFilter,
  storage: multer.memoryStorage()
});

exports.saveImages = (imageCount) => {
  if (imageCount === 1) {
    upload.single('image')
  }
  return upload.array('image', imageCount);
};

exports.processImages = (resourceName, imageOptions) => (
  catchAsync(async (req, _res, next) => {
    imageOptions = imageOptions || {
      quality: 85,
      width: 800,
      height: 640
    };
    let files = (req.files?.length && req.files) || req.file;
    if (!files) {
      return next(new ApiError('Bad input', 400));
    }

    const paramId = req.params[`${resourceName}Id`];
    const directory = `./public/images/${resourceName}/${paramId}`;
    await createDir(directory);

    req['resourceId'] = paramId;
    req.body['images'] = [];

    const promises = files.map(async (file, fileIndex) => {
      const fileName = `${fileIndex}_${file.originalname}.jpeg`;
      req.body.images.push(fileName);
      return sharp(file.buffer)
        .toFormat('jpeg')
        .resize(imageOptions.width, imageOptions.height)
        .jpeg({ quality: imageOptions.quality })
        .toFile(path.join(__dirname, directory, fileName));
    });
    await Promise.all(promises);

    next();
  })
);

exports.updateDatabase = (Model) => (
  catchAsync(async (req, res, next) => {
    res.status(201).end();
  })
);