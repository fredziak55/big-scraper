"use strict"

import express from 'express'
import sqlite3 from 'sqlite3'
import scrapeController from "./routes/scrape.route.js"
import { initializeDatabase }  from "../src/models/database.model.js"
import appRouter from './routes/app.route.js'
import intercoolersRouter from './routes/intercoolers.route.js'

const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

initializeDatabase()

app.use('', appRouter);
app.use('/intercoolers', intercoolersRouter);
app.use('/scrape', scrapeController);

app.listen(port, () => {
  console.log(`Big scraper listening on port ${port}`)
})
