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

// Check current session user
router.get('/me', (req, res) => {
  if (req.session.username) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.status(401).json({ loggedIn: false, message: 'Not logged in' });
  }
});

// Temporary route to test session
router.get('/check-session', (req, res) => {
  console.log('Check session:', req.session);

  const username = req.session?.user?.username;
  if (username) {
    res.json({ loggedInAs: username });
  } else {
    res.status(401).json({ error: 'Not logged in' });
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
    console.log('Session set:', req.session); // <--- DEBUG

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
