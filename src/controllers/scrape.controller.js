import scrapeIntercoolers from "../utils/scrape.js";

export const scrape = (req, res) => {
    try {
        const maxPages = parseInt(req.body.max_pages) || 1;
        console.log(req.body);
        console.log('Max pages to scrape:', maxPages);
        scrapeIntercoolers(maxPages);
        res.status(200).json({ message: 'Scraping started' });
    } catch (error) {
        console.error('Error starting scraping:', error);
    }
}
