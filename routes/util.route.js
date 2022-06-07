const express = require('express');
const router = express.Router();

const UtilController = require('../controller/util.contoller');
const verifyToken = require('../utils/verifyToken');
const utilController = new UtilController();

router.get('/getData', verifyToken, utilController.getData);

module.exports = router;
