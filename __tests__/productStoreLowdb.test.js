// productStoreLowdb.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { getProducts, addProduct, getById, update, deleteProduct, search } from './utils/productStoreLowdb.js'
import fs from 'fs/promises'
import path from 'path'

const testDataPath = path.resolve('./data/productsLowdb.json')

// Reset the file before each test
beforeEach(async () => {
    await fs.writeFile(testDataPath, JSON.stringify({ products: [] }, null, 2))
})

describe('productStoreLowdb', () => {
    it('adds and gets a product by ID', async () => {
        const product = await addProduct({ name: 'Test', price: 100 })
        const result = await getById(product.id)
        expect(result).toEqual(product)
    })

    it('returns all products', async () => {
        await addProduct({ name: 'One', price: 10 })
        await addProduct({ name: 'Two', price: 20 })
        const result = await getProducts()
        expect(result.length).toBe(2)
    })

    it('updates a product', async () => {
        const added = await addProduct({ name: 'Old', price: 10 })
        const updated = await update(added.id, { name: 'New' })
        expect(updated.name).toBe('New')
    })

    it('deletes a product', async () => {
        const added = await addProduct({ name: 'ToDelete', price: 15 })
        const success = await deleteProduct(added.id)
        const remaining = await getProducts()
        expect(success).toBe(true)
        expect(remaining.length).toBe(0)
    })

    it('searches by name and price range', async () => {
        await addProduct({ name: 'Apple', price: 10 })
        await addProduct({ name: 'Banana', price: 20 })
        const results = await search({ q: 'a', minPrice: 5, maxPrice: 15 })
        expect(results.length).toBe(1)
        expect(results[0].name).toBe('Apple')
    })
})
