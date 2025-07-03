import fs from 'fs/promises';
import path from 'path';

const defaultFilePath = path.resolve('./data/products.json');

export function createStore(filePath = defaultFilePath) {
  const dataFilePath = filePath;

  async function readProductsFromFile() {
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async function writeProductsToFile(products) {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
  }

  return {
    async getProducts() {
      return readProductsFromFile();
    },

    async getById(id) {
      const products = await readProductsFromFile();
      return products.find(p => p.id === id);
    },

    async addProduct(product) {
      const products = await readProductsFromFile();
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = { id: newId, ...product };
      products.push(newProduct);
      await writeProductsToFile(products);
      return newProduct;
    },

    async update(updatedProduct) {
      const products = await readProductsFromFile();
      const index = products.findIndex(p => p.id === updatedProduct.id);
      if (index === -1) throw new Error('Product not found');
      products[index] = { ...products[index], ...updatedProduct };
      await writeProductsToFile(products);
      return products[index];
    },

    async deleteProduct(id) {
      const products = await readProductsFromFile();
      const newProducts = products.filter(p => p.id !== id);
      await writeProductsToFile(newProducts);
    },

    async search(query) {
      const { name, minPrice, maxPrice } = query;
      const products = await readProductsFromFile();
      return products.filter(p => {
        const matchesName = name
          ? p.name.toLowerCase().includes(name.toLowerCase())
          : true;
        const matchesMin = minPrice ? p.price >= Number(minPrice) : true;
        const matchesMax = maxPrice ? p.price <= Number(maxPrice) : true;
        return matchesName && matchesMin && matchesMax;
      });
    },
  };
}
