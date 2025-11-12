const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/keys');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token.split(' ')[1], secretKey); // Expecting "Bearer <token>"
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' });
  }
}

module.exports = verifyToken;
