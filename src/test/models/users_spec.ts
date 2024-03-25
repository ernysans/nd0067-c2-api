import {User, UserStore} from '../../models/user';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

describe('User Model', () => {
  const store = new UserStore();
  const password = 'password123';
  let id: number = 1;
  const item: User = {
    first_name: 'Test',
    last_name: 'User',
  };
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });
  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });
  it('index method should return an empty list', async () => {
    const result = await store.index();
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      ...item, password,
    });
    id = result.id;
    expect(result).toEqual({id, ...item});
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([{
      id,
      ...item,
    }]);
  });
  it('show method should return the correct user', async () => {
    const result = await store.show(id);
    expect(result).toBeDefined();
    expect(result.first_name).toBe(item.first_name);
    expect(result.last_name).toBe(item.last_name);
  });
  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });
  it('authenticate method should return the user if password is correct', async () => {
    const result = await store.authenticate(id, password);
    expect(result).toBeDefined();
    expect(result).toEqual({
      id,
      ...item,
    });
  });
  it('authenticate method should return null if password is incorrect', async () => {
    const result = await store.authenticate(id, 'wrongpassword');
    expect(result).toBeNull();
  });
  it('update method should update the user', async () => {
    const item: User = {
      id,
      first_name: 'New First Name',
      last_name: 'New Last Name',
    };
    const result = await store.update(item);
    expect(result).toEqual(item);
  });

  it('delete method should remove the user', async () => {
    await store.delete(id);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
