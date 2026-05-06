import { openDb } from './connectToDatabase.js'

const purgeIntercoolers = async () => {
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

export default purgeIntercoolers;
