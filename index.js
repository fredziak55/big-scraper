const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const db = new sqlite3.Database('cars.db')
db.run('CREATE TABLE IF NOT EXISTS intercoolers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, dimensions TEXT, url TEXT UNIQUE, capacityCm3 REAL, pricePerCm3 REAL)')

app.get('/intercoolers', (req, res) => {
  db.all('SELECT * FROM intercoolers', (err, rows) => {
    if (err) {
      res.status(500).send(err.message)
    } else {
      res.json(rows)
    }
  })
})

app.post('/scrape', async (req, res) => {
  const { scrapeIntercoolers } = require('./scraper')
  const maxPages = parseInt(req.body?.max_pages) || 0
  await scrapeIntercoolers(maxPages)
  res.send(`Scraping done! (max_pages=${maxPages || 'unlimited'})`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



