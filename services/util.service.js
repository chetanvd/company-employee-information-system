const { makeRequest, getPaginatedData, sortArray } = require('../utils/helper');

class UtilService {
  async getDataSvc(data) {
    return new Promise(async (resolve, reject) => {
      try {
        var config = {
          method: 'get',
          url: 'https://api.covidtracking.com/v1/us/daily.json',
          headers: {},
        };
        let apiResp = await makeRequest(config);
        apiResp = await sortArray(apiResp, data.sort_by);

        if (data.limit && data.batch) {
          apiResp = await getPaginatedData(apiResp, data.limit, data.batch);
        }
        return resolve(apiResp);
      } catch (exe) {
        console.error(exe);
        reject({ status: false, message: 'Failed to get data!' });
      }
    });
  }
}

module.exports = UtilService;
