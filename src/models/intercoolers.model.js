import { getDatabaseConnection } from './database.model.js'

export const getIntercoolers = async () => {
    const pool = getDatabaseConnection()
    const { rows } = await pool.query('SELECT * FROM intercoolers')
    return rows
}

export const purgeIntercoolers = async () => {
    const pool = getDatabaseConnection()
    await pool.query('TRUNCATE intercoolers RESTART IDENTITY')
}

export const insertIntercoolers = async (intercoolers) => {
    if (!intercoolers.length) return
    const pool = getDatabaseConnection()

    for (const intercooler of intercoolers) {
        await pool.query(
            `INSERT INTO intercoolers (name, price, dimensions, url, capacity_cm3, price_per_cm3)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (url) DO NOTHING`,
            [intercooler.name, intercooler.price, intercooler.dimensions, intercooler.url, intercooler.volumeCm3, intercooler.priceFor1Cm3]
        )
    }
}
