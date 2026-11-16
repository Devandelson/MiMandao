import conex from '../../conex.ts';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
config();
// types
import { type productProps } from '@utils/TypeSchema.ts';

import { controllerCategory } from '../category/controllerCategory.ts';

// Deletes image files from disk (ignores files that no longer exist).
async function deleteImageFiles(images?: Array<string> | null) {
  if (!images || images.length === 0) return;

  await Promise.all(
    images.map(async (img) => {
      try {
        const pathImg = path.join(process.cwd() + '/src/images/' + img);
        await fs.unlink(pathImg);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`No se pudo eliminar la imagen ${img}:`, err.message);
        }
      }
    })
  );
}

export class ProductServices {
  // ----------- Create
  static async create({ name, stock, price, category, images }: Omit<productProps, 'id_product' | 'date'>) {
    // firts check if exist that product
    const checkProduct = 'SELECT * FROM products WHERE LOWER(name) = $1';
    const resultCheck = await conex.query(checkProduct, [name]);
    if (resultCheck?.rowCount ?? 0 > 0) {
      return false;
    }
    const finalName = process.env.urlImg && process.env.urlImg + images;

    const query = `INSERT INTO products (name, stock, "date", price, category, images)
      VALUES ($1, $2, NOW(), $3, $4, $5)
      RETURNING id_product;`;
    await conex.query(query, [name, stock, price, category, finalName]);

    return true;
  }

  // ----------- Read all (optionally filtered by category)
  static async getAll(category: string) {
    const query = `SELECT * FROM products WHERE LOWER(category) = $1 ORDER BY date DESC`;
    const result = await conex.query(query, [category.toLocaleLowerCase()]);
    return result.rows;
  }

  // ----------- Read one
  static async getOne(name: string) {
    const query = `SELECT * FROM products WHERE LOWER(name) ILIKE $1`;

    const result = await conex.query(query, [`${name.toLocaleLowerCase().trim()}%`]);
    return result.rows;
  }

  // ----------- Read one by id
  static async getOneP(id_product: number) {
    const query = `SELECT * FROM products WHERE id_product = $1`;

    const result = await conex.query(query, [id_product]);
    return result;
  }

  // ----------- Update (only the fields that are sent are modified)
  static async update({ id_product, name, category, stock, price, images }: Omit<productProps, 'date'>) {
    // check if exist the product.
    const current = await conex.query(`SELECT images FROM products WHERE id_product = $1`, [id_product]);
    if (current.rowCount == 0) {
      return false;
    }

    const oldImages = current.rows[0].images as string;
    const oldName = oldImages.split(`${process.env.urlImg}`)[1].slice(14);
    const originalNameImg = images?.slice(14) ?? '';

    const conditionFile = (images == '') || (originalNameImg == oldName) ? false : true;
    const finalImages = !conditionFile ? oldImages : (process.env.urlImg ?? '') + images;

    const query = `UPDATE products SET
        name     = $1,
        stock    = $2,
        price    = $3,
        category = $4,
        images   = $5,
        date = NOW()
      WHERE id_product = $6`;

    const result = await conex.query(query, [
      name,
      stock,
      price,
      category,
      finalImages,
      id_product
    ]);

    // New images were saved in the DB, so the old ones are no longer needed.
    if (conditionFile) {
      try {
        await deleteImageFiles([oldImages.split(`${process.env.urlImg}`)[1]]);
      } catch (e) {
        console.error('No se pudo borrar la imagen anterior:', e);
      }
    }

    return result;
  }

  // ----------- Delete (also removes the image files)
  static async delete(id_product: number) {
    const found = await conex.query(`SELECT * FROM products WHERE id_product = $1`, [id_product]);
    if (found.rowCount == 0) {
      return { success: false, status: 404, error: 'No se encuentra el producto' };
    }

    const data = found.rows[0];
    const images = data.images as string;
    const category = data.category;

    try {
      await conex.query(`DELETE FROM products WHERE id_product = $1`, [id_product]);
    } catch (_) {
      return { success: false, status: 500, error: 'Ups, no pudimos cargar los datos. Toca para reintentar.' };
    }

    const urlImg = String(process.env.urlImg) ?? '';
    await deleteImageFiles([images.split(urlImg)[1]]);

    // check if the category keep existing.
    const checkCategory = await conex.query(
        `SELECT * FROM products WHERE LOWER(category) = $1`, 
        [String(category).toLocaleLowerCase().trim()]
    );
    
    if (checkCategory.rowCount == 0) {
      return await controllerCategory.deleteC(category);
    }

    return { success: true, data: 'Se ha eliminado el producto', status: 200 };
  }
}