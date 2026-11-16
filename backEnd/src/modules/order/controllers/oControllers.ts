import { type Request, type Response } from 'express';
import { OrderServices } from '../services/oServices.ts';

// types
import { type orderProps } from '@utils/TypeSchema.ts';

export class OrderController {
    static async createMessage(req: Request, res: Response) {
        try {
            const { id_user, order, total } = req.body as orderProps;

            if (typeof id_user !== 'number' || typeof total !== 'number') {
                return res.status(400).json({ success: false, error: 'Se requiere rellenar todos los campos correctamente, por favor intente de nuevo.' });
            }


            if (
                !Array.isArray(order) || order.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    error: 'El formato de la orden no es el correcto, por favor intente de nuevo.',
                });
            }

            const result = await OrderServices.create({ id_user, order, total });

            return res.status(201).json({ success: true, data: 'Se registró el pedido correctamente, ya estamos trabajando en ello.', idOrder: result.id_order });
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    static async getOrder(req: Request, res: Response) {
        try {
            const { id_order } = req.params;
            const id = Number(id_order);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id de la orden para poder recibir la información.' });
            }

            const order = await OrderServices.getOrder(id);
            if (!order) {
                return res.status(404).json({ success: false, error: 'La orden no existe.' });
            }

            return res.status(200).json({ success: true, data: order });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    static async getUserOrder(req: Request, res: Response) {
        try {
            const { id_user } = req.params;
            const id = Number(id_user);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id del usuario para poder recibir la información.' });
            }

            const order = await OrderServices.getUserOrders(id);
            if (!order) {
                return res.status(404).json({ success: false, error: 'La orden no existe.' });
            }

            return res.status(200).json({ success: true, data: order });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    static async getUserOrderLimit(req: Request, res: Response) {
        try {
            const { id_user } = req.params;
            const id = Number(id_user);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id del usuario para poder recibir la información.' });
            }

            const order = await OrderServices.getUserOrdersLimit(id);
            if (!order) {
                return res.status(404).json({ success: false, error: 'La orden no existe.' });
            }

            return res.status(200).json({ success: true, data: order });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    static async deleteOrder(req: Request, res: Response) {
        try {
            const { id_order } = req.params;
            const id = Number(id_order);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, error: 'Se requiere verificar el id de la orden para poder eliminar la información.' });
            }

            const result = await OrderServices.delete(id);
            if (result == false) {
                return res.status(404).json({ success: false, error: 'Ya se ha eliminado la orden a eliminar.' });
            }

            return res.status(200).json({ success: true, data: 'Se ha eliminado la orden correctamente.' });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }

    static async updateStateOrder(req: Request, res: Response) {
        try {
            const { id_order, process_state } = req.body;

            if (isNaN(Number(id_order)) || String(process_state) == '') {
                return res.status(400).json({ success: false, error: 'Se requiere rellenar todos los campos correctamente, por favor intente de nuevo.' });
            }

            await OrderServices.updateStateOrder(Number(id_order), String(process_state));
            return res.status(200).json({ success: true, data: `Se ha actualizado el estado de la orden a ${process_state}.` });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
        }
    }
}