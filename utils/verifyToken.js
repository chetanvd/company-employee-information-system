const jwt = require('jsonwebtoken');
const { collectionName } = require('./constants');
const { getFirestore } = require('./dbConfig');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    this.db = getFirestore();
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      console.error(
        'No token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Token>'
      );
      return res.status(403).json({ error: 'Token Not Found.' });
    }

    const token = req.headers['authorization'].split(' ')[1];
    let decodedJwt = jwt.verify(token, process.env.ADMIN_TOKEN);
    if (decodedJwt.email) {
      let adminRef = await this.db
        .collection(collectionName.ADMIN)
        .doc(decodedJwt.email);
      let adminSnapshot = await adminRef.get();

      console.log(decodedJwt.email);
      if (!adminSnapshot.exists) {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
      }

      let adminData = adminSnapshot.data();
      if (adminData.role === 'ADMIN') {
        return next();
      } else {
        return res
          .status(401)
          .json({ status: false, message: 'Only ADMIN can access the data.' });
      }
    } else {
      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log('err', err);
    return res.status(401).send({ status: false, message: '' + err });
  }
};
