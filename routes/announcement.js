const express = require('express');
const Announcement = require('../models/Announcement');
const {protect , authorize , authorizeMultiple} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const {validateAnnouncementCreation} = require('../validation/announcementValidation');
const imageVal = require('../validation/announcementPic')

const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    deleteAnnouncements,
    createAnnouncementForUser,
    getAnnouncementsForUser,
    updateAnnouncementForUser,
    deleteAnnouncementForUser,
} = require('../controllers/announcement');
const router = express.Router();

router
.route('/announcements/general')
.get(protect,authorizeMultiple('admin','secretary','client'),advancedResults(Announcement),getAnnouncements)
.post(protect,authorizeMultiple('admin','secretary'),imageVal,validateAnnouncementCreation,createAnnouncement)
.delete(protect,authorizeMultiple('admin','secretary'),deleteAnnouncements);

router
.route('/announcement/:id/general')
.get(protect,authorizeMultiple('admin','secretary','client'),getAnnouncement)
.put(protect,authorizeMultiple('admin','secretary'),imageVal,updateAnnouncement)
.delete(protect,authorizeMultiple('admin','secretary'),deleteAnnouncement);

router
.route('/announcements/user/:userId')
.post(protect,authorizeMultiple('admin','secretary'),imageVal,validateAnnouncementCreation,createAnnouncementForUser)
.get(protect,authorizeMultiple('admin','secretary','client'),getAnnouncementsForUser)


router
.route('/announcements/user/:userId/announcement/:announcementId')
.put(protect,authorizeMultiple('admin','secretary'),imageVal,updateAnnouncementForUser)
.delete(protect,authorizeMultiple('admin','secretary'),deleteAnnouncementForUser)

module.exports = router;