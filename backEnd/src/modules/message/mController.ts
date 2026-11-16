import { type Request, type Response } from 'express';
import { MessageService } from './mServices.ts';

// utils
import extractImages from '@utils/extractorImages.ts';
import saveImages from '@utils/saveImages.ts';

export class MessageController {
  static async createMessage(req: Request, res: Response) {
    try {
      const id_order = Number(req.body.id_order);
      const id_user = Number(req.body.id_user); // better: take it from the auth token
      const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

      if (!Number.isInteger(id_order) || !Number.isInteger(id_user) || message === '') {
        return res.status(400).json({
          success: false,
          error: 'Se requiere rellenar todos los campos correctamente, por favor intente de nuevo.',
        });
      }

      // images are optional
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      const hasFiles = files.length > 0;
      const uniqueNumber = Date.now().toString();

      const images = hasFiles ? await extractImages(files, uniqueNumber) : [];

      const result = await MessageService.create(id_order, id_user, message, images);
      console.log(result);

      if (!result.success) {
        return res.status(500).json(result);
      }

      if (hasFiles) {
        await saveImages(files, uniqueNumber);
      }

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
    }
  }

  static async getAllMessages(req: Request, res: Response) {
    try {
      const { id_order } = req.params;
      const id = Number(id_order);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Se requiere verificar el id de la orden para poder recibir la información.' });
      }

      const messages = await MessageService.getAll(id);
      return res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const { id_message } = req.params;
      const id = Number(id_message);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Se requiere verificar el id del mensaje para poder eliminar la información.' });
      }
      const result = await MessageService.delete(id);
      if (result == false) {
        return res.status(404).json({ success: false, error: 'El mensaje a eliminar ya ha sido eliminado.' });
      }

      return res.status(200).json({ success: true, data: 'Se ha eliminado la información correctamente.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' });
    }
  }
}