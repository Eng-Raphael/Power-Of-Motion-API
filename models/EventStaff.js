const mongoose = require('mongoose');

const EventStaffSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.']
    },
    role: {
      type: String,
      enum: ['agent', 'judge'],
      required: [true, 'Role is required.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EventStaff', EventStaffSchema);