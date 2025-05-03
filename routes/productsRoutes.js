const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Helper: Load products
function loadProducts() {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Helper: Save products
function saveProducts(products) {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
}

// GET all products
router.get('/', (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// POST a new product
router.post('/', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const products = loadProducts();
  const newProduct = {
    id: Date.now(),
    name,
    price
  };
  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});

// ✅ GET product by ID
router.get('/:id', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// ✅ DELETE product by ID
router.delete('/:id', (req, res) => {
  let products = loadProducts();
  const productIndex = products.findIndex(p => p.id == req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(productIndex, 1)[0];
  saveProducts(products);
  res.json({ message: 'Product deleted', product: deleted });
});

// ✅ PUT (update) product by ID
router.put('/:id', (req, res) => {
  let products = loadProducts();
  const productIndex = products.findIndex(p => p.id == req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedData = req.body;
  products[productIndex] = { ...products[productIndex], ...updatedData };
  saveProducts(products);

  res.json({ message: 'Product updated', product: products[productIndex] });
});

module.exports = router;
