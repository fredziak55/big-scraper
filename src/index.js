//TODO Add prism (ORM and migrations)
"use strict"

import express from 'express'
import sqlite3 from 'sqlite3'
import intercoolersRouter from "./routes/intercoolers.route.js"
import getscrapedIntercoolers from "./routes/scrape.route.js"
import { createDatabase }  from "../src/models/database.model.js"
import renderFrontendPages from "./routes/frontend.route.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

createDatabase()
intercoolersRouter(app)
getscrapedIntercoolers(app)
renderFrontendPages(app)

app.listen(port, () => {
  console.log(`Big scraper listening on port ${port}`)
})
