const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [40, 'Title must be less than 40 characters long']
  },
  body: {
    type: String,
    required: [true, 'Please add a body'],
    maxlength: [500, 'Body must be less than 500 characters long']
  },
  image: {
    type: String,
    required: [true, 'Please add an image'],
    validate: {
        validator: function(value) {
            const regex = /\.(png|jfif|jpg|jpeg|pdf|svg|heif|hevc)$/;
            return regex.test(value);
        },
        message: 'image must have a valid extension: .png, .jfif, .jpg, .jpeg, .pdf, .svg, .heif, .hevc'
    },
    maxlength: [5 * 1024 * 1024, 'image must be less than 5MB']
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000) 
  }
});

announcementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Announcement', announcementSchema);