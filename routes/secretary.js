const express = require('express');
const Secretary = require('../models/Secretary');
const{
    validateSecretaryRegistration,
    validateSecretaryLogin,
    secretaryResetPasswordValidation
} = require('../validation/secretaryValidation');
const {protect , authorize} = require('../middleware/auth');
const router = express.Router();
const {
    register,
    login,
    getSecretary,
    logout,
    updateDetails,
    forgotPassword,
    resetPassword
}= require('../controllers/secretary');

router
.post('/register',validateSecretaryRegistration,register)

router
.post('/login',validateSecretaryLogin,login)

router
.post('/me',protect ,getSecretary)

router
.get('/logout',protect,logout)

router
.put('/update',protect,updateDetails)

router
.post('/forgotpassword',forgotPassword)

router
.post('/resetpassword/:token',secretaryResetPasswordValidation ,resetPassword)

module.exports = router;