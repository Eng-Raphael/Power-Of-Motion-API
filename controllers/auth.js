const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const validation = require('../Apis/emailPhoneVerification');
const fs = require('fs');

exports.register = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { 
        firstName,
        lastName,
        email,
        password,
        dob,
        phoneNumber,
        username,
        city,
        interests,
        role='client'
    } = req.body;

    const isValidateEmail = await validation.validateEmail(email);
    if (!isValidateEmail) {
        return next(new ErrorResponse('Invalid Email , Free email domains are not allowed , Disposable email domains are not allowed', 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        dob,
        phoneNumber,
        username,
        city,
        interests,
        role,
        profilePic:req.file.filename
    });

    sendTokenResponse(user , 200 , res)
});


exports.login = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;


    // Check for user
    const user = await User.findOne({ email }).select('+password');

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Password', 401));
    }

    sendTokenResponse(user , 200 , res)    


});

exports.getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = await User.findById(req.user.id)
  
    res.status(200).json({
      success: true,
      data: user,
    });
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true, // to prevent cros site scripting 
    });
  
    res.status(200).json({
      success: true,
      message: 'User logged out',
    });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = req.body;
    const userID = req.user.id;
  
    const user = await User.findById({ _id: userID }).select('+password');
  
    if (req.body.password) {
      if (!(await user.matchPassword(req.body.oldPassword))) {
        return next(new ErrorResponse('Invalid Password', 401));
      } else {
        user.password = req.body.password;
        await user.save();
        delete fieldsToUpdate.password;
      }
    }

    if(req.file){
      if (user.profilePic) {
        fs.unlinkSync(`./uploads/user/profiles/${user.profilePic}`);
      }
      fieldsToUpdate.profilePic = req.file.filename;
    }
  
    const userUpdated = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: userUpdated,
    });
});

// Get token from model , create cookie and send response 
const sendTokenResponse = (user , statusCode , res) =>{

    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 *60 * 1000),
        httpOnly: true
    }

    // to make sure it is sent over HTTPS 
    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token',token,options)
        .json({
            success:true , 
            token 
        })

}

exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const {phoneNumber , username} = req.body;

  const user = await User.findOne({ phoneNumber:phoneNumber , username:username});

  if(!user){
    res.status(401).json({ success:false ,valid:false} );  
  }

  const token = await user.generateForgotPasswordToken(user);

  res.status(200).json({ success:true ,valid:true , token:token} );

});

exports.resetPassword = asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401).json({ success:false ,valid:false , password:errors.array()[0].msg} );
  }

  const token = req.params.token;

  const user = await User.findOne({forgotPasswordToken:token , forgotPasswordTokenExpires : {$gt : Date.now()}});

  if(!user){
    res.status(401).json({ success:false ,valid:false , msg:"Password Reset Failled"} );  
  }

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, valid: true , msg:"Password Reset Successfully" });

}); 