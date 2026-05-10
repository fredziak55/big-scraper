import * as cheerio from "cheerio";
import scrapeIntercoolers from "../utils/scrape.js";

// DEPRECATED
const getscrapedIntercoolers = (app) => {
    // TODO Refactor into queue worker
    app.post('/scrape', async (req, res) => {
        scrapeIntercoolers(app, req, res);
    });
}

export default getscrapedIntercoolers;
