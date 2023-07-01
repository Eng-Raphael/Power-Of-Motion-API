const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const SecretarySchema = new mongoose.Schema({
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
    role:{
        type:String,
        default:'secretary',
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
    },
} , {timestamps:true});


SecretarySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
SecretarySchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id , role:this.role}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
SecretarySchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

SecretarySchema.methods.generateForgotPasswordToken = async function(secretary){
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRATION)); // Set token expiration to 10 minutes from now
    secretary.forgotPasswordToken = token;
    secretary.forgotPasswordTokenExpires = expires;
    await secretary.save();
    return token;
};

module.exports = mongoose.model('Secretary',SecretarySchema);