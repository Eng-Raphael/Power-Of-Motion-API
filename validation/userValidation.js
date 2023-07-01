const { body } = require('express-validator');
const User = require('../models/User');

const governmentCities = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Luxor',
  'Aswan',
  'Suez',
  'Ismailia',
  'Port Said',
  'Damietta',
  'Dakahlia',
  'Sharqia',
  'Qalyubia',
  'Gharbia',
  'Kafr El Sheikh',
  'Monufia',
  'Beheira',
  'Minya',
  'Beni Suef',
  'Faiyum',
  'New Valley',
  'Asyut',
  'Red Sea',
  'Sohag',
  'Qena', 
  'Matruh',
  'North Sinai',
  'South Sinai',
  'Helwan',
];

const roleValues = ['client', 'staff'];

const userRegisterationValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('First name must be between 3 and 10 characters long'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('Last name must be between 3 and 10 characters long'),
  body('username')
    .notEmpty()
    .withMessage('user name is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('Username must be between 3 and 10 characters long')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username already exists');
      }
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please add a valid email')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already exists');
      }
      return true;
    })
    .matches(/^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/)
    .withMessage('Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/)
    .withMessage('Password must contain at least one of the following characters: @, _, #, $, or &'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phonenumber is required')
    .isLength({ min: 11, max: 11 })
    .withMessage('Phone number must be 11 digits long')
    .matches(/^(010|011|015|012)\d{8}$/)
    .withMessage('Phone number must start with 010, 011, 015, or 012')
    .custom(async (value, { req }) => {
      const existingPhone = await User.findOne({ phoneNumber: value });
      if (existingPhone) {
        throw new Error('PhoneNumber already exists');
      }
      return true;
    }),
  body('dob')
    .notEmpty()
    .withMessage('dob is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('DOB must be in the format of yyyy-mm-dd'),
  body('city')
    .notEmpty()
    .withMessage('city is required')
    .isIn(governmentCities)
    .withMessage('Please enter a valid government city'),
  body('interests')
    .notEmpty()
    .withMessage('interests is required')
    .isIn(['parkour', 'skate', 'both'])
    .withMessage('Please add your interests'),
  body('profilePic')
    .notEmpty()
    .withMessage('profilePic is required'),
  body('role')
    .isIn(roleValues).withMessage(`Role must be one of ${roleValues}`),
];

const userLoginValidation = [
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

const userResetPasswordValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/)
    .withMessage('Password must contain at least one of the following characters: @, _, #, $, or &'),
];


module.exports = {userRegisterationValidation, userLoginValidation , userResetPasswordValidation};