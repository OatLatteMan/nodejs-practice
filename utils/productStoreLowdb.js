// utils/productStoreLowdb.js
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, '../data/products.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// This wrapper is required since our root is a plain array
async function readDB() {
  await db.read();
  if (!Array.isArray(db.data)) {
    db.data = []; // if the file is empty or has wrong format
  }
}

module.exports = {
  async getAllProducts() {
    await readDB();
    return db.data;
  },

  async addProduct(newProduct) {
    await readDB();
    db.data.push(newProduct);
    await db.write();
  },

  async deleteProduct(productId) {
    await readDB();
    db.data = db.data.filter(p => p.id !== productId);
    await db.write();
  },

  async updateProduct(updatedProduct) {
    await readDB();
    const index = db.data.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      db.data[index] = updatedProduct;
      await db.write();
    }
  },

  async findProductById(id) {
    await readDB();
    return db.data.find(p => p.id === id);
  },

  async searchProducts(query = '', minPrice = 0, maxPrice = Infinity) {
    await readDB();
    return db.data.filter(p => {
      const matchesName = p.name.toLowerCase().includes(query.toLowerCase());
      const price = parseFloat(p.price);
      return matchesName && price >= minPrice && price <= maxPrice;
    });
  }
};
