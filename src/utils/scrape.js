import { getPage, getPageDetails } from "../models/scrape.model.js";
import { purgeIntercoolers } from "../models/intercoolers.model.js";
import { insertIntercoolers } from "../models/intercoolers.model.js";

const BASE_URL = `${process.env.BASE_URL}`;

const scrapeIntercoolers = async (app) => {
    await purgeIntercoolers();
    const MAX_PAGES = parseInt(req.body?.max_pages) || 0

    for (let page = 1; page <= MAX_PAGES; page++) {
        const pageUrl = `${BASE_URL}?p=${page}`; 
        const products = await getPage(pageUrl);
        const detailedProducts = await getPageDetails(pageUrl, products);
        await insertIntercoolers(detailedProducts);
    }

    res.status(200).json({ message: "Scraping ended" });
}

export default scrapeIntercoolers;