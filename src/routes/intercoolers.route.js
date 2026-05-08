import express from 'express';
import * as intercoolersController from "../controllers/intercoolers.controller.js";

const router = express.Router();

router.get('/', intercoolersController.intercoolerIndex);

export default router
