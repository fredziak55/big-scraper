//TODO Add prism (ORM and migrations)
"use strict"

import express from 'express'
import sqlite3 from 'sqlite3'
import db from './models/createDatabase.js'
import intercoolersRouter from './routes/intercoolers.js'
import createDatabase from './models/createDatabase.js'
import scrapeIntercoolers from './routes/scrape.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

intercoolersRouter(app)
scrapeIntercoolers(app)

app.listen(port, () => {
  console.log(`Big scraper listening on port ${port}`)
})



