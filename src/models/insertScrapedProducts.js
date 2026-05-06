import { openDb } from './connectToDatabase.js'

const insertProduct = async (name, price, url, dimensions, capacityCm3, pricePerCm3) => {
    try {
        const db = await openDb();
        const result = await db.run(
            `INSERT OR IGNORE INTO intercoolers (name, price, dimensions, url, capacityCm3, pricePerCm3)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, price, dimensions, url, capacityCm3, pricePerCm3]
        );
        await db.close();
        return result;
    } catch (err) {
        console.error('Error inserting product:', err);
        throw err;
    }
}

export default insertProduct
