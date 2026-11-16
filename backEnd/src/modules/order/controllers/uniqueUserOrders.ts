import type { Response, Request } from "express";
import sUniqueUserOrders from "../services/sUniqueUserOrders.ts";

export async function uniqueUserOrders(req: Request, res: Response) {
    const { id_user, typeDate } = req.params;
    const id = Number(id_user);
    if (isNaN(id) || String(typeDate).trim() == '') {
        return res.status(400).json({ success: false, error: 'Se requieren los parametros id del usuario y typeDate para poder recibir la información.' });
    }

    const result = await sUniqueUserOrders(id, String(typeDate).trim().toLocaleLowerCase());
    res.status(result.status).json(result);
}