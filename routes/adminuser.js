const express = require('express');
const User = require('../models/User');
const {protect , authorize} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {
    getUsers,
    getUserById,
    deleteUsers,
    deleteUserById,
    suspendUsers,
    suspendUserById,
    activateUsers,
    activateUserById
}= require('../controllers/admin');


const adminSecretaryRouter = require('./adminsecretary');
const adminLocationRouter = require('./location');
const adminCompanyInformationRouter = require('./companyinformation');
const adminAnnouncementRouter = require('./announcement');

router.use('', adminSecretaryRouter);
router.use('', adminLocationRouter);
router.use('', adminCompanyInformationRouter);
router.use('', adminAnnouncementRouter);

router
.get('/users',protect,authorize('admin'), advancedResults(User) ,getUsers)

router
.get('/user/:id',protect,authorize('admin'),getUserById)

router
.delete('/users',protect,authorize('admin'),deleteUsers)

router
.delete('/user/:id',protect,authorize('admin'),deleteUserById)

router
.put('/users/suspend',protect,authorize('admin'),suspendUsers)

router
.put('/user/:id/suspend',protect,authorize('admin'),suspendUserById)

router
.put('/users/activate',protect,authorize('admin'),activateUsers)

router
.put('/user/:id/activate',protect,authorize('admin'),activateUserById)

module.exports = router;