import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { open } from 'sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createDatabase = () => {
  const db = new sqlite3.Database(__dirname + '/../../db/cars.db')
  db.run('CREATE TABLE IF NOT EXISTS intercoolers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, dimensions TEXT, url TEXT UNIQUE, capacityCm3 REAL, pricePerCm3 REAL)')
  db.close()
}

export const openDb = async () => {
  return open({
    filename: __dirname + '/../../db/cars.db',
    driver: sqlite3.Database
  })
}

