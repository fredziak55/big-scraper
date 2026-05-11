import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { getPage, getPageDetails } from '../../models/scrape.model.js';
import { insertIntercoolers } from '../../models/intercoolers.model.js';

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
});

const QUEUE_NAME = 'scrapePage';
const BASE_URL = process.env.BASE_URL; // FIXME Co to za gówno

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { page } = job.data;
    if (!page) throw new Error('Missing "page" in job data');

    const pageUrl = BASE_URL + '?p=' + page;
    const products = await getPage(pageUrl);
    const detailedProducts = await getPageDetails(pageUrl, products);
    await insertIntercoolers(detailedProducts);

    return { page, count: detailedProducts.length };
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);

worker.on('ready', () => console.log('Worker listening on', QUEUE_NAME));
worker.on('active', (job) => console.log('Processing job', job.id, job.data));
worker.on('completed', (job, result) => console.log('Completed job', job.id, result));
worker.on('failed', (job, err) => console.error('Failed job', job?.id, err.message));

const shutdown = async (signal) => {
  console.log('Received', signal, 'closing worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
