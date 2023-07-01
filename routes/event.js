const express = require('express');
const Event = require('../models/Event');
const {
    validateEventCreation,
    validateEventUpdate
} = require('../validation/eventValidation');
const {protect , authorize , authorizeMultiple} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    delteAllEvents
}= require('../controllers/event');

router
.post('/create',protect,authorizeMultiple('admin','secretary'),validateEventCreation,createEvent)
.get('/events',protect,authorizeMultiple('admin','secretary'),advancedResults(Event) ,getEvents)
.get('/event/:id',protect,authorizeMultiple('admin','secretary'),getEvent)
.put('/event/:id',protect,authorizeMultiple('admin','secretary'),validateEventUpdate,updateEvent)
.delete('/event/:id',protect,authorize('admin'),deleteEvent)
.delete('/events',protect,authorize('admin'),delteAllEvents);
module.exports = router;