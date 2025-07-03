import express from 'express';
import { createStore } from '../utils/productStoreFs.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const store = createStore();

// ✅ GET search
router.get('/search', async (req, res) => {
  const results = await store.search(req.query);
  res.json(results);
});

// ✅ GET all products
router.get('/', async (req, res) => {
  const products = await store.getProducts();
  res.json(products);
});

// ✅ GET by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await store.getById(id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// ✅ POST add new product
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Body:', req.body); // name & price
  console.log('File:', req.file); // the uploaded file info

  const newProduct = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    image: req.file ? req.file.filename : null, // store filename or path
  };

  const savedProduct = await store.addProduct(newProduct);
  res.status(201).json(savedProduct);
});

// ✅ PUT update product
router.put('/:id', upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  try {
    const updatedProduct = await store.update(updatedData);
    res.json(updatedProduct);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// ✅ DELETE product
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await store.deleteProduct(id);
  res.status(204).end();
});

export default router;
