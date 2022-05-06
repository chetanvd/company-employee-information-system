require('dotenv').config();

module.exports = async (req, res, next) => {
  console.log('Check if request is authorized with Auth token');

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'No token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer Token>'
    );
    res.status(403).json({ error: 'Unauthorized' });
    return false;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    res.status(403).json({ error: 'Unauthorized' });
    return false;
  }

  if (idToken === process.env.ADMIN_TOKEN) {
    return next();
  } else {
    console.error('Invalid Token');
    res.status(403).json({ error: 'Unauthorized' });
    return false;
  }
};
