const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { secretKey } = require('../config/keys');

const router = express.Router();

// Simulated user data (in real systems, verify from DB)
const user = {
  id: 1,
  name: 'Shreshta',
  email: 'shreshta@example.com',
  password: 'password123'
};

// LOGIN route – generates JWT
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: 'Invalid Credentials' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, secretKey, {
    expiresIn: '1h'
  });

  res.json({ message: 'Login Successful', token });
});

// PROTECTED route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you have accessed a protected route!` });
});

module.exports = router;
