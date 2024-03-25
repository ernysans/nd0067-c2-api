export enum OrderStatus {
  Open = 'open',
  Complete = 'complete',
}

export type Order = {
  id?: number;
  user_id: number;
  status: OrderStatus;
}

import Client from '../database';

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`Could not find ${id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    if (!o.user_id) throw new Error('user_id is required');
    if (!o.status) throw new Error('status is required');
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const values: any[] = [o.user_id, o.status];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0] as Order;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async delete(id: number) {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM orders WHERE id=($1)';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async update(o: Order): Promise<Order> {
    if (!o.id) throw new Error('id is required');
    if (!o.user_id) throw new Error('user_id is required');
    if (!o.status) throw new Error('status is required');
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET user_id = $1, status = $2 WHERE id = $3 RETURNING *';
      const values: any[] = [o.user_id, o.status, o.id];
      const result = await conn.query(sql, values);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`Could not find ${o.id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not update order ${o.id}. Error: ${err}`);
    }
  }
}
