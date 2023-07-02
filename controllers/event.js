const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');                               

exports.createEvent = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const event = await Event.create(req.body);

    res.status(200).json({
        success: true,
        data: event
    });


});

exports.getEvents = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);

});

exports.getEvent = asyncHandler(async (req, res, next) => {

    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event
    });


});  


exports.updateEvent = asyncHandler(async (req, res, next) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    let event = await Event.findById(req.params.id);

    if (!event) {
        return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
        );
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: event });

});   

exports.deleteEvent = asyncHandler(async (req, res, next) => {

    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
        return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
        );
    }
      
    res.status(200).json({ success: true, data: {} });

});   

exports.delteAllEvents = asyncHandler(async (req, res, next) => {
    
    await Event.deleteMany();
    
    res.status(200).json({ success: true, data: {} });
});