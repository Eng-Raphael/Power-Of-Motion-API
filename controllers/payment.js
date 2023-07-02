const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const asyncHandler = require('../middleware/async');
const stripe = require('stripe')('sk_test_51NPMu0C2DJLtLtEWQIZMyYc6SdOTRFn9UXZOwT4F43b5YpVpleSrmrnDUHewCWtDZd1edBw65Nmu43paIfRB1cAb00EWqkvVtJ');

exports.createPayment = asyncHandler(async function(req, res, next) {
    
    const ticketId = req.params.ticketId;
    const { amount, token } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method_data: {
          type: 'card',
          card: { token: token }
        }
    });
      
    const payment = new Payment({
        ticket: ticketId,
        stripePaymentId: paymentIntent.id,
        amount: amount,
        status: 'succeeded',
        paymentStatus: 'paid'
    });

    const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { paymentStatus: 'paid' },
        { new: true }
    );

    res.status(200).json({ success: true, payment, ticket });
    
});