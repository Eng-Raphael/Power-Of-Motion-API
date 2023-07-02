const express = require('express');
const CompanyInformation = require('../models/CompanyInformation');

const {companyInformationValidation} = require('../validation/companyinformationValidation');
const {protect , authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();
const {
    getCompanyInformations,
    getCompanyInformation,
    createCompanyInformation,
    updateCompanyInformation,
    deleteCompanyInformation,
    deleteCompanyInformations
}    = require('../controllers/companyinformation');

router
.route('/companyinformations')
.get(protect,authorize('admin'),advancedResults(CompanyInformation),getCompanyInformations)

router
.route('/companyinformation')
.post(protect,authorize('admin'),companyInformationValidation,createCompanyInformation)

router
.route('/companyinformations')
.delete(protect,authorize('admin'),deleteCompanyInformations);

router
.route('/company/:id')
.get(protect,authorize('admin'),getCompanyInformation)
.put(protect,authorize('admin'),companyInformationValidation,updateCompanyInformation)
.delete(protect,authorize('admin'),deleteCompanyInformation);

module.exports = router;