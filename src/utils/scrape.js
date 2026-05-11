import { getPage, getPageDetails } from "../models/scrape.model.js";
import { purgeIntercoolers } from "../models/intercoolers.model.js";
import { insertIntercoolers } from "../models/intercoolers.model.js";
import { Queue } from 'bullmq';

const scrapeIntercoolers = async (maxPages) => {
    await purgeIntercoolers();
    const myQueue = new Queue('scrapePage');

    for (let page = 1; page <= maxPages; page++) {
        await myQueue.add('scrapePage', { page });
    }
}

export default scrapeIntercoolers;