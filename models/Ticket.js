const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['participant', 'guest']
  },
  tshirtSize: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    default: null,
    required : ['true', 'Tshirt size is required']
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'rejected'],
    default: 'pending',
    required: [true, 'Payment status is required']
  },
  barCode: {
    code: {
      type: String,
      required: [true, 'Barcode code is required'],
    },
    entryStatus: {
      type: Boolean,
      default: false,
      required: [true, 'Entry status is required']
    }
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['earlyBird', 'regular']
  },
  earlyBird: {
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: [0.1, 'Discount must be greater than 0.1'],
      max: [0.99, 'Discount must be less than 0.99'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    freeTshirt: {
        type: Boolean,
        default: false,
        required: [true, 'Free tshirt is required']
    }
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);