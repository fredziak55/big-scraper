import { openDb } from './connectToDatabase.js'

//TODO Think about better (ANY) security
const getIntercoolers = async () => {
    try {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM intercoolers');
        await db.close();
        return rows || [];
    } catch (err) {
        console.error('Error fetching intercoolers:', err);
        throw err;
    }
}

export default getIntercoolers
