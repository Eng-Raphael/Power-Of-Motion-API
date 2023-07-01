const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Admin = require('../models/Admin');

exports.register = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { 
        name,
        email,
        password,
        username,
        role
    } = req.body;

    if(req.body.developer_admin_secret !== "0987654321qwertyuiopasdfghjklzxcvbnm"){
        return next(new ErrorResponse('Invalid Developer', 400));
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        username,
        role
    });

    sendTokenResponse(admin , 200 , res)

});  

exports.login = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;

    // Check for user
    const admin = await Admin.findOne({ email }).select('+password');

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Password', 401));
    }

    sendTokenResponse(admin , 200 , res)    


});

exports.getAdmin = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const admin = await Admin.findById(req.admin.id)

    if(req.body.developer_admin_secret !== "0987654321qwertyuiopasdfghjklzxcvbnm"){
        return next(new ErrorResponse('Invalid Developer', 400));
    }
  
    res.status(200).json({
      success: true,
      data: admin,
    });
});


exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token_admin', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true, // to prevent cros site scripting 
    });
  
    res.status(200).json({
      success: true,
      message: 'Admin logged out',
    });
});


exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = req.body;
    const adminID = req.admin.id;
  
    const admin = await Admin.findById({ _id: adminID }).select('+password');
  
    if (req.body.password) {
      if (!(await admin.matchPassword(req.body.oldPassword))) {
        return next(new ErrorResponse('Invalid Password', 401));
      } else {
        admin.password = req.body.password;
        await admin.save();
        delete fieldsToUpdate.password;
      }
    }
  
    const adminUpdated = await Admin.findByIdAndUpdate(req.admin.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: adminUpdated,
    });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const {email , username} = req.body;
    
    if(req.body.developer_admin_secret !== "0987654321qwertyuiopasdfghjklzxcvbnm"){
        return next(new ErrorResponse('Cannot Update !!', 400));
    }

    const admin = await Admin.findOne({ email:email , username:username});
  
    if(!admin){
      res.status(401).json({ success:false ,valid:false} );  
    }
  
    const token = await admin.generateForgotPasswordToken(admin);
  
    res.status(200).json({ success:true ,valid:true , token_admin:token} );
  
});
  
exports.resetPassword = asyncHandler(async (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ success:false ,valid:false , password:errors.array()[0].msg} );
    }
  
    const token = req.params.token;
  
    const admin = await Admin.findOne({forgotPasswordToken:token , forgotPasswordTokenExpires : {$gt : Date.now()}});
  
    if(!admin){
      res.status(401).json({ success:false ,valid:false , msg:"Password Reset Failled"} );  
    }

    if(req.body.developer_admin_secret !== "0987654321qwertyuiopasdfghjklzxcvbnm"){
        return next(new ErrorResponse('Cannot Update !!', 400));
    }
  
    admin.password = req.body.password;
    admin.forgotPasswordToken = undefined;
    admin.forgotPasswordTokenExpires = undefined;
    await admin.save();
  
    res.status(200).json({ success: true, valid: true , msg:"Password Reset Successfully for admin" });
  
}); 

const sendTokenResponse = (admin , statusCode , res) =>{

    //create token
    const token = admin.getSignedJwtToken();

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
        .cookie('token_admin',token,options)
        .json({
            success:true , 
            token_admin:token 
        })

}