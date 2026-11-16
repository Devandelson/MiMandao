import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import type { Response, Request } from "express";

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

const refreshToken = (req: Request, res: Response) => {
    const refresh = checkToken(req.cookies?.refreshAuthentication);

    if (refresh.status !== 'valid') {
        return res.status(401).json({
            success: false,
            error: 'Acceso denegado, sesión expirada inicie de nuevo.',
            exToken: false
        });
    }

    const { id_user, name, role } = refresh.data;
    const newToken = jwt.sign({ id_user, name, role }, secretKey, { expiresIn: '2m' });
    return res.status(200).json({ token: newToken, success: true });
};

export default refreshToken;