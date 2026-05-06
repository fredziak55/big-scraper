import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { open } from 'sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function openDb () {
  return open({
    filename: __dirname + '/../../db/cars.db',
    driver: sqlite3.Database
  })
}