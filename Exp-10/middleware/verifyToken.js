const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/keys');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  try {
    const verified = jwt.verify(token.split(' ')[1], secretKey);
    req.user = verified; // user data from token
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
  }
}

module.exports = verifyToken;
