import type { Response, Request } from "express";

// type
import { type userProps } from "@utils/TypeSchema.ts";

import sGetUser from "../services/SgetUser.ts";

export default async function getUser(req: Request, res: Response) {
    const id_user = Number(req.params.id_user);

    if (isNaN(id_user)) {
        return res.status(400).json({ success: false, error: 'El id del usuario no es válido.' });
    }

    const result = await sGetUser(id_user);
    return res.status(result.status).json(result);
}