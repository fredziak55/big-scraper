//TODO Add prism (ORM and migrations)
"use strict"

import express from 'express'
import sqlite3 from 'sqlite3'
import intercoolersRouter from "../src/routes/intercoolers.js"
import scrapeIntercoolers from "../src/routes/scrape.js"
import { createDatabase }  from "../src/models/database.model.js"
import { getIntercoolers } from "../src/models/intercoolers.model.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

createDatabase()
intercoolersRouter(app)
scrapeIntercoolers(app)
const intercoolers = await getIntercoolers();

app.get('/', async (req, res) => {
  res.render("../src/views/index.ejs", { count: intercoolers.length });
});

app.get('/showall', async (req, res) => {
  res.render("../src/views/showAll.ejs", { intercoolers });
});

app.listen(port, () => {
  console.log(`Big scraper listening on port ${port}`)
})
