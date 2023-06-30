const multer = require('multer');
const path = require('path');

// Create a storage object with destination and filename options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/user/profiles');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const username = req.body.username;
    cb(null, username + extension);
  }
});

// Check if the uploaded file is an image
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

// Create the multer middleware object with the storage and fileFilter options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
}).single('profilePic');

// Middleware function to handle the file upload
const uploadProfilePic = function (req, res, next) {
    // Use the express-validator middleware to validate the fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
  
    // Use multer to handle the file upload
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        next(new ErrorResponse('File size too large', 400));
      } else if (err) {
        // An unknown error occurred when uploading.
        next(new ErrorResponse(err.message, 400));
      } else {
        // Everything went fine.
        next();
      }
    });
  };

module.exports = uploadProfilePic;