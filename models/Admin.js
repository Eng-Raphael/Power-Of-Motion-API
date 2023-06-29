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
        required: [true,'Please add a password'],
        maxlength: 15
    }
});

// Hash the password before saving it to the database
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a method to match the password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);

// Check if a document with the default values already exists
Admin.countDocuments({ name: 'Mohamed Bakr' }, (error, count) => {
  if (error) console.log(error);

  // If a document with the default values doesn't exist, create one
  if (count === 0) {
    const admin = new Admin({
      name: 'Mohamed Bakr',
      email: 'powerofmotion.eg@gmail.com',
      username: 'POMAdmin',
      password: '9%$ms%C?d_`xV9&'
    });
    admin.save((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });
  }
});