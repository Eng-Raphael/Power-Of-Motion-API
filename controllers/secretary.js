const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Secretary = require('../models/Secretary');

exports.register = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const {
        firstName,
        lastName,
        username,
        email,
        password,
        phoneNumber,
        dob,
    } = req.body;

    const secretary = await Secretary.create({
        firstName,
        lastName,
        username,
        email,
        password,
        phoneNumber,
        dob,
    });

    sendTokenResponse(secretary , 200 , res)

});

exports.login = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;

    // Check for user
    const secretary = await Secretary.findOne({ email }).select('+password');

    // Check if password matches
    const isMatch = await secretary.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Password', 401));
    }

    sendTokenResponse(secretary , 200 , res)

});

exports.getSecretary = asyncHandler(async (req, res, next) => {

    const secretary = await Secretary.findById(req.secretary.id);

    if (!secretary) {
        return next(new ErrorResponse('Secretary not found', 404));
    }

    res.status(200).json({
        success: true,
        data: secretary
    });


});

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token_secretary', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true, // to prevent cros site scripting 
    });
  
    res.status(200).json({
      success: true,
      message: 'Secretary logged out',
    });
});

exports.updateDetails= asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = req.body;
    const secretaryID = req.secretary.id;

    const secretary = await Secretary.findById({ _id: secretaryID }).select('+password');
  
    if (req.body.password) {
      if (!(await secretary.matchPassword(req.body.oldPassword))) {
        return next(new ErrorResponse('Invalid Password', 401));
      } else {
        secretary.password = req.body.password;
        await secretary.save();
        delete fieldsToUpdate.password;
      }
    }
  
    const secretaryUpdated = await Secretary.findByIdAndUpdate(req.secretary.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: secretaryUpdated,
    });
    
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const {email , username} = req.body;

    const secretary = await Secretary.findOne({ email:email , username:username});
  
    if(!secretary){
      res.status(401).json({ success:false ,valid:false} );  
    }
  
    const token = await secretary.generateForgotPasswordToken(secretary);
  
    res.status(200).json({ success:true ,valid:true , token_secretary:token} );
  
});
  
exports.resetPassword = asyncHandler(async (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ success:false ,valid:false , password:errors.array()[0].msg} );
    }
  
    const token = req.params.token;
  
    const secretary = await Secretary.findOne({forgotPasswordToken:token , forgotPasswordTokenExpires : {$gt : Date.now()}});
  
    if(!secretary){
      res.status(401).json({ success:false ,valid:false , msg:"Password Reset Failled"} );  
    }
  
    secretary.password = req.body.password;
    secretary.forgotPasswordToken = undefined;
    secretary.forgotPasswordTokenExpires = undefined;
    await secretary.save();
  
    res.status(200).json({ success: true, valid: true , msg:"Password Reset Successfully for secretary" });
  
}); 


const sendTokenResponse = (secretary , statusCode , res) =>{

    //create token
    const token = secretary.getSignedJwtToken();

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
        .cookie('token_secretary',token,options)
        .json({
            success:true , 
            token_secretary:token 
        })

}