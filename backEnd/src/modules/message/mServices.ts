import conex from '../../conex.ts';
import fs from 'fs/promises';
import path from 'path';

export class MessageService {
  static async create(id_order: number, id_user: number, message: string, images?: Array<string>) {
    const query = `INSERT INTO message (id_order, id_user, message, date, images) VALUES ($1, $2, $3, NOW(), $4::varchar[])`;
    try {
      await conex.query(query, [id_order, id_user, message, images]);
      return { success: true, data: 'Se ha enviado el mensaje correctamente.' };
    } catch (err) {
      return { success: false, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' };
    }
  }

  static async getAll(id_order: number) {
    const query = `SELECT * FROM message WHERE id_order = $1`;
    const result = await conex.query(query, [id_order]);
    return result.rows;
  }

  static async delete(id_message: number) {
    const queryImages = `SELECT * FROM message WHERE id_message = $1`;
    const resultImg = await conex.query(queryImages, [id_message]);
    const rowsImg = resultImg.rows;

    if (rowsImg.length === 0) {
      return false;
    }

    const images = rowsImg[0].images as Array<string>;

    const query = `DELETE FROM message WHERE id_message = $1`;
    const result = await conex.query(query, [id_message]);

    if (images && images.length > 0) {
      const deletePromises = images.map(async (img) => {
        const filePath = path.join(process.cwd(), '/src/images/', img);
        try {
          await fs.unlink(filePath);
        } catch (err: any) {
          if (err.code !== 'ENOENT') {
            console.error(`No se pudo eliminar la imagen ${img}:`, err.message);
          }
        }
      });

      await Promise.all(deletePromises);
    }

    return result;
  }
}