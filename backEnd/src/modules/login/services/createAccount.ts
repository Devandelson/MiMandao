// type
import { type userProps } from "@utils/TypeSchema.ts";
import conex from '@src/conex.ts';

import bcrypt from 'bcrypt';

export default async function serviceCreate(body: Omit<userProps, 'state_account'>) {
    // check if the account exist
    const checkQuery = 'SELECT * FROM "user" WHERE LOWER(email) = $1';
    const resultCheck = await conex.query(checkQuery, [body.email.toLocaleLowerCase()]);

    if (resultCheck.rowCount == null) {
        return { success: false, error: 'Ya existe una cuenta similar, recupere su cuenta.', status: 409 }
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    const createQuery = 'INSERT INTO "user" ("name", email, "map", detail_address, phone, "role", state_account, type_check, password) VALUES($1, $2, $3, $4, $5, $6, true, $7, $8)';
    try {
        await conex.query(createQuery, [body.name, body.email, body.map, body.detail_address, body.phone, 'user', body.type_check, hashPassword]);

        return { success: true, data: 'Se creo la cuenta correctamente.', status: 201 }
    } catch (err) {
        return { success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 }
    }
}