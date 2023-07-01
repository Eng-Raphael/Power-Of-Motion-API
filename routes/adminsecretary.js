const express = require('express');
const Secretary = require('../models/Secretary');
const {protect , authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {
    getSecretaries,
    getSecretaryById,
    deleteSecretaries,
    deleteSecretaryById,
    suspendSecretaries,
    suspendSecretaryById,
    activateSecretaries,
    activateSecretaryById,
} = require('../controllers/admin');

router
.get('/secretaries',protect,authorize('admin'), advancedResults(Secretary) ,getSecretaries)

router
.get('/secretary/:id',protect,authorize('admin'),getSecretaryById)

router
.delete('/secretaries',protect,authorize('admin'),deleteSecretaries)

router
.delete('/secretary/:id',protect,authorize('admin'),deleteSecretaryById)

router
.put('/secretaries/suspend',protect,authorize('admin'),suspendSecretaries)

router
.put('/secretary/:id/suspend',protect,authorize('admin'),suspendSecretaryById)

router
.put('/secretaries/activate',protect,authorize('admin'),activateSecretaries)

router
.put('/secretary/:id/activate',protect,authorize('admin'),activateSecretaryById)

module.exports = router;