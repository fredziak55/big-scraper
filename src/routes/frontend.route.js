import { getIntercoolers } from "../models/intercoolers.model.js"

const renderFrontendPages = async (app) => {
    const intercoolers = await getIntercoolers();

    app.get('/', async (req, res) => {
        res.render("../src/views/index.ejs", { count: intercoolers.length });
    });

    app.get('/showall', async (req, res) => {
        res.render("../src/views/showAll.ejs", { intercoolers });
    });
}

export default renderFrontendPages
