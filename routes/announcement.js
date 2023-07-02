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
    deleteAnnouncements
} = require('../controllers/announcement');
const router = express.Router();

router
.route('/announcements/general')
.get(protect,authorizeMultiple('admin','secretary'),advancedResults(Announcement),getAnnouncements)
.post(protect,authorizeMultiple('admin','secretary'),imageVal,validateAnnouncementCreation,createAnnouncement)
.delete(protect,authorizeMultiple('admin','secretary'),deleteAnnouncements);

router
.route('/announcement/:id/general')
.get(protect,authorizeMultiple('admin','secretary'),getAnnouncement)
.put(protect,authorizeMultiple('admin','secretary'),imageVal,updateAnnouncement)
.delete(protect,authorizeMultiple('admin','secretary'),deleteAnnouncement);

module.exports = router;