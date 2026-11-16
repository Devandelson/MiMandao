import { type NextFunction, type Request, type Response } from 'express';
import { serviceCategory } from './serviceCategory.ts';

export class controllerCategory {
    // ----------- Create
    public static async createC(name: string) {
        const result = await serviceCategory.create({ name });
        return result;
    }

    // ----------- Read all (optional ?category=xxx)
    static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await serviceCategory.getAll();
            return res.status(200).json({ success: true, data: categories });
        } catch (_) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Read one (like a middleware to check in the proccess of create or update a product)
    static async getC(req: Request, res: Response, next: NextFunction) {
        try {
            const { category } = req.body;

            if (String(category).toLocaleLowerCase().trim() == '') {
                return res.status(400).json({ success: false, error: 'No se ha establecido una categoria.' });
            }


            const result = await serviceCategory.getOne(String(category));
            if (result == 0) {
                const operationResult = await controllerCategory.createC(String(category));
                if (!operationResult) {
                    return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
                }
            }

            return next();
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Delete (even thought like a spring middleware when all the products are delete about that category)
    static async deleteC(name: string) {
        try {
            const result = await serviceCategory.delete(name);
            if (result == false) {
                return ({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 });
            }

            return ({ success: true, data: `Se ha eliminado la categoria ("${name}") tras eliminar el ultimo producto de la misma.`, status: 200 });
        } catch (_) {
            return ({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.', status: 500 });
        }
    }
}