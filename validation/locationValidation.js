const { body } = require('express-validator');

const Location = require('../models/Location');

exports.createLocationval = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Please provide a name for the location.')
      .isLength({ min: 5 ,max:15})
      .withMessage('Name cannot be more than 5 characters.'),
    body('type')
      .notEmpty()
      .withMessage('Please provide a valid type for the location.')
      .isIn(['Skating', 'Parkour'])
      .withMessage('Type should be either Skating or Parkour.'),
    body('latitude')
      .notEmpty()
      .withMessage('Please provide a latitude for the location.')
      .isNumeric()
      .withMessage('Latitude should be a number.'),
    body('longitude')
      .notEmpty()
      .withMessage('Please provide a longitude for the location.')
      .isNumeric()
      .withMessage('Longitude should be a number.'),
];

// exports.updateLocationval = [
//     body('name')
//       .isLength({ min: 5 ,max:15 })
//       .withMessage('Name cannot be more than 5 characters.'),
//     body('type')
//       .isIn(['Skating', 'Parkour'])
//       .withMessage('Type should be either Skating or Parkour.'),
//     body('latitude')
//       .isNumeric()
//       .withMessage('Latitude should be a number.'),
//     body('longitude')
//       .isNumeric()
//       .withMessage('Longitude should be a number.'),
// ];