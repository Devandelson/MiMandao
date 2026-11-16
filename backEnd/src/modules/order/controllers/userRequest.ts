import type { Response, Request } from "express";
import sUserRequest from "../services/sUserRequest.ts";

export async function userRequest(req: Request, res: Response) {
    const result = await sUserRequest();
    res.status(result.status).json(result);
}