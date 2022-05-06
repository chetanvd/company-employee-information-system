const crypto = require('crypto');

function hashString(id, data) {
  try {
    var hash = crypto.createHash('md5').update(data).digest('hex');
    return id + hash.substr(0, 10);
  } catch (e) {
    throw new Error('' + e);
  }
}

module.exports = {
  hashString,
};
