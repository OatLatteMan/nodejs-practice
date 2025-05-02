const express = require('express');
const router = express.Router();

// Sample data
const products = [
    { id: 1, name: 'Guitar', price: 300 },
    { id: 2, name: 'Piano', price: 1200 },
    { id: 3, name: 'Drum Kit', price: 750 },
];

// GET /api/products
router.get('/products', (req, res) => {
    res.json(products);
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

module.exports = router;
