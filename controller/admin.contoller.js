const AdminService = require('../services/admin.service');
const { statusCode } = require('../utils/constants');
let adminService = new AdminService();

class AdminController {
  constructor() {}
  async signIn(request, response) {
    request = request.body;
    console.info('Received request for sign-in.');
    if (!request.EMAIL || !request.PASSWORD) {
      return response.status(statusCode.not_found).send({
        status: false,
        message: 'Insufficient Data to Sign-In!',
      });
    }
    try {
      const SignInResp = await adminService.signInSvc(request);
      return response.status(statusCode.ok).json({
        result: SignInResp,
      });
    } catch (exe) {
      return response
        .status(statusCode.internal_server_error)
        .send({ status: false, message: 'Internal Server Error' });
    }
  }
}

module.exports = AdminController;
