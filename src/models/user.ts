import Client from '../database';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  password?: string;
}


// SALT_ROUNDS is the number of rounds to use to generate the salt
const saltRounds = process.env.SALT_ROUNDS;
// BCRYPT_PASSWORD is a pepper to add to the password before hashing
const pepper = process.env.BCRYPT_PASSWORD;

/**
 * UserStore is a class with methods to access the users table in the database.
 */
export class UserStore {
  /**
   * Index method
   *
   */
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, first_name, last_name FROM users ORDER BY id ASC';
      const result = await conn.query(sql);
      conn.release();
      return result.rows as User[];
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  /**
   * Show a user by id
   * @param id
   * @returns User
   */
  async show(id: number): Promise<User> {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      let item = result.rows[0];
      if (!item) throw new Error(`user ${id} not found`);
      return item;
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  /**
   * Create a new user
   * @param {User} u
   * @returns User
   */
  async create(u: User): Promise<User> {
    if (!u.password) throw new Error('password is required');
    if (!u.first_name) throw new Error('first_name is required');
    if (!u.last_name) throw new Error('last_name is required');
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING id, first_name, last_name';
      const hash = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds)
      );
      const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
      const user = result.rows[0];
      conn.release();
      if (!user) throw new Error('user not created');
      return user;
    } catch (err) {
      throw new Error(`Could not add new user. Error: ${err}`);
    }
  }

  /**
   * Delete a user by id
   * @param {number} id
   * @returns void
   */
  async delete(id: number): Promise<void> {
    if (!id) throw new Error('id is required');
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1)';
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  /**
   * Update a user
   * @param {User} u
   * @returns {Promise<User>}
   */
  async update(u: User): Promise<User> {
    if (!u.id) throw new Error('id is required');
    if (!u.first_name) throw new Error('first_name is required');
    if (!u.last_name) throw new Error('last_name is required');
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE users SET first_name = $1, last_name = $2 WHERE id=($3) RETURNING id, first_name, last_name';
      const values: any[] = [u.first_name, u.last_name, u.id];
      const result = await conn.query(sql, values);
      conn.release();
      const user = result.rows[0] as User;
      if (!user) throw new Error(`user ${u.id} not found`);
      return user;
    } catch (e) {
      throw new Error(`Could not update user ${u.id}. Error: ${e}`);
    }
  }

  /**
   * Authenticate a user
   * @param {number} id
   * @param {string} password
   * @returns {Promise<User | null>}
   */
  async authenticate(id: number, password: string): Promise<User | null> {
    if (!password) throw new Error('password is required');
    const conn = await Client.connect();
    const sql = 'SELECT id, first_name, last_name, password FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    if (!result.rows.length) throw new Error(`user ${id} not found`);
    let user = result.rows[0];
    if (bcrypt.compareSync(password + pepper, user.password)) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  }
}
