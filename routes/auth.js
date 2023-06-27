const express = require('express');
const User = require('../models/User');
const{ userRegisterationValidation, userLoginValidation , userResetPasswordValidation } = require('../validation/userValidation')
const {protect} = require('../middleware/auth');
const router = express.Router();
const {
    register,
    login,
    getMe,
    logout,
    updateDetails,
    forgotPassword,
    resetPassword
}= require('../controllers/auth');


router
.post('/register',userRegisterationValidation,register)

router
.post('/login',userLoginValidation,login)

router
.get('/me',protect,getMe)

router
.get('/logout',protect,logout)

router
.put('/update',protect,updateDetails)

router
.get('/forgotpassword/user/:id',forgotPassword)

router
.post('/resetpassword/:token',userResetPasswordValidation ,resetPassword)

module.exports = router;