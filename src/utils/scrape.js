import { purgeIntercoolers } from "../models/intercoolers.model.js";
import { scrapeQueue } from "../models/queue.model.js";

const scrapeIntercoolers = async (maxPages) => {
    await purgeIntercoolers();

    for (let page = 1; page <= maxPages; page++) {
        await scrapeQueue.add('scrapePage', { page });
    }
}

export default scrapeIntercoolers;
