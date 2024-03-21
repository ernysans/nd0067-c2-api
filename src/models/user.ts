import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
};
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users ORDER BY id ASC';
    const result = await conn.query(sql);
    conn.release();
    let results = result.rows as User[];
    return results.map((u) => {
      delete u.password;
      return u;
    });
  }

  async show(id: string): Promise<User> {
    if (!id) throw new Error('id is required');
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    conn.release();
    let item = result.rows[0];
    if (!item) throw new Error(`user ${id} not found`);
    delete item.password;
    return item;
  }

  async create(u: User): Promise<User> {
    if (!u.password) throw new Error('password is required');
    if (!u.firstName) throw new Error('firstName is required');
    if (!u.lastName) throw new Error('lastName is required');
    const conn = await Client.connect();
    const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
    const hash = bcrypt.hashSync(
      u.password + pepper,
      parseInt(saltRounds)
    );
    const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
    let user = result.rows[0];
    conn.release();
    delete user.password;
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
    if (!u.firstName) throw new Error('firstName is required');
    if (!u.lastName) throw new Error('lastName is required');
    const conn = await Client.connect();
    const sql = 'UPDATE users SET firstName = $1, lastName = $2 WHERE id=($3) RETURNING *';
    const values: any[] = [u.firstName, u.lastName, id];
    const result = await conn.query(sql, values);
    conn.release();
    const user = result.rows[0];
    if (!user) throw new Error(`user ${id} not found`);
    delete user.password;
    return user;
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    if (!password) throw new Error('password is required');
    const conn = await Client.connect();
    const sql = 'SELECT password FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    console.log(password + pepper);
    if (result.rows.length) {
      const user = result.rows[0];
      console.log(user);
      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }
    return null
  }
}
