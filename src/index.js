//TODO Add prism (ORM and migrations)
const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3')
const db = require('./models/createDatabase.js') 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//TODO Think about better (ANY) security
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
  // TODO Send message to queue instead of synch processing, retunr 201 code
  const { scrapeIntercoolers } = require('./scraper')
  const maxPages = parseInt(req.body?.max_pages) || 0
  await scrapeIntercoolers(maxPages)
  res.send(`Scraping done! (max_pages=${maxPages || 'unlimited'})`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



