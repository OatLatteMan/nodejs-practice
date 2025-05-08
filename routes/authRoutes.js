const express = require('express');
const router = express.Router();
const userStore = require('../utils/userStore');

// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const existingUser = await userStore.findUser(username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  await userStore.addUser(username, password);
  req.session.username = username; // Auto-login after register
  res.json({ message: 'Registered successfully' });
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await userStore.findUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.username = username;
  res.json({ message: 'Logged in successfully' });
});

// Logout user
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
