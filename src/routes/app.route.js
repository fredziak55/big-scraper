import express from 'express';
import * as appController from '../controllers/app.controller.js';

const router = express.Router();

router.get('/', appController.getMainPage);
router.get('/showall', appController.showAll);

export default router;
