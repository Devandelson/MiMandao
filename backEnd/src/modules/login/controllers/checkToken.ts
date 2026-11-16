import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import type { Response, Request } from "express";
import refreshToken from "./refreshToken.ts";

interface UserPayload extends JwtPayload {
    id_user: number;
    name: string;
    role: string;
}

const secretKey = String(process.env.secret_key);

export default function CheckToken(req: Request, res: Response) {
    const data = req.body;
    const token = String(data?.token || '');

    if (!token || token === '') {
        return res.status(401).json({ success: false, error: 'No se ha recibido el token.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as UserPayload;
        return res.status(200).json({ success: true, user: decoded });
    } catch (err) {
        if ((err as Error).name === 'TokenExpiredError') {
            return refreshToken(req, res);
        }
        
        return res.status(401).json({ success: false, error: 'Token inválido.' });
    }
}