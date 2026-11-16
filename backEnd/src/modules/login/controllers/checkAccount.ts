import type { Response, Request } from "express";
import serviceCheckAc from "../services/checkAc.ts";
import jwt from 'jsonwebtoken';

import emptyField from "@src/utils/emptyField.ts";

export default async function checkAccount(req: Request, res: Response) {
    try {
        const { email, password } = req.body ?? {};
        const checkingFields = await emptyField(
            [{ value: email, type: 'string' }, { value: password, type: 'string' }]);

        if (checkingFields == false) {
            return res.status(400).json({ success: false, error: 'hubo alguno de los datos que no fue rellenado, intente de nuevo.' });
        }

        const result = await serviceCheckAc(email, password);
        if (result.success == false) {
            return res.status(result.status).json(result);
        }

        const dataUser = result.data;
        const statusInfo = dataUser?.map !== '' ? true : false;
        const token = jwt.sign({
            id_user: dataUser?.id_user,
            name: dataUser?.name,
            role: dataUser?.role
        }, String(process.env.secret_key), {
            'expiresIn': '1d'
        });

        const refreshToken = jwt.sign({
            id_user: dataUser?.id_user,
            name: dataUser?.name,
            role: dataUser?.role
        }, String(process.env.secret_key), {
            'expiresIn': '5d'
        });

        return res.cookie('refreshAuthentication', refreshToken, {
            httpOnly: true,
            sameSite: true,
        }).status(200).json({
            success: true,
            id_user: dataUser?.id_user,
            name: dataUser?.name,
            role: dataUser?.role,
            token: token,
            statusInfo: statusInfo
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
    }
} 