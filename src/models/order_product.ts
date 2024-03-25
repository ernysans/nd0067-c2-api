export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

import Client from '../database';

export class OrderProductStore {
  async index(): Promise<OrderProduct[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM order_products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get order_products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<OrderProduct> {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM order_products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`Could not find ${id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not find order_product ${id}. Error: ${err}`);
    }
  }

  async create(o: OrderProduct): Promise<OrderProduct> {
    if (!o.order_id) throw new Error('order_id is required');
    if (!o.product_id) throw new Error('product_id is required');
    if (!o.quantity) throw new Error('quantity is required');
    try {
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const values: any[] = [o.order_id, o.product_id, o.quantity];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0] as OrderProduct;
    } catch (err) {
      throw new Error(`Could not add new order_product. Error: ${err}`);
    }
  }

  async delete(id: number) {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM order_products WHERE id=($1)';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete order_product ${id}. Error: ${err}`);
    }
  }

  async update(o: OrderProduct): Promise<OrderProduct> {
    if (!o.id) throw new Error('id is required');
    if (!o.order_id) throw new Error('order_id is required');
    if (!o.product_id) throw new Error('product_id is required');
    if (!o.quantity) throw new Error('quantity is required');
    try {
      const sql = 'UPDATE order_products SET order_id=($1), product_id=($2), quantity=($3) WHERE id=($4) RETURNING *';
      const values: any[] = [o.order_id, o.product_id, o.quantity, o.id];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      const item = result.rows[0] as OrderProduct;
      if (!item) throw new Error(`Could not find ${o.id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not update order_product ${o.id}. Error: ${err}`);
    }
  }
}
