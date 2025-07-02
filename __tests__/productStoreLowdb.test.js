// productStoreLowdb.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { getProducts, addProduct, getById, update, deleteProduct, search } from '../utils/productStoreLowdb.js'
import fs from 'fs/promises'
import path from 'path'
import { db } from '../utils/productStoreLowdb.js'


const testDataPath = path.resolve('../data/productsLowdb.json')

// Reset the file before each test
beforeEach(async () => {
    db.data.products = []
    await db.write()
})

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

    it('returns undefined for non-existent ID', async () => {
        const result = await getById(999)
        expect(result).toBeUndefined()
    })

    it('returns null when updating a non-existent product', async () => {
        const result = await update(999, { name: 'Nothing' })
        expect(result).toBeNull()
    })

    it('returns false when trying to delete non-existent product', async () => {
        const result = await deleteProduct(999)
        expect(result).toBe(false)
    })

    it('returns all products if no search filters are given', async () => {
        await addProduct({ name: 'Alpha', price: 30 })
        await addProduct({ name: 'Beta', price: 50 })
        const results = await search({})
        expect(results.length).toBe(2)
    })

    it('returns empty array if no search matches', async () => {
        await addProduct({ name: 'Orange', price: 5 })
        const results = await search({ q: 'xyz', minPrice: 100 })
        expect(results).toEqual([])
    })
})
