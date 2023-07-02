const express = require('express');
const EventStaff = require('../models/EventStaff');
const {
    eventstaffValidation
} = require('../validation/eventstaffValidation');
const {protect , authorize , authorizeMultiple} = require('../middleware/auth');
const router = express.Router();
const {
    createEventStaff,
    getEventStaffs,
    getEventStaffById,
    updateEventStaff,
    deleteEventStaff,
    deleteEventStaffs
}= require('../controllers/eventstaff');

router
    .route('/eventstaffs')
    .get(protect, authorizeMultiple('admin','eventstaff'), getEventStaffs)

router
    .route('/eventstaff/:id')
    .get(protect, authorizeMultiple('admin','eventstaff'), getEventStaffById)

router
    .route('/eventstaff')
    .post(protect, authorizeMultiple('admin','eventstaff'), eventstaffValidation, createEventStaff)

router
    .route('/eventstaff/:id')
    .put(protect, authorizeMultiple('admin','eventstaff'), updateEventStaff)

router
    .route('/eventstaff/:id')
    .delete(protect, authorize('admin'), deleteEventStaff)

router
    .route('/eventstaffs')
    .delete(protect, authorize('admin'), deleteEventStaffs)

module.exports = router;