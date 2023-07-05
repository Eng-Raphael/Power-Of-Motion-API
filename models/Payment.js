const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: [true, 'Ticket is required']
  },
  stripePaymentId: {
    type: String,
    required: [true, 'Stripe payment id is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  status: {
    type: String,
    enum: ['succeeded', 'pending', 'failed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  }
},{timestamps:true});

module.exports = mongoose.model('Payment', paymentSchema);