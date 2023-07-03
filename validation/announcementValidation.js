const { body } = require('express-validator');

exports.validateAnnouncementCreation =[

    body('title')
    .notEmpty()
    .withMessage('title name is required')
    .isLength({ min: 10, max: 40 })
    .withMessage('Title must be between 10 and 40 characters long'),

  body('body')
    .notEmpty()
    .withMessage('body name is required')
    .isLength({ max: 500 })
    .withMessage('Body must be less than 500 characters long'),
    
];