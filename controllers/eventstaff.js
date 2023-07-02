const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const EventStaff = require('../models/EventStaff');

exports.createEventStaff = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array(), 400));
    }
    
    const eventStaff = await EventStaff.create(req.body);
    
    res.status(201).json({
        success: true,
        data: eventStaff
    });

});

exports.getEventStaffs = asyncHandler(async (req, res, next) => {
    const eventStaff = await EventStaff.find().populate('event user');
  
    res.status(200).json({
      success: true,
      count: eventStaff.length,
      data: eventStaff,
    });
});

exports.getEventStaffById = asyncHandler(async (req, res, next) => {
    const eventStaff = await EventStaff.findById(req.params.id).populate(
      'event user'
    );
  
    if (!eventStaff) {
      return next(
        new ErrorResponse(`Event staff not found with id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({ success: true, data: eventStaff });
});

exports.updateEventStaff = asyncHandler(async (req, res, next) => {
    let eventStaff = await EventStaff.findById(req.params.id);
  
    if (!eventStaff) {
      return next(
        new ErrorResponse(`Event staff not found with id of ${req.params.id}`, 404)
      );
    }
  
    eventStaff = await EventStaff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({ success: true, data: eventStaff });
});

exports.deleteEventStaff = asyncHandler(async (req, res, next) => {
    const eventStaff = await EventStaff.findByIdAndDelete(req.params.id);
  
    if (!eventStaff) {
      return next(
        new ErrorResponse(`Event staff not found with id of ${req.params.id}`, 404)
      );
    }
 
    res.status(200).json({ success: true, data: {} });
});

exports.deleteEventStaffs = asyncHandler(async (req, res, next) => {

    const eventStaff = await EventStaff.deleteMany();
  
    res.status(200).json({ success: true, data: {} });

}); 