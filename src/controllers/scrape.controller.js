import scrapeIntercoolers from "../utils/scrape.js";

let baseline = { completed: 0, failed: 0 };
let pages = 0;

export const scrape = async (req, res) => {
    try {
        const { scrapeQueue } = await import("../models/queue.model.js");
        const [preCompleted, preFailed] = await Promise.all([
            scrapeQueue.getCompletedCount(),
            scrapeQueue.getFailedCount(),
        ]);

        const maxPages = parseInt(req.body.max_pages) || 1;
        console.log('Max pages to scrape:', maxPages);
        await scrapeIntercoolers(maxPages);

        baseline = { completed: preCompleted, failed: preFailed };
        pages = maxPages;
        res.status(200).json({ message: 'Jobs enqueued', pages: maxPages });
    } catch (error) {
        console.error('Error starting scraping:', error);
        res.status(500).json({ error: 'Failed to start scraping' });
    }
}

export const status = async (req, res) => {
    const { scrapeQueue } = await import("../models/queue.model.js");
    const [currentCompleted, currentFailed, waiting, active] = await Promise.all([
        scrapeQueue.getCompletedCount(),
        scrapeQueue.getFailedCount(),
        scrapeQueue.getWaitingCount(),
        scrapeQueue.getActiveCount(),
    ]);

    const completed = currentCompleted - baseline.completed;
    const failed = currentFailed - baseline.failed;

    res.json({
        waiting, active,
        completed, failed,
        total: pages,
        done: waiting + active === 0,
    });
}
