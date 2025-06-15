import { Low, JSONFile } from 'lowdb'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const file = path.join(__dirname, '../data/productsLowdb.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function init() {
  await db.read()
  db.data ||= { products: [] };
  await db.write()
}

init()

export { db }

export async function getProducts() {
  await db.read()
  return db.data.products
}

export async function getById(id) {
  await db.read()
  return db.data.products.find(p => p.id === id)
}

export async function addProduct(product) {
  await db.read()
  const newId = db.data.products.length ? Math.max(...db.data.products.map(p => p.id)) + 1 : 1
  const newProduct = { id: newId, ...product }
  db.data.products.push(newProduct)
  await db.write()
  return newProduct
}

export async function update(id, updated) {
  await db.read()
  const index = db.data.products.findIndex(p => p.id === id)
  if (index === -1) return null
  db.data.products[index] = { ...db.data.products[index], ...updated }
  await db.write()
  return db.data.products[index]
}

export async function deleteProduct(id) {
  await db.read()
  const index = db.data.products.findIndex(p => p.id === id)
  if (index === -1) return false
  db.data.products.splice(index, 1)
  await db.write()
  return true
}

export async function search({ q, minPrice, maxPrice }) {
  await db.read()
  return db.data.products.filter(p => {
    const nameMatch = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true
    const priceMatch = (!minPrice || p.price >= parseFloat(minPrice)) &&
                        (!maxPrice || p.price <= parseFloat(maxPrice))
    return nameMatch && priceMatch
  })
}
