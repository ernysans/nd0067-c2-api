import Client from '../database';

export enum OrderStatus {
  Open = 'open',
  Complete = 'complete',
}

export interface Order {
  id?: number;
  user_id: number;
  status: OrderStatus;
}

/**
 * OrderStore is a class with methods to access the orders table in the database.
 */
export class OrderStore {
  /**
   * Get all orders
   * @returns Order[]
   */
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  /**
   * Get an order by id
   * @param id
   * @returns Order
   */
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

  /**
   * Create a new order
   * @param order
   * @returns Order
   */
  async create(order: Order): Promise<Order> {
    if (!order.user_id) throw new Error('user_id is required');
    if (!order.status) throw new Error('status is required');
    try {
      const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const values: any[] = [order.status, order.user_id];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0] as Order;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  /**
   * Delete an order by id
   * @param id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
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

  /**
   * Update an order
   * @param order
   * @returns Order
   */
  async update(order: Order): Promise<Order> {
    if (!order.id) throw new Error('id is required');
    if (!order.user_id) throw new Error('user_id is required');
    if (!order.status) throw new Error('status is required');
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET user_id = $1, status = $2 WHERE id = $3 RETURNING *';
      const values: any[] = [order.user_id, order.status, order.id];
      const result = await conn.query(sql, values);
      conn.release();
      const item = result.rows[0] as Order;
      if (!item) throw new Error(`Could not find ${order.id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not update order ${order.id}. Error: ${err}`);
    }
  }
}
