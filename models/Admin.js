const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        default:'Mohamed Bakr',
        required: [true,'Please add a name'],
        maxlength: 12
    },
    email:{
        type:String,
        default:'powerofmotion.eg@gmail.com',
        required: [true,'Please add an email'],
        maxlength: 26
    },
    username:{
        type:String,
        default:'POMAdmin',
        required: [true,'Please add a username'],
        maxlength: 8
    } ,
    password:{
        type:String,
        default:'9%$ms%C?d_`xV9&',
        required: [true,'Please add a password'],
        maxlength: 15
    }
});

