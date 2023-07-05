const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ticket = require('../models/Ticket');

exports.createTicket = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const ticket = await Ticket.create(req.body);

    res.status(201).json({
        success: true,
        data: ticket
    });

}); 


exports.getTickets = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


exports.getTicket = asyncHandler(async (req, res, next) => {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: ticket
    });


});

exports.updateTicket = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({
        success: true,
        data: ticket  
    });

});

exports.deleteTicket = asyncHandler(async (req, res, next) => {

    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });

});

exports.deleteTickets = asyncHandler(async (req, res, next) => {

    const tickets = await Ticket.deleteMany();

    if (!tickets) {
        return next(new ErrorResponse(`Tickets not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });

});

exports.deleteTicketsByUser = asyncHandler(async (req, res, next) => {

    const tickets = await Ticket.deleteMany({ user: req.params.userId });

    if (!tickets) {
        return next(new ErrorResponse(`Tickets not found for user with id of ${req.params.userId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });

});

exports.deleteTicketsByEvent = asyncHandler(async (req, res, next) => {

    const tickets = await Ticket.deleteMany({ event: req.params.eventId });

    if (!tickets) {
        return next(new ErrorResponse(`Tickets not found for event with id of ${req.params.eventId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });

});

exports.getTicketsByEventAndUser = asyncHandler(async (req, res, next) => {

    const ticket = await Ticket.findOne({ event: req.params.eventId, user: req.params.userId });

    if (!ticket) {
        return next(new ErrorResponse(`Ticket not found for event with id of ${req.params.eventId} and user with id of ${req.params.userId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: ticket
    });

});


exports.getTicketsByEvent = asyncHandler(async (req, res, next) => {

    const tickets = await Ticket.find({ event: req.params.eventId });

    if (!tickets) {
        return next(new ErrorResponse(`Tickets not found for event with id of ${req.params.eventId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: tickets
    });


});


exports.getTicketsByUser = asyncHandler(async (req, res, next) => {

    const tickets = await Ticket.find({ user: req.params.userId });

    if (!tickets) {
        return next(new ErrorResponse(`Tickets not found for user with id of ${req.params.userId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: tickets
    });

});
