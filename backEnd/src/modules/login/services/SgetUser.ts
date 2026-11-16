// type
import { type userProps } from "@utils/TypeSchema.ts";
import conex from '@src/conex.ts';
import { config } from "dotenv";
config();

export default async function sGetUser(id_user: number) {
    // find the account
    try {
        const findAc = 'SELECT * FROM "user" WHERE id_user = $1';
        const dataUser = await conex.query(findAc, [id_user]);
        if (dataUser.rowCount == 0) {
            return { status: 404, error: 'No se encontro el usuario', success: false }
        }

        return { status: 200, data: dataUser.rows[0], success: true };
    } catch (err) {
        return { status: 500, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', success: false };
    }
} 