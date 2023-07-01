const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        default:'Mohamed Bakr',
        required: [true,'Please add a name'],
        maxlength: 12,
        unique:[true,'Name already exists']
    },
    email:{
        type:String,
        default:'powerofmotion.eg@gmail.com',
        required: [true,'Please add an email'],
        maxlength: 26,
        unique:[true,'Email already exists'],
        match:[
            /^[\w.+-]+@(gmail|yahoo|hotmail|icloud|outlook)\.com$/,
            'Please add a valid email with @gmail, @yahoo,@icloud ,@outlook , or @hotmail domain',
        ]
    },
    username:{
        type:String,
        default:'POMAdmin',
        required: [true,'Please add a username'],
        maxlength: 8,
        unique:[true,'Username already exists']
    } ,
    password:{
        type:String,
        required: [true,'Please add a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: 15,
        select: false,
        validate: {
          validator: function (value) {
            return /^(?=.*[@_#$&])[A-Za-z\d@$!%*#?&^_-]{8,}$/.test(value);
          },
          message: 'Password must contain at least one of the following characters: @, _, #, $, or &',
        },
    },
    role:{
        type:String,
        default:'admin',
    },
    forgotPasswordToken:{
        type:String,
        default:null
    },
    forgotPasswordTokenExpires:{
        type:Date,
        default:null
    },
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
AdminSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id , role:this.role}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.methods.generateForgotPasswordToken = async function(admin){
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRATION)); // Set token expiration to 10 minutes from now
    admin.forgotPasswordToken = token;
    admin.forgotPasswordTokenExpires = expires;
    await admin.save();
    return token;
};

module.exports = mongoose.model('Admin', AdminSchema);