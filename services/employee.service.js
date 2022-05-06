/**
  @module: user_service.js
  @description: user_service
  @version: 1.0
**/

const { collectionName } = require('../utils/constants');
const { getEpochTime } = require('../utils/dateConvertor');
const { getFirestore } = require('../utils/dbConfig');
const { hashString } = require('../utils/hashString');
class EmployeeService {
  constructor() {
    this.db = getFirestore();
  }

  async createEmployeeSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let employeeSnapshot = await this.db
          .collection(collectionName.EMPLOYEE)
          .where('phone_number', '==', data.EMPLOYEE_PHONE_NUMBER)
          .get();
        if (employeeSnapshot.docs.length > 0) {
          return resolve({
            status: false,
            message: `This given employee phone_number : ${data.EMPLOYEE_PHONE_NUMBER} is already in use.`,
          });
        }
        let preFix = data.EMPLOYEE_NAME.split(' ');
        let employeeId = hashString(
          preFix[0].charAt(0) +
            (preFix[preFix.length - 1].charAt(0)
              ? preFix[preFix.length - 1].charAt(0)
              : '') +
            '_',
          new Date().getTime() + ''
        );
        let employeeRef = this.db
          .collection(collectionName.EMPLOYEE)
          .doc(employeeId);
        await employeeRef.set(
          {
            name: data.EMPLOYEE_NAME,
            address: data.EMPLOYEE_ADDRESS,
            email: data.EMPLOYEE_EMAIL,
            phone_number: data.EMPLOYEE_PHONE_NUMBER,
            joined_date: new Date().getTime(),
            dob: await getEpochTime(data.EMPLOYEE_DOB),
            gender: data.EMPLOYEE_GENDER,
            reporting_manager_id: data.RPORTING_MANAGER
              ? data.RPORTING_MANAGER
              : '',
            company_id: data.COMPANY_ID,
          },
          { merge: true }
        );
        return resolve({
          status: true,
          message: 'Employee profile created successfully',
          employee_id: employeeId,
        });
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create employee profile' });
      }
    });
  }

  async updateEmployeeSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let updateObj = {};
        let employeeId = data.EMPLOYEE_ID;

        let employeeRef = this.db
          .collection(collectionName.EMPLOYEE)
          .doc(employeeId);
        let employeeSnapshot = await employeeRef.get();

        if (employeeSnapshot.exists) {
          if (
            data.EMPLOYEE_NAME !== null &&
            data.hasOwnProperty('EMPLOYEE_NAME')
          ) {
            updateObj.name = data.EMPLOYEE_NAME;
          }

          if (
            data.EMPLOYEE_ADDRESS !== null &&
            data.hasOwnProperty('EMPLOYEE_ADDRESS')
          ) {
            updateObj.address = data.EMPLOYEE_ADDRESS;
          }

          if (
            data.EMPLOYEE_EMAIL !== null &&
            data.hasOwnProperty('EMPLOYEE_EMAIL')
          ) {
            updateObj.email = data.EMPLOYEE_EMAIL;
          }

          if (
            data.EMPLOYEE_PHONE_NUMBER !== null &&
            data.hasOwnProperty('EMPLOYEE_PHONE_NUMBER')
          ) {
            updateObj.phone_number = data.EMPLOYEE_PHONE_NUMBER;
          }

          if (
            data.EMPLOYEE_DOB !== null &&
            data.hasOwnProperty('EMPLOYEE_DOB')
          ) {
            updateObj.dob = await getEpochTime(data.EMPLOYEE_DOB);
          }

          if (
            data.EMPLOYEE_GENDER !== null &&
            data.hasOwnProperty('EMPLOYEE_GENDER')
          ) {
            updateObj.gender = data.EMPLOYEE_GENDER;
          }

          if (
            data.RPORTING_MANAGER !== null &&
            data.hasOwnProperty('RPORTING_MANAGER')
          ) {
            updateObj.reporting_manager_id = data.RPORTING_MANAGER;
          }

          if (Object.keys(updateObj).length > 0) {
            await employeeRef.set(updateObj, { merge: true });
            return resolve({
              status: true,
              message: 'Employee profile updated successfully',
              employee_id: employeeId,
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
            message: 'INVALID / NOT FOUND employee_id : ' + employeeId,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to update employee profile' });
      }
    });
  }

  async getEmployeeSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let searchElement = data.SEARCH_ELEMENT;
        let employeeRef = this.db.collection(collectionName.EMPLOYEE);
        let employeeDetails = {},
          errorMessage = '',
          employeeSnapshot;

        switch (data.SEARCH_TYPE) {
          case 'EMPLOYEE_ID':
            errorMessage = 'INVALID / NOT FOUND employee_id : ' + searchElement;
            employeeRef.doc(searchElement);
            employeeSnapshot = await employeeRef.doc(searchElement).get();
            employeeDetails = {
              ...employeeSnapshot.data(),
              employee_id: searchElement,
            };
            break;
          case 'EMPLOYEE_NAME':
            errorMessage =
              'INVALID / NOT FOUND employee_name : ' + searchElement;
            employeeSnapshot = await employeeRef
              .where('name', '==', searchElement)
              .get();

            for (let soElement of employeeSnapshot.docs) {
              employeeDetails = {
                ...soElement.data(),
                employee_id: soElement.id,
              };
            }
            break;
          case 'EMPLOYEE_PHONE_NUMBER':
            errorMessage =
              'INVALID / NOT FOUND employee_phone_number : ' + searchElement;
            employeeSnapshot = await employeeRef
              .where('phone_number', '==', searchElement)
              .get();

            for (let soElement of employeeSnapshot.docs) {
              employeeDetails = {
                ...soElement.data(),
                employee_id: soElement.id,
              };
            }
            break;
          default:
            return resolve({
              status: false,
              message:
                'INVALID Search Element. It should be EMPLOYEE_ID or EMPLOYEE_NAME or EMPLOYEE_PHONE_NUMBER',
            });
            break;
        }

        if (Object.keys(employeeDetails).length) {
          employeeDetails = await this.getSubordinatesAndManager(
            employeeDetails,
            employeeRef
          );
          console.log(employeeDetails);
          return resolve(employeeDetails);
        } else {
          return resolve({
            status: false,
            message: errorMessage,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create employee profile' });
      }
    });
  }

  async getManagerSubordinatesSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let employeeRef = this.db.collection(collectionName.EMPLOYEE);
        let employeeDetails = {};

        let employeeSnapshot = await employeeRef.doc(data.EMPLOYEE_ID).get();

        if (!employeeSnapshot.exists) {
          return resolve({
            status: false,
            message: 'INVALID / NOT FOUND employee_id : ' + data.EMPLOYEE_ID,
          });
        }
        employeeDetails = {
          ...employeeSnapshot.data(),
          employee_id: data.EMPLOYEE_ID,
        };

        if (Object.keys(employeeDetails).length) {
          employeeDetails = await this.getSubordinatesAndManager(
            employeeDetails,
            employeeRef
          );
          console.log(employeeDetails);
          return resolve(employeeDetails);
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to create employee profile' });
      }
    });
  }

  async deleteEmployeeSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let employeeId = data.EMPLOYEE_ID;
        let employeeRef = this.db
          .collection(collectionName.EMPLOYEE)
          .doc(employeeId);
        let employeeSnapshot = await employeeRef.get();

        if (employeeSnapshot.exists) {
          await employeeRef.delete();
          return resolve({
            status: true,
            message: `EMPLOYEE DATA of employee_id : ${employeeId}, Deleted successfully.`,
          });
        } else {
          return resolve({
            status: false,
            message: 'INVALID / NOT FOUND employee_id : ' + employeeId,
          });
        }
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to delete employee profile' });
      }
    });
  }

  async getSubordinatesAndManager(employeeDetails, employeeRef) {
    let employeeId = employeeDetails.employee_id;
    let response = {
      reportingManagerDetails: [],
      subOrdinatesDetails: [],
    };

    if (
      employeeDetails.reporting_manager_id !== '' &&
      employeeDetails.hasOwnProperty('reporting_manager_id')
    ) {
      let reportingManagerSnapshot = await employeeRef
        .doc(employeeDetails.reporting_manager_id)
        .get();

      response.reportingManagerDetails.push({
        ...reportingManagerSnapshot.data(),
        employee_id: employeeDetails.reporting_manager_id,
      });
    }

    let subOrdinatesSnapshot = await employeeRef
      .where('reporting_manager_id', '==', employeeId)
      .get();

    for (let soElement of subOrdinatesSnapshot.docs) {
      response.subOrdinatesDetails.push({
        ...soElement.data(),
        employee_id: soElement.id,
      });
    }
    return response;
  }
}

module.exports = EmployeeService;
