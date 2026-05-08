import { getIntercoolers } from "../models/intercoolers.model.js";

export const getMainPage = async (req, res) => {
    const intercoolers = await getIntercoolers();
    res.render("../src/views/index.ejs", { count: intercoolers.length });
}

export const showAll = async (req, res) => {
    const intercoolers = await getIntercoolers();
    res.render("../src/views/showAll.ejs", { intercoolers });
}
