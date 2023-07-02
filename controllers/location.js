const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Location = require('../models/Location');

exports.getLocations = async (req, res, next) => {
    res.status(200).json(res.advancedResults);
};

exports.getLocation = asyncHandler(async (req, res, next) => {

    const location = await Location.findById(req.params.id);

    if (!location) {
        return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: location
    });

});   

exports.createLocation = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const location = await Location.create(req.body);

    res.status(200).json({
        success: true,
        data: location
    });

});

exports.updateLocation = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    if (!location) {
        return next(
          new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: location });

});  

exports.deleteLocation = asyncHandler(async (req, res, next) => {

    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return next(
        new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });

});

exports.deleteLocations = asyncHandler(async (req, res, next) => {

    await Location.deleteMany();
  
    res.status(200).json({ success: true, data: {} });

});   