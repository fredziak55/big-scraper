import { getIntercoolers } from '../models/intercoolers.model.js';

export const intercoolerIndex = async (req, res) => {
    try {
        const intercoolers = await getIntercoolers();
        res.json(intercoolers);
    } catch (error) {
        console.error('Error fetching intercoolers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
