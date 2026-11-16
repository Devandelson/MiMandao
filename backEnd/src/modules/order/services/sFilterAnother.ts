import conex from '@src/conex.ts'

export default async function filterAnother(start: string, limit: string) {
   const anotherOrdersQuery = `
        SELECT 
            u.id_user, 
            u.name,
            COUNT(o.id_order) AS totalR 
        FROM "order"  AS o INNER JOIN "user" AS u ON u.id_user = o.id_user
        WHERE o.date < CURRENT_DATE AND o.date BETWEEN $1 AND $2
        GROUP BY u.id_user, u.name;
    `;

    try {
        const result = await conex.query(anotherOrdersQuery, [start, limit]);

        return {
            success: true,
            data: result.rows,
            status: 200
        };
    } catch (err) {
        return { success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 };
    }
}