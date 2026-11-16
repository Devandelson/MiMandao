import type { Request, Response } from "express";

export default async function Logout(req: Request, res: Response) {
    return res.clearCookie('refreshAuthentication').status(200).json({
        success: true,
        data: 'Ha cerrado sesión exitosamente!.'
    });
}