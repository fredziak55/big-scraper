import scrapeIntercoolers from "../utils/scrape.js";

export const scrape = (req, res) => {
    try {
        const maxPages = req.body.maxPages = parseInt(req.body.maxPages) || 1;
        scrapeIntercoolers(maxPages);
        res.status(200).json({ message: 'Scraping started' });
    } catch (error) {
        console.error('Error starting scraping:', error);
    }
}
