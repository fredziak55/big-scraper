import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'scraper',
  password: process.env.PGPASSWORD || 'scraper',
  database: process.env.PGDATABASE || 'bigscraper', //TODO czy powinny tutaj byćdefaulty wartości?
  max: 20,
})

export const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS intercoolers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      price REAL,
      dimensions TEXT,
      url TEXT UNIQUE,
      capacity_cm3 REAL,
      price_per_cm3 REAL
    )
  `)
}

export const getDatabaseConnection = () => pool;