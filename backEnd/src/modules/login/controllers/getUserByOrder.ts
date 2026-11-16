import type { Response, Request } from "express";
import sGetUserByOrder from "../services/SgetUserByOrder.ts";

export default async function getUserByOrder(req: Request, res: Response) {
    const idOrder = Number(req.params.idOrder);

    if (isNaN(idOrder)) {
        return res.status(400).json({ success: false, error: 'El id de la orden no es válido.' });
    }

    const result = await sGetUserByOrder(idOrder);
    return res.status(result.status).json(result);
}