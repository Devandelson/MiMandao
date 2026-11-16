import conex from '@src/conex.ts'

export default async function ServiceRecents() {
    const recentsOrders = `
        SELECT 
            u.id_user, u.name,
            COUNT(o.id_order) AS totalR 
        FROM "order" AS o 
        INNER JOIN "user" AS u 
            ON u.id_user = o.id_user AND u.role <> 'admin'
        WHERE o.date >= NOW() - INTERVAL '30 minutes' 
        GROUP BY u.id_user, u.name;
    `;

    const todayOrders = `
        SELECT 
            u.id_user, u.name,
            COUNT(o.id_order) AS totalR 
        FROM "order" AS o 
        INNER JOIN "user" AS u 
            ON u.id_user = o.id_user AND u.role <> 'admin'
        WHERE o.date >= CURRENT_DATE 
          AND o.date < NOW() - INTERVAL '30 minutes' 
        GROUP BY u.id_user, u.name;
    `;

    const anotherOrders = `
        SELECT 
            u.id_user, 
            u.name,
            COUNT(o.id_order) AS totalR 
        FROM "order" AS o 
        INNER JOIN "user" AS u 
            ON u.id_user = o.id_user AND u.role <> 'admin'
        WHERE o.date < CURRENT_DATE 
        GROUP BY u.id_user, u.name;
    `;

    try {
        const resultRO = await conex.query(recentsOrders);
        const resultTO = await conex.query(todayOrders);
        const resultAO = await conex.query(anotherOrders);

        return {
            success: true,
            data: {
                recentsOrder: resultRO.rows,
                todayOrders: resultTO.rows,
                anotherOrders: resultAO.rows
            },
            status: 200
        };
    } catch (err) {
        return { success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 };
    }
}