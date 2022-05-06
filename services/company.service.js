/**
  @module: user_service.js
  @description: user_service
  @version: 1.0
**/

const { collectionName } = require('../utils/constants');
const { getFirestore } = require('../utils/dbConfig');
const { generateToken } = require('../utils/generateToken');
const { hashString } = require('../utils/hashString');
class CompanyService {
  constructor() {
    this.db = getFirestore();
  }

  async createCompanySvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let companySnapshot = await this.db
          .collection(collectionName.COMPANY)
          .where('email', '==', data.COMPANY_EMAIL)
          .get();
        if (companySnapshot.docs.length > 0) {
          return resolve({
            status: false,
            message: `This given company email : ${data.COMPANY_EMAIL} is already in use.`,
          });
        }

        let companyId = hashString('CD_', new Date().getTime() + '');
        let companyRef = this.db
          .collection(collectionName.COMPANY)
          .doc(companyId);
        await companyRef.set(
          {
            name: data.COMPANY_NAME,
            address: data.COMPANY_ADDRESS,
            type: data.COMPANY_TYPE,
            founded_date: new Date().getTime() + '',
            email: data.COMPANY_EMAIL,
            phone_number: data.COMPANY_PHONE_NUMBER,
          },
          { merge: true }
        );
        return resolve({
          status: true,
          message: 'Company profile created successfully',
          company_id: companyId,
        });
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create comapany profile' });
      }
    });
  }

  async updateCompanySvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateObj = {};
        let companyId = data.COMPANY_ID;

        let companyRef = this.db
          .collection(collectionName.COMPANY)
          .doc(companyId);
        let comapanySnapshot = await companyRef.get();

        if (comapanySnapshot.exists) {
          if (data.COMPANY_NAME && data.hasOwnProperty('COMPANY_NAME')) {
            updateObj.name = data.COMPANY_NAME;
          }
          if (data.COMPANY_ADDRESS && data.hasOwnProperty('COMPANY_ADDRESS')) {
            updateObj.address = data.COMPANY_ADDRESS;
          }
          if (data.COMPANY_TYPE && data.hasOwnProperty('COMPANY_TYPE')) {
            updateObj.type = data.COMPANY_TYPE;
          }
          if (data.COMPANY_EMAIL && data.hasOwnProperty('COMPANY_EMAIL')) {
            updateObj.email = data.COMPANY_EMAIL;
          }
          if (
            data.COMPANY_PHONE_NUMBER &&
            data.hasOwnProperty('COMPANY_PHONE_NUMBER')
          ) {
            updateObj.phone_number = data.COMPANY_PHONE_NUMBER;
          }

          if (Object.keys(updateObj).length > 0) {
            await companyRef.set(updateObj, { merge: true });
            return resolve({
              status: true,
              message: 'Company profile updated successfully',
              company_id: companyId,
            });
          } else {
            return resolve({
              status: true,
              message: 'Nothing to update.',
            });
          }
        } else {
          return resolve({
            status: false,
            message: 'INVALID / NOT FOUND company_id : ' + companyId,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to update comapany profile' });
      }
    });
  }

  async getCompanySvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let companyId = data.COMPANY_ID;
        let companyRef = this.db
          .collection(collectionName.COMPANY)
          .doc(companyId);
        let comapanySnapshot = await companyRef.get();

        if (comapanySnapshot.exists) {
          return resolve(comapanySnapshot.data());
        } else {
          return resolve({
            status: false,
            message: 'INVALID / NOT FOUND company_id : ' + companyId,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create comapany profile' });
      }
    });
  }

  async deleteCompanySvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let companyId = data.COMPANY_ID;
        let companyRef = this.db
          .collection(collectionName.COMPANY)
          .doc(companyId);
        let comapanySnapshot = await companyRef.get();

        if (comapanySnapshot.exists) {
          await companyRef.delete();
          return resolve({
            status: true,
            message: `COMPANY DATA of company_id : ${companyId}, Deleted successfully.`,
          });
        } else {
          return resolve({
            status: false,
            message: 'INVALID / NOT FOUND company_id : ' + companyId,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to delete comapany profile' });
      }
    });
  }
}

module.exports = CompanyService;
