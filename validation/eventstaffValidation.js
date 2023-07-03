const { body } = require('express-validator');

exports.eventstaffValidation = [

  body('event').notEmpty().withMessage('Event ID is required.'),

  body('event').isMongoId().withMessage('Invalid Event ID.'),

  body('user').notEmpty().withMessage('User ID is required.'),

  body('user').isMongoId().withMessage('Invalid User ID.'),

  body('role').notEmpty().withMessage('Role is required.'),

  body('role').isIn(['agent', 'judge']).withMessage('Invalid role value.'),
  
];