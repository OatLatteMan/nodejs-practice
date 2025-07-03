import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import * as store from '../utils/productStoreFs.js'; // <-- adjust path if needed

const DATA_FILE = path.resolve('../data/products.json');

const seedData = [
    { id: 1, name: 'Test Product A', price: 10 },
    { id: 2, name: 'Test Product B', price: 20 },
];

beforeEach(async () => {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedData, null, 2));
});

describe('productStore (fs/promises)', () => {
    it('should get all products', async () => {
        const products = await store.getProducts();
        expect(products).toHaveLength(2);
    });

    it('should get product by ID', async () => {
        const product = await store.getById(1);
        expect(product).toBeDefined();
        expect(product.name).toBe('Test Product A');
    });

    it('should add a new product', async () => {
        const newProduct = { name: 'Test Product C', price: 30 };
        const added = await store.addProduct(newProduct);
        expect(added.id).toBeDefined();
        const products = await store.getProducts();
        expect(products).toHaveLength(3);
    });

    it('should update a product', async () => {
        const updated = await store.update({ id: 1, name: 'Updated A', price: 15 });
        expect(updated.name).toBe('Updated A');
        const product = await store.getById(1);
        expect(product.price).toBe(15);
    });

    it('should delete a product', async () => {
        const result = await store.deleteProduct(2);
        expect(result).toBeTruthy();
        const products = await store.getProducts();
        expect(products).toHaveLength(1);
    });
});
