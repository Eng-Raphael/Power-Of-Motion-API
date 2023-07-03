const mongoose = require('mongoose');

const governmentCities = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Luxor',
    'Aswan',
    'Suez',
    'Ismailia',
    'Port Said',
    'Damietta',
    'Dakahlia',
    'Sharqia',
    'Qalyubia',
    'Gharbia',
    'Kafr El Sheikh',
    'Monufia',
    'Beheira',
    'Minya',
    'Beni Suef',
    'Faiyum',
    'New Valley',
    'Asyut',
    'Red Sea',
    'Sohag',
    'Qena', 
    'Matruh',
    'Alexandria',
    'North Sinai',
    'South Sinai',
    'Helwan',
];

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [5, 'Name must be at least 5 characters long.'],
        match: [/^[^\s@?$;%^*()+=\[\]{}|\\\/]+$/, 'Name must not contain symbols such as @, ?, $, ;, %, ^, or spaces.']
    },
    competition :{
        name:{
            type: String,
            required: [true, 'Competition name is required.'],
            enum:['freestyle','speedrun']
        },
    },
    fault:{
        type: Number,
        required: [true, 'Fault is required.'],
        min: [1, 'Fault must be at least 1.'],
        max: [7, 'Fault must be at most 7.']
    },
    location :{
        link :{
            type: String,
            required: [true, 'Location link is required.'],
        },
        streetName :{
            type: String,
            required: [true, 'Street name is required.'],
            maxlength: [30, 'Street name must be at most 30 characters long.'],
        },
        city:{
            type: String,
            required: [true, 'City is required.'],
            enum: governmentCities,
        } ,
        area:{
            type: String,
            required: [true, 'Area is required.'],
        },
        building :{
            type: String,
            required: [true, 'Building is required.'],
        },
        additionalInformation :{
            type: String,
            required: false,
            maxlength: [50, 'Additional information must be at most 50 characters long.'],
        }
    },
    duration :{
        startDate :{
            type: Date,
            required: [true, 'Start date is required.'],
        },
        endDate :{
            type: Date,
            required: [true, 'End date is required.'],
        },
        startTime :{
            time :{
                type: Date,
                required: [true, 'Start time is required.'],
            },
            amOrPm :{
                type: String,
                required: [true, 'am or pm is required.'],
                enum:['am','pm']
            }
        },
        endTime :{
            time :{
                type: Date,
                required: [true, 'End time is required.'],
            },
            amOrPm :{
                type: String,
                required: [true, 'am or pm is required.'],
                enum:['am','pm']
            }
        },
    },
    price:{
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be at least 0.'],
        max: [1000000, 'Price must be at most 1000000.'],
        default: 0,
    },
    description:{
        type: String,
        required: [true, 'Description is required.'],
    },
},{timestamps:true});



module.exports = mongoose.model('Event', EventSchema);