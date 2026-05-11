import express from 'express';
import * as scrapeController from "../controllers/scrape.controller.js";

const router = express.Router();

router.post('/', scrapeController.scrape);

export default router
