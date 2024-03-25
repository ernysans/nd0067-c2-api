import Client from '../database';

export interface OrderProduct {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

/**
 * OrderProductStore is a class with methods to access the order_products table in the database.
 */
export class OrderProductStore {
  /**
   * Get all order_products
   * @param order
   * @returns {Promise<OrderProduct[]>}
   */
  async index(order?: number): Promise<OrderProduct[]> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT * FROM order_products';
      if (order) sql += ` WHERE order_id=${order}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get order_products. Error: ${err}`);
    }
  }

  /**
   * Get a order_product by id
   * @param id
   * @returns {Promise<OrderProduct>}
   */
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

  /**
   * Create a new order_product
   * @param {OrderProduct} orderProduct
   * @returns {Promise<OrderProduct>}
   */
  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    if (!orderProduct.order_id) throw new Error('order_id is required');
    if (!orderProduct.product_id) throw new Error('product_id is required');
    if (!orderProduct.quantity) throw new Error('quantity is required');
    try {
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const values: any[] = [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0] as OrderProduct;
    } catch (err) {
      throw new Error(`Could not add new order_product. Error: ${err}`);
    }
  }

  /**
   * Delete a order_product by id
   * @param id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
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

  /**
   * Update a order_product
   * @param {OrderProduct} orderProduct
   */
  async update(orderProduct: OrderProduct): Promise<OrderProduct> {
    if (!orderProduct.id) throw new Error('id is required');
    if (!orderProduct.order_id) throw new Error('order_id is required');
    if (!orderProduct.product_id) throw new Error('product_id is required');
    if (!orderProduct.quantity) throw new Error('quantity is required');
    try {
      const sql = 'UPDATE order_products SET order_id=($1), product_id=($2), quantity=($3) WHERE id=($4) RETURNING *';
      const values: any[] = [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity, orderProduct.id];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      const item = result.rows[0] as OrderProduct;
      if (!item) throw new Error(`Could not find ${orderProduct.id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not update order_product ${orderProduct.id}. Error: ${err}`);
    }
  }
}
