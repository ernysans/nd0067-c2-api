import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products ORDER BY id ASC';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    if (!id) throw new Error('id is required');
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`Could not find ${id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(mw: Product): Promise<Product> {
    if (!mw.name) throw new Error('name is required');
    if (!mw.price) throw new Error('price is required');
    try {
      const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const values: any[] = [mw.name, mw.price];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new product. Error: ${err}`);
    }
  }

  async delete(id: number) {
    if (!id) throw new Error('id is required');
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async update(id: number, mw: Product): Promise<Product> {
    if (!id) throw new Error('id is required');
    if (!mw.name) throw new Error('name is required');
    if (!mw.price) throw new Error('type is required');
    try {
      const sql = 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const values: any[] = [mw.name, mw.price, id];
      const conn = await Client.connect();
      const result = await conn.query(sql, values);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`Could not find ${id}`);
      return item;
    } catch (err) {
      throw new Error(`Could not update product ${id}. Error: ${err}`);
    }
  }
}
