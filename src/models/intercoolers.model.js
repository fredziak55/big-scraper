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

export const insertIntercoolers = async (intercoolers) => {
    try {
        const db = await openDb();
        for (const intercooler of intercoolers) {
            await db.run(
                `INSERT OR IGNORE INTO intercoolers (name, price, dimensions, url, capacityCm3, pricePerCm3)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                intercooler.name,
                intercooler.price,
                intercooler.dimensions,
                intercooler.url,
                intercooler.volumeCm3,
                intercooler.priceFor1Cm3
            );
        }
        await db.close();
    } catch (err) {
        console.error('Error inserting intercooler:', err);
        throw err;
    }
}