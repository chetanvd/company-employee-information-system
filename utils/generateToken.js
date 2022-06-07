const jwt = require('jsonwebtoken');

async function generateToken(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = jwt.sign({ email: email }, 'chetanvdhongade', {
        expiresIn: '24h',
      });
      return resolve('Bearer ' + token);
    } catch (err) {
      console.log(err);
      reject({ status: false, message: 'Failed to generate token.' });
    }
  });
}

module.exports = {
  generateToken,
};
