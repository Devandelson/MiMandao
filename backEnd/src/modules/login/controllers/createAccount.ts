import type { Response, Request } from "express";

// type
import { type userProps } from "@utils/TypeSchema.ts";
import serviceCreate from "../services/createAccount.ts";

// utils
import extractImages from '@utils/extractorImages.ts';
import saveImages from '@utils/saveImages.ts';
import emptyField from "@utils/emptyField.ts";

export default async function createAccount(req: Request, res: Response) {
    try {
        const { email, name, password, type_check, phone, detail_address } = req.body as userProps;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se ha proporcionado ningún archivo'
            });
        }

        const files = req.file as Express.Multer.File;

        const emptyCheck = await emptyField([
            { value: email, type: 'string' },
            { value: name, type: 'string' },
            { value: password, type: 'string' },
            { value: type_check, type: 'string' },
            { value: phone, type: 'string' },
            { value: detail_address, type: 'string' }
        ]);

        if (!emptyCheck) {
            return res.status(400).json({ success: false, error: 'hubo alguno de los datos que no fue rellenado, intente de nuevo.' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(String(email).trim()) == false) {
            return res.status(400).json({ success: false, error: 'El correo no tiene el formato correcto, debe ser de la forma xxxxx@xxx.com' });
        }

        const uniqueNumber = Date.now().toString();
        let finalAnswerImgs: Array<string> | null = files ? await extractImages([files], uniqueNumber) : null;
        const map = finalAnswerImgs != null && finalAnswerImgs.length > 0 ? String(finalAnswerImgs[0]) : '';

        const result = await serviceCreate({ email, name, password, type_check, phone, map, detail_address });

        if (result.success == false) {
            return res.status(result.status).json(result);
        } else {
            await saveImages([files], uniqueNumber);
            return res.status(201).json(result);
        }
    } catch (error: any) {
        return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
    }
}