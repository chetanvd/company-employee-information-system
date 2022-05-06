/**
  @module: controller.js
  @description: controller
  @version: 1.0
* */
const CompanyService = require('../services/company.service');
const { statusCode } = require('../utils/constants');
let companyService = new CompanyService();

class CompanyController {
  constructor() {}

  async createCompany(request, response) {
    request = request.body;
    console.info('Received request for create Company profile.');
    if (
      !request.COMPANY_NAME ||
      !request.COMPANY_ADDRESS ||
      !request.COMPANY_TYPE ||
      !request.COMPANY_EMAIL ||
      !request.COMPANY_PHONE_NUMBER
    ) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to create new Company profile!',
      });
    }
    try {
      const createProfileResp = await companyService.createCompanySvc(request);
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

  async updateCompany(request, response) {
    request = request.body;
    console.info('Received request for update Company profile.');
    if (!request.COMPANY_ID || request.COMPANY_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to update Company profile!',
      });
    }

    try {
      const updateProfileResp = await companyService.updateCompanySvc(request);
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

  async getCompany(request, response) {
    request = request.query;
    console.info('Received request for get Company profile.');
    if (!request.COMPANY_ID || request.COMPANY_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to get Company profile!',
      });
    }
    try {
      const getProfileResp = await companyService.getCompanySvc(request);
      console.info(getProfileResp);
      return response.status(statusCode.ok).send({ result: getProfileResp });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }

  async deleteCompany(request, response) {
    request = request.body;
    console.info('Received request for delete Company profile.');
    if (!request.COMPANY_ID || request.COMPANY_ID.length === 0) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to delete Company profile!',
      });
    }
    try {
      const deleteProfileResp = await companyService.deleteCompanySvc(request);
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

module.exports = CompanyController;
