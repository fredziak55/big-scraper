const sqlite3 = require('sqlite3')

const createDatabase = () => {
  const db = new sqlite3.Database(__dirname + '/../../db/cars.db')
  db.run('CREATE TABLE IF NOT EXISTS intercoolers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, dimensions TEXT, url TEXT UNIQUE, capacityCm3 REAL, pricePerCm3 REAL)')
  
  return db
}

// TODO Read what is a singleton
module.exports = createDatabase()
