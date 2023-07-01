const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user's role
    if (decoded.role === 'admin') {
      // Get admin by ID
      const admin = await Admin.findById(decoded.id);

      // Make sure admin exists
      if (!admin) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }

      req.admin = admin;
    } else {
      // Get user by ID
      const user = await User.findById(decoded.id);

      // Make sure user exists
      if (!user) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }

      req.user = user;
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    let user;

    if (req.admin) {
      user = req.admin;
    } else if (req.user) {
      user = req.user;
    } else {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    if (!roles.includes(user.role)) {
      return next(
        new ErrorResponse(
          `User role ${user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};