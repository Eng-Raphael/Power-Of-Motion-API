const { body } = require('express-validator');

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
    'Alexandria',
    'North Sinai',
    'South Sinai',
    'Helwan',
];

exports.validateEventCreation =[
    body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters long.')
    .matches(/^[^\s@?$;%^*()+=\[\]{}|\\\/]+$/)
    .withMessage('Name must not contain symbols such as @, ?, $, ;, %, ^, or spaces.'),
  body('competition.name')
    .notEmpty()
    .withMessage('Competition name is required.')
    .isIn(['freestyle', 'speedrun'])
    .withMessage('Competition name must be either "freestyle" or "speedrun".'),
  body('fault')
    .notEmpty()
    .withMessage('Fault is required.')
    .isInt({ min: 1, max: 7 })
    .withMessage('Fault must be between 1 and 7.'),
  body('location.link')
    .notEmpty()
    .withMessage('Location link is required.'),
  body('location.streetName')
    .notEmpty()
    .withMessage('Street name is required.')
    .isLength({ max: 30 })
    .withMessage('Street name must be at most 30 characters long.'),
  body('location.city')
    .notEmpty()
    .withMessage('City is required.')
    .isIn(governmentCities)
    .withMessage('City must be one of the government cities.'),
  body('location.area')
    .notEmpty()
    .withMessage('Area is required.'),
  body('location.building')
    .notEmpty()
    .withMessage('Building is required.'),
  body('location.additionalInformation')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Additional information must be at most 50 characters long.'),
  body('duration.startDate')
    .notEmpty()
    .withMessage('Start date is required.')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date.'),
  body('duration.endDate')
    .notEmpty()
    .withMessage('End date is required.')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date.'),
  body('duration.startTime.time')
    .notEmpty()
    .withMessage('Start time is required.')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 time.'),
  body('duration.startTime.amOrPm')
    .notEmpty()
    .withMessage('am or pm is required.')
    .isIn(['am', 'pm'])
    .withMessage('am or pm must be either "am" or "pm".'),
  body('duration.endTime.time')
    .notEmpty()
    .withMessage('End time is required.')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 time.'),
  body('duration.endTime.amOrPm')
    .notEmpty()
    .withMessage('am or pm is required.')
    .isIn(['am', 'pm'])
    .withMessage('am or pm must be either "am" or "pm".'),
];

exports.validateEventUpdate =[
  body('name')
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters long.')
    .matches(/^[^\s@?$;%^*()+=\[\]{}|\\\/]+$/)
    .withMessage('Name must not contain symbols such as @, ?, $, ;, %, ^, or spaces.'),
  body('competition.name')
    .isIn(['freestyle', 'speedrun'])
    .withMessage('Competition name must be either "freestyle" or "speedrun".'),
  body('fault')
    .isInt({ min: 1, max: 7 })
    .withMessage('Fault must be between 1 and 7.'),
  body('location.streetName')
    .isLength({ max: 30 })
    .withMessage('Street name must be at most 30 characters long.'),
  body('location.city')
    .isIn(governmentCities)
    .withMessage('City must be one of the government cities.'),
  body('location.additionalInformation')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Additional information must be at most 50 characters long.'),
  body('duration.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date.'),
  body('duration.endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date.'),
  body('duration.startTime.time')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 time.'),
  body('duration.startTime.amOrPm')
    .isIn(['am', 'pm'])
    .withMessage('am or pm must be either "am" or "pm".'),
  body('duration.endTime.time')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 time.'),
  body('duration.endTime.amOrPm')
    .isIn(['am', 'pm'])
    .withMessage('am or pm must be either "am" or "pm".'),
];  