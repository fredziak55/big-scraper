import { getPage, getPageDetails } from "../models/scrape.model.js";
import { purgeIntercoolers } from "../models/intercoolers.model.js";
import { insertIntercoolers } from "../models/intercoolers.model.js";
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
});

const scrapeIntercoolers = async (maxPages) => {
    await purgeIntercoolers();
    const myQueue = new Queue('scrapePage', { connection });

    for (let page = 1; page <= maxPages; page++) {
        await myQueue.add('scrapePage', { page });
    }

    await myQueue.close();
}

export default scrapeIntercoolers;
