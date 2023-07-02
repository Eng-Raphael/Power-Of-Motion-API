const { body } = require('express-validator');

exports.companyInformationValidation = [

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .matches(/^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/)
        .withMessage('Please enter a valid email address with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain'),
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^(010|011|015|012)\d{8}$/)
        .withMessage('Phone number must start with 010, 011, 015, or 012 and must be 11 digits long'),
    body('socialmediaAccounts.*.name')
        .notEmpty()
        .withMessage('Social media name is required'),
    body('socialmediaAccounts.*.link')
        .notEmpty()
        .withMessage('Social media link is required'),
   body('socialmediaAccounts.*.handler')
    .notEmpty()
    .withMessage('Social media handler is required'),
    
]