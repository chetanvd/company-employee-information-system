const express = require('express');
const router = express.Router();

const AdminController = require('../controller/admin.contoller');
const validateAdminToken = require('../utils/validateAdminToken');
const adminController = new AdminController();

router.post('/signUp', validateAdminToken, adminController.signUp);

router.post('/signIn', adminController.signIn);

module.exports = router;
