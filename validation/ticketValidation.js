const { body } = require('express-validator');

exports.validateTicketCreate = [
    body('event', 'Event is required').exists().isMongoId(),
    body('user', 'User is required').exists().isMongoId(),
    body('role', 'Role is required').exists().isIn(['participant', 'guest']),
    body('tshirtSize', 'Tshirt size is required').exists().isIn(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
    body('paymentStatus', 'Payment status is required').exists().isIn(['paid', 'pending', 'rejected']),
    body('barCode.code', 'Barcode is required').exists(),
    body('barCode.entryStatus', 'Entry status is required').exists().isBoolean(),
    body('type', 'Type is required').exists().isIn(['earlyBird', 'regular']),
    body('earlyBird.discount', 'Discount is required').exists().isFloat({ min: 0.1, max: 0.99 }),
    body('earlyBird.endDate', 'End date is required').exists().isISO8601(),
    body('earlyBird.freeTshirt', 'Free tshirt is required').exists().isBoolean()
      
];


exports.validateTicketUpdate = [
    body('event').optional().isMongoId(),
    body('user').optional().isMongoId(),
    body('role').optional().isIn(['participant', 'guest']),
    body('tshirtSize').optional().isIn(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
    body('paymentStatus').optional().isIn(['paid', 'pending', 'rejected']),
    body('barCode.code').optional(),
    body('barCode.entryStatus').optional().isBoolean(),
    body('type').optional().isIn(['earlyBird', 'regular']),
    body('earlyBird.discount').optional().isFloat({ min: 0.1, max: 0.99 }),
    body('earlyBird.endDate').optional().isISO8601(),
    body('earlyBird.freeTshirt').optional().isBoolean()
];