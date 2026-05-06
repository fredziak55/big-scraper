//TODO Add prism (ORM and migrations)
"use strict"

import express from 'express'
import sqlite3 from 'sqlite3'
import db from './models/createDatabase.js'
import intercoolersRouter from './routes/intercoolers.js'
import createDatabase from './models/createDatabase.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

intercoolersRouter(app)

app.post('/scrape', async (req, res) => {
  // TODO Send message to queue instead of synch processing, retunr 201 code
  const { default: scrapeIntercoolers } = await import('./scraper.js')
  const maxPages = parseInt(req.body?.max_pages) || 0
  await scrapeIntercoolers(maxPages)
  res.send(`Scraping done! (max_pages=${maxPages || 'unlimited'})`)
})


app.listen(port, () => {
  console.log(`Big scraper listening on port ${port}`)
})



