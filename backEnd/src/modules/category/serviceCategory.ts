import conex from '../../conex.ts';

// types
import { type category_productProps } from '@utils/TypeSchema.ts';

export class serviceCategory {
    // ----------- Create
    static async create({ name }: Omit<category_productProps, 'id_category'>) {
        try {
            const query = `INSERT INTO category_product (name) VALUES ($1)`;
            await conex.query(query, [String(name).toLocaleLowerCase().trim()]);
            return true;
        } catch (_) {
            return false;
        }
    }

    // ----------- Read all (optionally filtered by category)
    static async getAll() {
        const query = `SELECT * FROM category_product`;
        const result = await conex.query(query);
        return result.rows;
    }

    // ----------- Read one
    static async getOne(category: string) {
        const query = `SELECT * FROM category_product WHERE LOWER("name") = $1`;
        const result = await conex.query(query, [category.toLocaleLowerCase().trim()]);
        return result.rowCount;
    }

    // ----------- Delete (also removes the image files)
    static async delete(name: string) {
        try {
            await conex.query(`DELETE FROM category_product WHERE LOWER("name") = $1`, 
                [name.toLocaleLowerCase().trim()]);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}