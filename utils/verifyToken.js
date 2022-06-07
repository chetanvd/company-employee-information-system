const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
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
    let decodedJwt = jwt.verify(token, 'chetanvdhongade');
    if (decodedJwt.email) {
      return next();
    } else {
      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log('err', err);
    return res.status(401).send({ status: false, message: '' + err });
  }
};
