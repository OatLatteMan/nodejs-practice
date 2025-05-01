const express = require('express');
const router = express.Router();

// Basic route
router.get('/', (req, res) => {
    res.send('<h2>Welcome to the Products page</h2>');
});

// Query string example
router.get('/search', (req, res) => {
    const { category, sort } = req.query;
    res.send(`<p>Searching for category: ${category}, sorted: ${sort}</p>`);
});

// Dynamic product ID
router.get('/:productId', (req, res) => {
    const id = req.params.productId;
    res.send(`<h2>Details for product ID: ${id}</h2>`);
});

module.exports = router;
