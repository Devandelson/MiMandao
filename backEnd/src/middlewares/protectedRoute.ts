import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import type { Response, Request, NextFunction } from "express";

interface UserPayload extends JwtPayload {
    id_user: number;
    name: string;
    role: string;
}

const protectedAdminRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ success: false, protectedRoute: false, error: 'Token no proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        const secretKey = process.env.secret_key as string;

        const data = jwt.verify(token, secretKey) as UserPayload;

        if (!data.role || data.role.toLowerCase().trim() !== 'admin') {
            return res.status(403).json({ success: false, protectedRoute: false, error: 'No tienes autorización de administrador' });
        }
        return next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ success: false, protectedRoute: false, error: 'Token inválido o expirado' });
    }
};

export default protectedAdminRoute;