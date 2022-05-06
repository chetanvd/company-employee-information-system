const express = require('express');

const router = express.Router();

const EmployeeController = require('../controller/employee.contoller');
const verifyToken = require('../utils/verifyToken');
const employeeController = new EmployeeController();

router.post(
  '/createEmployeeProfile',
  verifyToken,
  employeeController.createEmployee
);
router.put(
  '/updateEmployeeProfile',
  verifyToken,
  employeeController.updateEmployee
);
router.get('/getEmployeeProfile', verifyToken, employeeController.getEmployee);
router.get(
  '/getManagerSubordinates',
  verifyToken,
  employeeController.getManagerSubordinates
);
router.delete('/deleteEmployeeProfile', employeeController.deleteEmployee);

module.exports = router;
