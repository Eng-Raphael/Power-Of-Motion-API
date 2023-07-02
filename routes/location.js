const express = require('express');
const Location = require('../models/Location');
const {
    createLocationval 
} = require('../validation/locationValidation');
const {protect , authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {
    getLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
    deleteLocations
}    = require('../controllers/location');

router
    .route('/locations')
    .get(protect,authorize('admin'),advancedResults(Location), getLocations)

router
    .route('/location')
    .post(protect, authorize('admin'), createLocationval ,createLocation);

router
    .route('/location/:id')
    .get(protect,authorize('admin'),getLocation)
    .put(protect, authorize('admin'),updateLocation)
    .delete(protect, authorize('admin'), deleteLocation)

router
    .route('/locations')
    .delete(protect, authorize('admin'), deleteLocations);

module.exports = router;