import { openDb } from './database.model.js'

//TODO Think about better (ANY) security
export const getIntercoolers = async () => {
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

export const purgeIntercoolers = async () => {
    try {
        const db = await openDb();
        const result = await db.run('DELETE FROM intercoolers');
        await db.run("DELETE FROM sqlite_sequence WHERE name='intercoolers'");
        await db.close();
        return result;
    } catch (err) {
        console.error('Error deleting intercoolers:', err);
        throw err;
    }
}
