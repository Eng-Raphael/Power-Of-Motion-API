const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Announcement = require('../models/Announcement');
const fs = require('fs');
const User = require('../models/User');

exports.createAnnouncement = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { title, body } = req.body;

    const announcement = await Announcement.create({
        title,
        body,
        image:req.file.filename
    });

    res.status(200).json({
        success: true,
        data: announcement
    })

});

exports.getAnnouncements = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);

});

exports.getAnnouncement = asyncHandler(async (req, res, next) => {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        return next(new ErrorResponse('Announcement not found', 404));
    }

    res.status(200).json({
        success: true,
        data: announcement
    })


});


exports.updateAnnouncement = asyncHandler(async (req, res, next) => {
      
    const updatedFields = req.body;
  
    if (req.file) {
      updatedFields.image = req.file.filename;
    }
  
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );
  
    if (!announcement) {
      return next(new ErrorResponse('Announcement not found', 404));
    }
  
    if (req.file && announcement.image) {
      fs.unlinkSync(`./uploads/announcements/images/${announcement.image}`);
    }
  
    res.status(200).json({
      success: true,
      data: announcement
    });

});

exports.deleteAnnouncement = asyncHandler(async (req, res, next) => {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        return next(new ErrorResponse('Announcement not found', 404));
    }

    if (announcement.image) {
        fs.unlinkSync(`./uploads/announcements/images/${announcement.image}`);
    }

    await announcement.remove();

    res.status(200).json({
        success: true,
        data: {}
    })

});

exports.deleteAnnouncements = asyncHandler(async (req, res, next) => {

    await Announcement.deleteMany();

    res.status(200).json({
        success: true,
        data: {}
    })

});

exports.createAnnouncementForUser = asyncHandler(async (req, res, next) => {

    const { title, body } = req.body;
    const userId = req.params.userId;
    const image = req.file.filename;

    const announcement = await Announcement.create({ title, body, image });

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { announcements: announcement._id } },
      { new: true }
    );

    res.status(201).json({ success: true, announcement, user });

});

exports.getAnnouncementsForUser = asyncHandler(async (req, res, next) => {

    const userId = req.params.userId;

    const user = await User.findById(userId).populate('announcements');

    res.status(200).json({ success: true, announcements: user.announcements });

});

exports.updateAnnouncementForUser = asyncHandler(async (req, res, next) => {

    const fields = req.body;
    const userId = req.params.userId;
    const announcementId = req.params.announcementId;

    if (req.file) {
      fields.image = req.file.filename;
    }

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      fields,
      { new: true }
    );

    const user = await User.findById(userId);

    if (!user.announcements.includes(announcement._id)) {
      return res.status(400).json({ success: false, message: 'Announcement does not belong to this user' });
    }

    if (req.file && announcement.image) {
        fs.unlinkSync(`./uploads/announcements/images/${announcement.image}`);
    }

    res.status(200).json({ success: true, announcement });

});

exports.deleteAnnouncementForUser = asyncHandler(async (req, res, next) => {

    const userId = req.params.userId;
    const announcementId = req.params.announcementId;

    const announcement = await Announcement.findByIdAndDelete(announcementId);

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { announcements: announcement._id } },
      { new: true }
    );

    res.status(200).json({ success: true, announcement, user });

});