const express = require('express');
const {protect , authorize,authorizeMultiple} = require('../middleware/auth');
const router = express.Router();

const {createPayment} = require('../controllers/payment');

router
    .route('/create-payment-intent/ticket/:ticketId')
    .post(createPayment);

module.exports = router;