const express = require('express');
const Admin = require('../models/Admin');
const{ 
    validateAdminRegistration,
    validateAdminLogin,
    adminResetPasswordValidation
} = require('../validation/adminValidation');
const {protect , authorize} = require('../middleware/auth');
const router = express.Router();
const {
    register,
    login,
    getAdmin,
    logout,
    updateDetails,
    forgotPassword,
    resetPassword
}= require('../controllers/admin');


router
.post('/register',validateAdminRegistration,register)

router
.post('/login',validateAdminLogin,login)

router
.post('/me',protect ,getAdmin)

router
.get('/logout',protect,logout)

router
.put('/update',protect,updateDetails)

router
.post('/forgotpassword',forgotPassword)

router
.post('/resetpassword/:token',adminResetPasswordValidation ,resetPassword)

module.exports = router;