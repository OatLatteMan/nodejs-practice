// utils/productStoreFs.js (example)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFilePath = path.join(__dirname, '..', 'data', 'products.json');

// 🔑 get all products
export async function getProducts() {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
}

// 🔑 search product by name or min/max price
// export async function search() {
//     const products = await getProducts();
//     return products.filter(p => {
//         const nameMatch = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true
//         const priceMatch = (!minPrice || p.price >= parseFloat(minPrice)) &&
//             (!maxPrice || p.price <= parseFloat(maxPrice))
//         return nameMatch && priceMatch
//     })
// }

// 🔑 get by ID
export async function getById(id) {
    const products = await getProducts();
    return products.find(p => p.id == id);
}

// 🔑 add product
export async function addProduct({ name, price, image = null }) {
    const products = await getProducts();
    const newProduct = {
        id: Date.now(),
        name,
        price,
        image
    };
    products.push(newProduct);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    return newProduct;
}

// 🔑 update product
export async function update({ id, ...updates }) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    return products[index];
}

// 🔑 delete product
export async function deleteProduct(id) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return false;

    products.splice(index, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    return true;
}
