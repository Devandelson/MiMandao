import conex from '@src/conex.ts'

export default async function sUniqueUserOrders(id_user: number, typeDate: string) {
    const recentsOrders = `
        SELECT * FROM "order" 
        WHERE date >= NOW() - INTERVAL '30 minutes' AND id_user = $1
        ORDER BY id_order DESC;
    `;

    const todayOrders = `
        SELECT * FROM "order" 
        WHERE date >= CURRENT_DATE AND date < NOW() - INTERVAL '30 minutes' AND id_user = $1
        ORDER BY id_order DESC;
    `;

    const anotherOrders = `
        SELECT * FROM "order"
        WHERE date < CURRENT_DATE AND id_user = $1
        ORDER BY id_order DESC;
    `;

    let finalQuery = '';
    switch (typeDate) {
        case 'recents':
            finalQuery = recentsOrders;
            break;
        case 'today':
            finalQuery = todayOrders;
            break;
        case 'anotherorders':
            finalQuery = anotherOrders;
            break;
    }

    if (finalQuery == '') { return {success: false, error: 'typeDate no esta definido.', status: 400} };

    try {
        const result = await conex.query(finalQuery, [id_user]);

        return {
            success: true,
            data: result.rows,
            status: 200
        };
    } catch (err) {
        return { success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 };
    }
}