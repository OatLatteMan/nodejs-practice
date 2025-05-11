const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

// Example protected route
router.get('/dashboard', requireLogin, (req, res) => {
    res.json({ message: `Welcome to your dashboard, ${req.session.user.username}` });
});

module.exports = router;
