import { getPage, getPageDetails } from "../models/scrape.model.js";
import { purgeIntercoolers } from "../models/intercoolers.model.js";
import { insertIntercoolers } from "../models/intercoolers.model.js";

const BASE_URL = process.env.BASE_URL;

const scrapeIntercoolers = async (maxPages) => {
    await purgeIntercoolers();

    for (let page = 1; page <= maxPages; page++) {
        const pageUrl = `${BASE_URL}?p=${page}`; 
        const products = await getPage(pageUrl);
        const detailedProducts = await getPageDetails(pageUrl, products);
        await insertIntercoolers(detailedProducts);
    }
}

export default scrapeIntercoolers;