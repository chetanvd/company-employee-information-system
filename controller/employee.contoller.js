/**
  @module: controller.js
  @description: controller
  @version: 1.0
* */
const EmployeeService = require('../services/employee.service');
const { statusCode } = require('../utils/constants');
let employeeService = new EmployeeService();

class EmployeeController {
  constructor() {}

  async createEmployee(request, response) {
    request = request.body;
    console.info('Received request for create Employee profile.');
    if (
      !request.EMPLOYEE_NAME ||
      !request.EMPLOYEE_ADDRESS ||
      !request.EMPLOYEE_EMAIL ||
      !request.EMPLOYEE_PHONE_NUMBER ||
      !request.EMPLOYEE_DOB ||
      !request.COMPANY_ID ||
      !request.EMPLOYEE_GENDER
    ) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to create new Employee profile!',
      });
    }

    if (request.EMPLOYEE_DOB.includes('-')) {
      let dobData = request.EMPLOYEE_DOB.split('-');

      if (
        dobData.length !== 3 ||
        dobData[0].length !== 2 ||
        dobData[1].length !== 2 ||
        dobData[2].length !== 4
      ) {
        return response.status(statusCode.forbidden).send({
          status: false,
          message: 'INAVALID DOB format. DOB should be in DD-MM-YYYY format.',
        });
      }
    } else {
      return response.status(statusCode.forbidden).send({
        status: false,
        message: 'INAVALID DOB format. DOB should be in DD-MM-YYYY format.',
      });
    }

    try {
      const createProfileResp = await employeeService.createEmployeeSvc(
        request
      );
      console.info(createProfileResp);
      return response.status(statusCode.ok).json({
        result: createProfileResp,
      });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }

  async updateEmployee(request, response) {
    request = request.body;
    console.info('Received request for update Employee profile.');
    if (!request.EMPLOYEE_ID || request.EMPLOYEE_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to update Employee profile!',
      });
    }

    if (
      request.hasOwnProperty('EMPLOYEE_DOB') &&
      request.EMPLOYEE_DOB.includes('-')
    ) {
      console.log('IN');
      let dobData = request.EMPLOYEE_DOB.split('-');

      if (
        dobData.length !== 3 ||
        dobData[0].length !== 2 ||
        dobData[1].length !== 2 ||
        dobData[2].length !== 4
      ) {
        return response.status(statusCode.forbidden).send({
          status: false,
          message: 'INAVALID DOB format. DOB should be in DD-MM-YYYY format.',
        });
      }
    }

    try {
      const updateProfileResp = await employeeService.updateEmployeeSvc(
        request
      );
      console.info(updateProfileResp);
      return response.status(statusCode.ok).json({
        result: updateProfileResp,
      });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }

  async getEmployee(request, response) {
    request = request.query;
    console.info('Received request for get Employee profile.');
    if (
      !request.SEARCH_ELEMENT ||
      request.SEARCH_ELEMENT.length === 0 ||
      !request.SEARCH_TYPE ||
      request.SEARCH_TYPE.length === 0
    ) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to get Employee profile!',
      });
    }
    try {
      const getProfileResp = await employeeService.getEmployeeSvc(request);
      console.info(getProfileResp);
      return response.status(statusCode.ok).send({ result: getProfileResp });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }

  async getManagerSubordinates(request, response) {
    request = request.query;
    console.info('Received request for get Employee profile.');
    if (!request.EMPLOYEE_ID || request.EMPLOYEE_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to get Employee Manager and Subordinates!',
      });
    }
    try {
      const getProfileResp = await employeeService.getManagerSubordinatesSvc(
        request
      );
      console.info(getProfileResp);
      return response.status(statusCode.ok).send({ result: getProfileResp });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }

  async deleteEmployee(request, response) {
    request = request.body;
    console.info('Received request for delete Employee profile.');
    if (!request.EMPLOYEE_ID || request.EMPLOYEE_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to delete Employee profile!',
      });
    }
    try {
      const deleteProfileResp = await employeeService.deleteEmployeeSvc(
        request
      );
      console.info(deleteProfileResp);
      return response.status(statusCode.ok).json({
        result: deleteProfileResp,
      });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }
}

module.exports = EmployeeController;
