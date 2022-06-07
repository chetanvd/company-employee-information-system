const axios = require('axios');

const makeRequest = async function (config) {
  return new Promise(async (resolve, reject) => {
    axios(config)
      .then(function (response) {
        return resolve(response.data);
      })
      .catch(function (exe) {
        return reject('' + exe);
      });
  });
};

const getPaginatedData = function (arr, limit, batch) {
  let start = batch * limit;
  let end = start + limit;

  if (arr.length < start - limit) {
    arr = [];
  } else if (arr.length < end) {
    arr = arr.slice(start);
  } else {
    arr = arr.slice(start, end);
  }

  return arr;
};

const sortArray = function (arr, sort_by) {
  arr.sort((a, b) => (a[sort_by] > b[sort_by] ? 1 : -1));
  return arr;
};

module.exports = {
  makeRequest,
  getPaginatedData,
  sortArray,
};
