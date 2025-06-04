const express = require('express');
const router = express.Router();
const { getProducts, addProduct, deleteProduct } = require('../utils/productStoreLowdb');

// List all products
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    console.error('LowDB get error:', err);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Add a product
router.post('/', async (req, res) => {
  try {
    await addProduct(req.body);
    res.status(201).json({ message: 'Product added (lowdb)' });
  } catch (err) {
    console.error('LowDB add error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted (lowdb)' });
  } catch (err) {
    console.error('LowDB delete error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
