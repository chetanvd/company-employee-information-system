const UtilService = require('../services/util.service');
const { statusCode } = require('../utils/constants');
let utilService = new UtilService();

class UtilController {
  constructor() {}

  async getData(request, response) {
    request = request.query;
    console.info('Received request for get data.');
    if (!request.sort_by) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to get data!',
      });
    }
    try {
      const getProfileResp = await utilService.getDataSvc(request);
      return response.status(statusCode.ok).send({ result: getProfileResp });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }
}

module.exports = UtilController;
