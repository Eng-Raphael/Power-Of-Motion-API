const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Secretary = require('../models/Secretary');

exports.protect = asyncHandler(async (req, res, next) => {
  
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (decoded.role === 'admin') {
      
      const admin = await Admin.findById(decoded.id);

      if (!admin) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }

      req.admin = admin;
    }else if(decoded.role === 'secretary'){
      
      const secretary = await Secretary.findById(decoded.id);

      if (!secretary) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }

      req.secretary = secretary;

    } else {
      
      const user = await User.findById(decoded.id);

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

exports.authorize = (...roles) => {
  return (req, res, next) => {
    let user;

    if (req.admin) {
      user = req.admin;
    } else if (req.user) {
      user = req.user;
    }else if(req.secretary){
      user = req.secretary;
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

exports.authorizeMultiple = (...roles) => {
  return (req, res, next) => {
    let user;

    if (req.admin) {
      user = req.admin;
    } else if (req.user) {
      user = req.user;
    } else if (req.secretary) {
      user = req.secretary;
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