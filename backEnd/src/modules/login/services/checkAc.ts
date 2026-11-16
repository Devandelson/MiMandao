// type
import { type userProps } from "@utils/TypeSchema.ts";
import conex from '@src/conex.ts';
import { config } from "dotenv";
config();

import bcrypt from 'bcrypt';

export default async function serviceCheckAc(email: string, password: string) {
    // find the account
    const findAc = 'SELECT * FROM "user" WHERE LOWER(email) = $1';
    const resultFind = await conex.query(findAc, [email]);
    if (resultFind.rowCount == 0) {
        return { success: false, error: 'Los datos de autentificación no son correctos.', status: 401 }
    };

    const dataAccount = resultFind.rows[0] as userProps;
    const comparePassword = await bcrypt.compare(password, dataAccount.password);
    // checking the password
    if (comparePassword) {
        return { success: true, data: dataAccount, status: 200 }
    } else {
        return { success: false, error: 'Los datos de autentificación no son correctos.', status: 401 }
    }
} 