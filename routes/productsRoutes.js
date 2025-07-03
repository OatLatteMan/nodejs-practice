import express from 'express';
import upload from '../utils/imageUpload.js';
import {
  getProducts,
  getById,
  addProduct,
  update,
  deleteProduct
} from '../utils/productStoreFs.js'; // 👈 new import

const router = express.Router();

// ✅ GET all
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// ✅ GET by ID
router.get('/:id', async (req, res) => {
  const product = await getById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// ✅ POST new
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price required' });
  }
  const newProduct = await addProduct({ name, price, image });
  res.status(201).json(newProduct);
});

// ✅ PUT update
router.put('/:id', upload.single('image'), async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const updated = await update({
    id: req.params.id,
    ...req.body,
    ...(image && { image })
  });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', product: updated });
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
  const result = await deleteProduct(req.params.id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ✅ Search


export default router;
