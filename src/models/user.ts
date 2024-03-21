import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  password?: string;
};
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await Client.connect();
    const sql = 'SELECT id, first_name, last_name FROM users ORDER BY id ASC';
    const result = await conn.query(sql);
    conn.release();
    return result.rows as User[];
  }

  async show(id: number): Promise<User> {
    if (!id) throw new Error('id is required');
    const conn = await Client.connect();
    const sql = 'SELECT id, first_name, last_name FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    conn.release();
    let item = result.rows[0];
    if (!item) throw new Error(`user ${id} not found`);
    return item;
  }

  async create(u: User): Promise<User> {
    if (!u.password) throw new Error('password is required');
    if (!u.first_name) throw new Error('first_name is required');
    if (!u.last_name) throw new Error('last_name is required');
    const conn = await Client.connect();
    const sql = 'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING id, first_name, last_name';
    const hash = bcrypt.hashSync(
      u.password + pepper,
      parseInt(saltRounds)
    );
    const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
    let user = result.rows[0];
    conn.release();
    if (!user) throw new Error('user not created');
    return user;
  }

  async delete(id: number) {
    if (!id) throw new Error('id is required');
    const conn = await Client.connect();
    const sql = 'DELETE FROM users WHERE id=($1)';
    await conn.query(sql, [id]);
    conn.release();
  }

  async update(id: number, u: User): Promise<User> {
    if (!id) throw new Error('id is required');
    if (!u.first_name) throw new Error('first_name is required');
    if (!u.last_name) throw new Error('last_name is required');
    const conn = await Client.connect();
    const sql = 'UPDATE users SET first_name = $1, last_name = $2 WHERE id=($3) RETURNING id, first_name, last_name';
    const values: any[] = [u.first_name, u.last_name, id];
    const result = await conn.query(sql, values);
    conn.release();
    const user = result.rows[0] as User;
    if (!user) throw new Error(`user ${id} not found`);
    return user;
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    if (!password) throw new Error('password is required');
    const conn = await Client.connect();
    const sql = 'SELECT id, first_name, last_name, password FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    if (result.rows.length) {
      let user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password)) {
        delete user.password;
        return user;
      }
    }
    return null
  }
}
