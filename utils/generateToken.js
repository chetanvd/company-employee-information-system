const jwt = require('jsonwebtoken');
require('dotenv').config();

async function generateToken(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = jwt.sign({ email: email }, process.env.ADMIN_TOKEN, {
        expiresIn: '24h',
      });
      return resolve(token);
    } catch (err) {
      console.log(err);
      reject({ status: false, message: 'Failed to generate token.' });
    }
  });
}

module.exports = {
  generateToken,
};
