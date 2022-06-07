const express = require('express');
const router = express.Router();

const AdminController = require('../controller/admin.contoller');
const adminController = new AdminController();

router.post('/signIn', adminController.signIn);

module.exports = router;
