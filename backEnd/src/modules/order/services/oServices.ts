import conex from '@src/conex.ts';

// types
import { type orderProps } from '@utils/TypeSchema.ts';

export class OrderServices {
  static async create({ id_user, order, total }: orderProps) {
    const query = `INSERT INTO "order"
    (id_user, "order", "date", total, process_state) VALUES($1, $2::jsonb, NOW(), $3, $4) RETURNING id_order`;

    const result = await conex.query(query, [id_user, JSON.stringify(order), total, 'preparando']);
    return result.rows[0];
  }

  static async getOrder(id_order: number) {
    const query = `SELECT * 
        FROM "order" AS o 
        INNER JOIN message AS m ON m.id_order = o.id_order 
        WHERE o.id_order = $1`;
    const result = await conex.query(query, [id_order]);
    return result.rows;
  }

  static async getUserOrders(id_user: number) {
    const query = `
      SELECT DISTINCT ON (o.id_order) o.*, m.* 
      FROM "order" AS o 
      INNER JOIN message AS m ON m.id_order = o.id_order 
      WHERE o.id_user = $1 
      ORDER BY o.id_order, m.date DESC;
    `;

    const result = await conex.query(query, [id_user]);
    return result.rows;
  }

  static async getUserOrdersLimit(id_user: number) {
    const query = `
      SELECT DISTINCT ON (o.id_order) o.*, m.* 
      FROM "order" AS o 
      INNER JOIN message AS m ON m.id_order = o.id_order 
      WHERE o.id_user = $1 
      ORDER BY o.id_order, m.date DESC LIMIT 12;
    `;

    const result = await conex.query(query, [id_user]);
    return result.rows;
  }

  static async delete(id_order: number) {
    const found = await conex.query(`SELECT * FROM "order" WHERE id_order = $1`, [id_order]);
    if (found.rows.length === 0) {
      return false;
    }

    const query = `DELETE FROM "order" WHERE id_order = $1`;
    const result = await conex.query(query, [id_order]);
    return result;
  }

  static async updateStateOrder(id_order: number, process_state: string) {
    const query = `UPDATE "order" SET process_state = $1 WHERE id_order = $2`;
    const result = await conex.query(query, [process_state, id_order]);
    return result;
  }
}