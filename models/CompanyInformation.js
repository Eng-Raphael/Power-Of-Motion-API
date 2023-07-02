const mongoose = require('mongoose');

const companyInformationSchema = new mongoose.Schema({
  email: {
    type:String,
    required:[true,'Please add an email'],
    match:[
        /^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/,
        'Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain',
    ]
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
    validate: {
        validator: function (value) {
        return /^(010|011|015|012)\d{8}$/.test(value);
        },
        message: 'Phone number must start with 010, 011, 015, or 012 and must be 11 digits long',
    },
  },
  socialmediaAccounts: [
    {
      name: {
        type: String,
        required: [true, 'Please add a social media name'],
      },
      link: {
        type: String,
        required: [true, 'Please add a social media link'],
      },
      handler: {
        type: String,
        required: [true, 'Please add a social media handler'],
      }
    }
  ]
},{timestamps:true});

module.exports = mongoose.model('CompanyInformation', companyInformationSchema);