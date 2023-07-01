const { body } = require('express-validator');
const Admin = require('../models/Admin');

// Middleware for validating admin registration
exports.validateAdminRegistration = [
    body('name')
    .isLength({  max: 12 })
    .withMessage('name must be max 12 characters long')
    .notEmpty()
    .withMessage('Name field is required')
    .custom(async (value, { req }) => {
        const existingAdmin = await Admin.findOne({ name: value });
        if (existingAdmin) {
          throw new Error('name already exists');
        }
        return true;
    }),

    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please add a valid email')
    .custom(async (value, { req }) => {
      const existingAdmin = await Admin.findOne({ email: value });
      if (existingAdmin) {
        throw new Error('Email already exists');
      }
      return true;
    })
    .matches(/^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/)
    .withMessage('Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain'),

    body('username')
    .isLength({  max: 8 })
    .withMessage('name must be max 8 characters long')
    .notEmpty()
    .withMessage('Username field is required')
    .custom(async (value, { req }) => {
        const existingAdmin = await Admin.findOne({ username: value });
        if (existingAdmin) {
          throw new Error('username already exists');
        }
        return true;
    }),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/)
    .withMessage('Password must contain at least one of the following characters: @, _, #, $, or &'),

    body('role')
    .isIn(['admin'])
    .withMessage('Invalid role'),
];

// Middleware for validating admin login
exports.validateAdminLogin = [
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please add a valid email')
    .matches(/^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/)
    .withMessage('Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/)
    .withMessage('Password must contain at least one of the following characters: @, _, #, $, or &'),
];

exports.adminResetPasswordValidation = [
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/)
    .withMessage('Password must contain at least one of the following characters: @, _, #, $, or &'),
];