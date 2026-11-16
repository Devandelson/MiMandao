import { type Request, type Response } from 'express';
import { ProductServices } from './pServices.ts';

// utils
import extractImages from '@utils/extractorImages.ts';
import saveImages from '@utils/saveImages.ts';

// type
import { type productProps } from '@utils/TypeSchema.ts'

export class ProductController {
    // ----------- Create
    static async createProduct(req: Request, res: Response) {
        try {
            const dataBody = req.body as productProps;
            const { name, category } = dataBody;
            const stock = Number(dataBody.stock);
            const price = Number(dataBody.price);

            if (!name || !String(name).trim() || !category || !String(category).trim() || isNaN(stock) || isNaN(price)) {
                return res.status(400).json({ success: false, error: 'Se requiere rellenar todos los campos correctamente, por favor intente de nuevo.' });
            }

            if (stock < 0 || price < 0) {
                return res.status(400).json({ success: false, error: 'El stock y el precio no pueden ser negativos.' });
            }

            const files = (req.files as Express.Multer.File[]) || [];
            if (files.length < 1) {
                return res.status(400).json({ success: false, error: 'No se ha subido la imagen del producto.' });
            }

            const uniqueNumber = Date.now().toString();

            const getImages: Array<string> = await extractImages(files, uniqueNumber);
            const images = String(getImages[0]);

            const result = await ProductServices.create({
                name: String(name).trim().toLocaleLowerCase(),
                stock, price,
                category: String(category).trim().toLocaleLowerCase(),
                images
            });

            if (files.length > 0 && result) {
                await saveImages(files, uniqueNumber);
            }

            if (!result) {
                return res.status(409).json({ success: false, error: 'Ya existe un producto similar.' });
            }

            return res.status(201).json({ success: true, data: 'Se ha creado el producto correctamente.' });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Read all (optional ?category=xxx)
    static async getAllProducts(req: Request, res: Response) {
        try {
            const { category } = req.body;
            if (String(category).trim() == '') {
                return res.status(400).json({ success: false, error: 'Se requiere la categoria, por favor intente de nuevo.' });
            }

            const products = await ProductServices.getAll(category);      
            return res.status(200).json({ success: true, data: products });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Read products (by name of product)
    static async getProduct(req: Request, res: Response) {
        try {
            const name = String(req.params.name);
            if (name.trim() == '') {
                return res.status(400).json({ success: false, error: 'Se requiere que por lo menos digitar el nombre del producto para poder recibir la información.' });
            }

            const product = await ProductServices.getOne(name);
            if (!product) {
                return res.status(404).json({ success: false, error: 'No se encontraron productos disponibles.' });
            }

            return res.status(200).json({ success: true, data: product });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Read product (by id)
    static async getOneProduct(req: Request, res: Response) {
        try {
            const id = Number(req.params.id_product);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id del producto para poder recibir la información.' });
            }

            const product = await ProductServices.getOneP(id);
            if (product.rowCount == 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No se encontraron productos disponibles.'
                });
            }

            return res.status(200).json({ success: true, data: product.rows[0] });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Update
    static async updateProduct(req: Request, res: Response) {
        try {
            const { name, category, id_product, stock, price } = req.body;

            if (isNaN(id_product) || (isNaN(Number(stock)) || Number(stock) < 0) || (isNaN(Number(price)) || Number(price) < 0) || name === '' && category === '') {
                return res.status(400).json({ success: false, error: 'Se requiere que los campos tengan la información requerida correctamente, por favor intente de nuevo.' });
            }

            const files = (req.files as Express.Multer.File[]) ?? [];

            const uniqueNumber = Date.now().toString();
            const getImages: Array<string> = files.length > 0 ? await extractImages(files, uniqueNumber) : [];
            const images = String(getImages[0] ?? '');   

            // --------- updating the data
            const result = await ProductServices.update({
                id_product,
                name: String(name).trim().toLocaleLowerCase(),
                category: String(category).trim().toLocaleLowerCase(),
                stock, price,
                images: images
            });

            if (result == false) {
                return res.status(404).json({ success: false, error: 'El producto no existe.' });
            }

            if (files.length > 0) {
                await saveImages(files, uniqueNumber);
            }

            return res.status(200).json({ success: true, data: 'Se ha actualizado el producto correctamente.' });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    // ----------- Delete
    static async deleteProduct(req: Request, res: Response) {
        try {
            const id = Number(req.params.id_product);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id del producto para poder eliminar la información.' });
            }

            const result = await ProductServices.delete(id);
            return res.status(result?.status ?? 500).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }
}