const express = require('express');
const Ticket = require('../models/Ticket');

const { validateTicketCreate,validateTicketUpdate } = require('../validation/ticketValidation');
const {protect , authorize ,authorizeMultiple} = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    deleteTickets,
    deleteTicketsByUser,
    deleteTicketsByEvent,
    getTicketsByEventAndUser,
    getTicketsByEvent,
    getTicketsByUser,
}    = require('../controllers/ticket');

router.route('/tickets')
    .get(protect ,authorizeMultiple('admin','secretary') ,advancedResults(Ticket),getTickets)

router.route('/ticket')
    .post(protect,authorize('client'),validateTicketCreate,createTicket);

router.route('/ticket/:id')
    .get(protect ,authorizeMultiple('admin','secretary') ,getTicket)
    .put(protect,authorize('client'),validateTicketUpdate,updateTicket)
    .delete(protect,authorizeMultiple('admin','secretary'),deleteTicket);

router.route('/tickets')
    .delete(protect,authorizeMultiple('admin','secretary'),deleteTickets);


router.route('/tickets/user/:userId')
    .delete(protect,authorizeMultiple('admin','secretary'),deleteTicketsByUser);

router.route('/tickets/event/:eventId')
    .delete(protect,authorizeMultiple('admin','secretary'),deleteTicketsByEvent);

router.route('/tickets/event/:eventId/user/:userId')
    .get(protect,authorizeMultiple('admin','secretary'),getTicketsByEventAndUser);

router.route('/tickets/event/:eventId')
    .get(protect,authorizeMultiple('admin','secretary'),getTicketsByEvent);

router.route('/getTicketsByUser/user/:userId')
    .get(protect,authorizeMultiple('admin','secretary'),getTicketsByUser);

module.exports = router;