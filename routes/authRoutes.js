const express = require('express');
const router = express.Router();
const userStore = require('../utils/userStore');
const bcrypt = require('bcrypt');

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
  try {
    const { username, password, rememberMe } = req.body;

    const user = await userStore.findUser(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = { username };

    // ✅ Only set maxAge if rememberMe is checked
    if (rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
    } else {
      // ❗ Do not set maxAge → makes cookie expire on browser close
      req.session.cookie.expires = false;
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// Logout user
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
};

// Change password
router.post('/change-password', requireLogin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.session.user.username;

  try {
    const user = await userStore.findUser(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({ error: 'Current password incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await userStore.updatePassword(username, hashed);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current logged-in user
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      loggedInAs: req.session.user.username,
      username: req.session.user.username,
    });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.get('/session', (req, res) => {
  res.json({ loggedIn: !!req.session.user });
});


module.exports = router;
