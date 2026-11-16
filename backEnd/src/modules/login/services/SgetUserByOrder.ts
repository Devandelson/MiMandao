// type
import conex from '@src/conex.ts';
import { config } from "dotenv";
config();

export default async function sGetUserByOrder(idOrder: number) {
    // find the account
    try {
        const findAc = `
            SELECT u.* FROM "order" AS o 
            INNER JOIN "user" AS u ON u.id_user = o.id_user
            WHERE o.id_order = $1 AND u.role <> 'admin'
        `;
        const dataUser = await conex.query(findAc, [idOrder]);
        if (dataUser.rowCount == 0) {
            return { status: 404, error: 'No se encontro el usuario', success: false }
        }

        return { status: 200, data: dataUser.rows[0], success: true };
    } catch (err) {
        console.log(err);
        return { status: 500, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', success: false };
    }
} 