import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import type { Response, Request, NextFunction } from "express";

interface UserPayload extends JwtPayload {
    id_user: number;
    name: string;
    role: string;
}

type TokenState =
    | { status: 'valid'; data: UserPayload }
    | { status: 'expired' }
    | { status: 'invalid' };

const secretKey = String(process.env.secret_key);

function checkToken(token?: string): TokenState {
    if (!token) return { status: 'invalid' };

    try {
        const data = jwt.verify(token, secretKey) as UserPayload;
        return { status: 'valid', data };
    } catch (err) {
        if ((err as Error).name === 'TokenExpiredError') return { status: 'expired' };
        return { status: 'invalid' };
    }
}

const sessionProfile = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'No se ha recibido el token.' });
    }

    const access = checkToken(token);

    if (access.status === 'expired') {
        return res.status(401)
            .json({ success: false, error: 'Token expirado.', exToken: false });
    }
    return next()
};

export default sessionProfile;