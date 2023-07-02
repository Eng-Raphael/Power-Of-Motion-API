const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Please add a name'],
        minlength: [5, 'Name cannot be more than 5 characters'],
        maxlength: [15, 'Name cannot be less than 15 characters'],
    },
    type:{
        type:String,
        required: [true,'Please add a type'],
        enum:['Skating' , 'Parkour']
    } ,
    latitude:{
        type:Number,
        required: [true,'Please add a latitude'],
    },
    longitude:{
        type:Number,
        required: [true,'Please add a longitude'],
    } ,
}); 

module.exports = mongoose.model('Location', LocationSchema);