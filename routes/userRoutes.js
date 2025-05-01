const express = require('express');
const router = express.Router();

router.get('/:username', (req, res) => {
  const username = req.params.username;
  res.send(`<h1>Hello from user route: ${username}</h1>`);
});

module.exports = router;
