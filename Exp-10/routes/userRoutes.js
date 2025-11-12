const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { secretKey } = require('../config/keys');

const router = express.Router();

// Register a user (for testing)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration Failed', error: err.message });
  }
});

// Login route - generate token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    secretKey,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login successful', token });
});

// Role-protected routes
router.get('/admin-panel', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome to the Admin Panel');
});

router.get('/moderator-zone', verifyToken, authorizeRoles('moderator', 'admin'), (req, res) => {
  res.send('Welcome to the Moderator Zone');
});

router.get('/user-dashboard', verifyToken, authorizeRoles('user', 'moderator', 'admin'), (req, res) => {
  res.send(`Welcome ${req.user.name}, this is your User Dashboard`);
});

module.exports = router;
