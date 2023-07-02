const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const CompanyInformation = require('../models/CompanyInformation');
const validation = require('../Apis/emailPhoneVerification');

exports.getCompanyInformations = asyncHandler( (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getCompanyInformation = asyncHandler(async (req, res, next) => {

    const companyinformation = await CompanyInformation.findById(req.params.id);

    if (!companyinformation) {
        return next(new ErrorResponse(`CompanyInformation not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: companyinformation
    });

});

exports.createCompanyInformation = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const isValidateEmail = await validation.validateEmail(email);
    if (!isValidateEmail) {
        return next(new ErrorResponse('Invalid Email , Free email domains are not allowed , Disposable email domains are not allowed', 400));
    }

    const companyinformation = await CompanyInformation.create(req.body);

    res.status(200).json({
        success: true,
        data: companyinformation
    });


});

exports.updateCompanyInformation = asyncHandler(async (req, res, next) => {

    const companyInformation = await CompanyInformation.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!companyInformation) {
        return res.status(404).json({ message: 'Company information not found' });
      }
      res.status(200).json({ message: 'Company information updated successfully', data: companyInformation });

});

exports.deleteCompanyInformation = asyncHandler(async (req, res, next) => {

    const id = req.params.id;
    const companyInformation = await CompanyInformation.findByIdAndDelete(id);
    if (!companyInformation) {
      return res.status(404).json({ message: 'Company information not found' });
    }
    res.status(200).json({ message: 'Company information deleted successfully', data: companyInformation });

});

exports.deleteCompanyInformations = asyncHandler(async (req, res, next) => {

    const companyInformations = await CompanyInformation.deleteMany();
    if (!companyInformations) {
      return res.status(404).json({ message: 'Company information not found' });
    }
    res.status(200).json({ message: 'Company information deleted successfully', data: companyInformations });

});