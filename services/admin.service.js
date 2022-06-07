const { collectionName } = require('../utils/constants');
const { generateToken } = require('../utils/generateToken');
class AdminService {
  async signInSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let Token = await generateToken(data.EMAIL);
        return resolve({
          status: true,
          token: Token,
          message: 'This token will expire in next 24 hours.',
        });
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to Sign-in' });
      }
    });
  }
}

module.exports = AdminService;
