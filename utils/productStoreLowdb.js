const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')

const file = path.join(__dirname, '../data/productsLowdb.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function readSafe() {
  await db.read()
  db.data ||= { products: [] }
  console.log("DB after read:", db.data)
}

module.exports = {
  async getAll() {
    await readSafe()
    return db.data.products
  },

  async getById(id) {
    await readSafe()
    return db.data.products.find(p => p.id === id)
  },

  async add(product) {
    await readSafe()
    const newId = db.data.products.length ? Math.max(...db.data.products.map(p => p.id)) + 1 : 1
    const newProduct = { id: newId, ...product }
    db.data.products.push(newProduct)
    await db.write()
    return newProduct
  },

  async update(id, updated) {
    await readSafe()
    const index = db.data.products.findIndex(p => p.id === id)
    if (index === -1) return null
    db.data.products[index] = { ...db.data.products[index], ...updated }
    await db.write()
    return db.data.products[index]
  },

  async delete(id) {
    await readSafe()
    const index = db.data.products.findIndex(p => p.id === id)
    if (index === -1) return false
    db.data.products.splice(index, 1)
    await db.write()
    return true
  },

  async search({ q, minPrice, maxPrice }) {
    await readSafe()
    return db.data.products.filter(p => {
      const nameMatch = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true
      const priceMatch = (!minPrice || p.price >= parseFloat(minPrice)) &&
        (!maxPrice || p.price <= parseFloat(maxPrice))
      return nameMatch && priceMatch
    })
  }
}
