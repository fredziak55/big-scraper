import * as cheerio from "cheerio";
import scrapeIntercoolers from "../utils/scrape.js";

const getscrapedIntercoolers = (app) => {
    app.post('/scrape', async (req, res) => {
        scrapeIntercoolers(app, req, res);
    });
}

export default getscrapedIntercoolers;
