const express = require('express');
const fs = require('fs').promises;
const path = require('path');
import upload from '../utils/imageUpload.js';

const router = express.Router();
const dataFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Helper function: Read products from file
async function readProductsFromFile() {
  const fileData = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(fileData);
}

// GET /api/products/search?q=keyword
router.get('/search', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  try {
    const products = await readProductsFromFile();

    const matchedProducts = products.filter(p => {
      const nameMatches = p.name.toLowerCase().includes(query);
      const price = parseFloat(p.price); // still good practice

      const priceMatches =
        (isNaN(minPrice) || price >= minPrice) &&
        (isNaN(maxPrice) || price <= maxPrice);

      return nameMatches && priceMatches;
    });

    res.json(matchedProducts);
  } catch (err) {
    console.error('Error reading products:', err);
    res.status(500).json({ error: 'Failed to search products' });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await readProductsFromFile();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// POST a new product
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileData);

    const newProduct = {
      id: Date.now(),
      name,
      price,
      image
    };

    products.push(newProduct);

    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// ✅ GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await readProductsFromFile();
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error loading product:', err);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// ✅ PUT (update) product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileData);

    const productIndex = products.findIndex(p => p.id == req.params.id);
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedData = req.body;
    products[productIndex] = { ...products[productIndex], ...updatedData };

    if (image) {
      updatedProduct.image = image;
    }

    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    res.json({ message: 'Product updated', product: products[productIndex] });

  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ DELETE product by ID
router.delete('/:id', async (req, res) => {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileData);

    const productIndex = products.findIndex(p => p.id == req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = products.splice(productIndex, 1)[0];

    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    res.json({ message: 'Product deleted', product: deleted });

  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
