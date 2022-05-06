/**
  @module: user_service.js
  @description: user_service
  @version: 1.0
**/

const { collectionName } = require('../utils/constants');
const { getFirestore } = require('../utils/dbConfig');
const { generateToken } = require('../utils/generateToken');
class AdminService {
  constructor() {
    this.db = getFirestore();
  }

  async signUpSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let adminRef = await this.db
          .collection(collectionName.ADMIN)
          .doc(data.EMAIL);
        let adminSnapshot = await adminRef.get();
        if (adminSnapshot.exists) {
          return resolve({
            status: false,
            message: `This given Admin email : ${data.EMAIL} is already in use.`,
          });
        }

        await adminRef.set(
          {
            email: data.EMAIL,
            password: data.PASSWORD,
            role: data.ROLE,
          },
          { merge: true }
        );
        return resolve({
          status: true,
          message: 'Admin created successfully',
        });
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create Admin' });
      }
    });
  }

  async signInSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let adminRef = await this.db
          .collection(collectionName.ADMIN)
          .doc(data.EMAIL);
        let adminSnapshot = await adminRef.get();

        if (!adminSnapshot.exists) {
          return resolve({
            status: false,
            message: `Given Admin Email : ${data.EMAIL} is not signed-up, please do sign-up.`,
          });
        }

        let adminData = adminSnapshot.data();
        if (data.PASSWORD !== adminData.password) {
          return resolve({
            status: false,
            message: `Wrogn password`,
          });
        }
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
