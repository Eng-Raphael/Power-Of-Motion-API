const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'Please add a first name'],
        minlength:[3,'First name must be at least 3 characters long'],
        maxlength:[10,'First name must be less than 10 characters long']
    },
    lastName:{
        type:String,
        required:[true,'Please add a last name'],
        minlength:[3,'Last name must be at least 3 characters long'],
        maxlength:[10,'Last name must be less than 10 characters long']
    },
    username:{
        type:String,
        required:[true,'Please add a username'],
        minlength:[3,'Username must be at least 3 characters long'],
        maxlength:[10,'Username must be less than 10 characters long'],
        unique:[true,'Username already exists']
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:[true,'Email already exists'],
        match:[
            /^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/,
            'Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain',
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false,
        validate: {
          validator: function (value) {
            return /^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/.test(value);
          },
          message: 'Password must contain at least one of the following characters: @, _, #, $, or &',
        },
    },
    profilePic: {
        type: String,
        validate: {
            validator: function(value) {
                const regex = /\.(png|jfif|jpg|jpeg|pdf|svg|heif|hevc)$/;
                return regex.test(value);
            },
            message: 'Profile picture must have a valid extension: .png, .jfif, .jpg, .jpeg, .pdf, .svg, .heif, .hevc'
        },
        required: [true, 'Please add a profile picture'],
        maxlength: [5 * 1024 * 1024, 'Profile picture must be less than 5MB']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: [true, 'Phone number already exists'],
        validate: {
          validator: function (value) {
            return /^(010|011|015|012)\d{8}$/.test(value);
          },
          message: 'Phone number must start with 010, 011, 015, or 012 and must be 11 digits long',
        },
    },
    dob: {
        type: String,
        required: [true, 'Please add a date of birth'],
        validate: {
          validator: function(value) {
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return isoDateRegex.test(value);
          },
          message: 'DOB must be in the format of yyyy-mm-dd'
        }
    },
    city:{
        type:String,
        required:[true,'Please add a city'],
        enum: governmentCities,
        validate: {
          validator: function(value) {
            return governmentCities.includes(value);
          },
          message: 'Please enter a valid government city'
        }
    },
    role:{
        type:String,
        enum:['client','staff'],
        default:'client'
    },
    announcements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement',
      },
    ],
    interests:{
        type:String,
        required:[true,'Please add your interests'],
        enum:['parkour','skate','both']
    },
    isSuspended:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:{
        type:String,
        default:null
    },
    forgotPasswordTokenExpires:{
        type:Date,
        default:null
    }
},{timestamps:true}); 

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id , role:this.role}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateForgotPasswordToken = async function(user){
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRATION)); // Set token expiration to 10 minutes from now
  user.forgotPasswordToken = token;
  user.forgotPasswordTokenExpires = expires;
  await user.save();
  return token;
};

module.exports = mongoose.model('User', UserSchema);