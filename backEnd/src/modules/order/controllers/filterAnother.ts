import type { Response, Request } from "express";
import filterAnother from "../services/sFilterAnother.ts";

export default async function cfilterAnother(req: Request, res: Response) {
    const {start, limit} = req.body;
    if (String(start).trim() == '' || String(limit).trim() == '') {
        return res.status(400).json({success: false, error: 'Faltan los parametros para recibir la info'});
    }
    
    const result = await filterAnother(String(start), String(limit));
    res.status(result.status).json(result);
}