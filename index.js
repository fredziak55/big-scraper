const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const scraper = require('./scraper')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const db = new sqlite3.Database('cars.db')
db.exec('CREATE TABLE IF NOT EXISTS intercoolers (id INTEGER PRIMARY KEY, name TEXT, price REAL, dimensions TEXT, url TEXT, capacityCm3 REAL, pricePerCm3 REAL)')

app.get('/intercoolers', (req, res) => {
  db.all('SELECT * FROM intercoolers', (err, rows) => {
    if (err) {
      res.status(500).send(err.message)
    } else {
      res.json(rows)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



