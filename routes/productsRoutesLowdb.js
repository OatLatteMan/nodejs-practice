import express from 'express'
import {
  getProducts,
  getById,
  addProduct,
  update,
  deleteProduct,
  search
} from '../utils/productStoreLowdb.js'

const router = express.Router()

// GET all products or search
router.get('/', async (req, res) => {
  const { q, minPrice, maxPrice } = req.query
  try {
    const products = (q || minPrice || maxPrice)
      ? await search({ q, minPrice, maxPrice })
      : await getProducts()
    res.json(products)
  } catch (err) {
    console.error('LowDB get error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const product = await getById(id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    console.error('LowDB getById error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST new product
router.post('/', async (req, res) => {
  try {
    const product = await addProduct(req.body)
    res.status(201).json(product)
  } catch (err) {
    console.error('LowDB add error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const updated = await update(id, req.body)
    if (!updated) return res.status(404).json({ error: 'Product not found' })
    res.json(updated)
  } catch (err) {
    console.error('LowDB update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const success = await deleteProduct(id)
    if (!success) return res.status(404).json({ error: 'Product not found' })
    res.status(204).end()
  } catch (err) {
    console.error('LowDB delete error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
