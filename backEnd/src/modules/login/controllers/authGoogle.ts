import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv'
config();
import type { Request, Response } from 'express';
const client = new OAuth2Client(process.env.CLIENT_ID);
import serviceCheckAc from "../services/checkAc.ts";
import jwt from 'jsonwebtoken';

export default async function authGoogle(req: Request, res: Response) {
    try {
        const { credentials } = req.body;

        if (!credentials) {
            return res.status(400).json({ success: false, error: 'No se han recibido las credenciales de Google.' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credentials,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ success: false, error: 'No se pudo validar la cuenta de Google.' });
        }
        // variables
        const { name, email } = payload;
        const initPassword = String(process.env.initP);
        const endtPassword = String(process.env.endP);
        const password = initPassword + name + email + endtPassword;

        const result = await serviceCheckAc(String(email), password);
        if (result.success == false) {
            return res.status(404).json({
                success: false,
                error: 'No existe una cuenta con este correo, debes registrarte.',
                email: String(email),
                password: password,
                name: String(name),
                type_check: 'google'
            });
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
        return res.status(401).json({ success: false, error: 'Token de Google inválido.' });
    }
}