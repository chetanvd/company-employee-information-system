const express = require('express');
const router = express.Router();

const CompanyController = require('../controller/company.contoller');
const verifyToken = require('../utils/verifyToken');
const companyController = new CompanyController();

router.post(
  '/createCompanyProfile',
  verifyToken,
  companyController.createCompany
);
router.put(
  '/updateCompanyProfile',
  verifyToken,
  companyController.updateCompany
);
router.get('/getCompanyProfile', verifyToken, companyController.getCompany);
router.delete(
  '/deleteCompanyProfile',
  verifyToken,
  companyController.deleteCompany
);

module.exports = router;
