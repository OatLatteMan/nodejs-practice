const express = require('express');
const router = express.Router();
const userStore = require('../utils/userStore');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await userStore.findUser(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // ✅ THIS LINE IS CRUCIAL
    await userStore.addUser({ username, password });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userStore.findUser(username);

    if (!existingUser || existingUser.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store minimal session info
    req.session.user = { username: existingUser.username };

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
