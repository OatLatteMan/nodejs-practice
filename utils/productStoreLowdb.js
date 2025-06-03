import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

// For ESM-style __dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to productsLowdb.json
const file = path.join(__dirname, '../data/productsLowdb.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Default structure
await db.read()
db.data ||= { products: [] }
await db.write()

// Get all products
export async function getProducts() {
  await db.read()
  return db.data.products
}

// Add a new product
export async function addProduct(product) {
  await db.read()
  db.data.products.push(product)
  await db.write()
}

// Delete a product by id
export async function deleteProduct(id) {
  await db.read()
  db.data.products = db.data.products.filter(p => p.id !== id)
  await db.write()
}

// Update a product by id
export async function updateProduct(id, newData) {
  await db.read()
  const index = db.data.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.data.products[index] = { ...db.data.products[index], ...newData }
    await db.write()
  }
}
