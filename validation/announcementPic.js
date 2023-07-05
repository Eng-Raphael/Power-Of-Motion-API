const multer = require('multer');
const path = require('path');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/announcements/images');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, timestamp + extension);
  }
});

const fileFilter = function (req, file, cb) {
  const allowedExtensions = /\.(png|jfif|jpg|jpeg|pdf|svg|heif|hevc)$/;
  const extname = path.extname(file.originalname);
  const isExtensionAllowed = allowedExtensions.test(extname);
  const isMimeTypeAllowed = file.mimetype.startsWith('image/');
  if (isExtensionAllowed && isMimeTypeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
}).single('image');

const uploadImage = function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
  
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        next(new ErrorResponse('File size too large', 400));
      } else if (err) {
        next(new ErrorResponse(err.message, 400));
      } else {
        next();
      }
    });
  };

module.exports = uploadImage;