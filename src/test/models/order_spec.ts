import {Order, OrderStatus, OrderStore} from '../../models/order';
import {User, UserStore} from "../../models/user";

const store = new OrderStore();
describe('Order Model', () => {
  let item: Order = {
    user_id: null,
    status: OrderStatus.Active,
  };
  beforeAll(async () => {
    const userStore = new UserStore();
    const password = 'password123';
    const user: User = {
      first_name: 'Test',
      last_name: 'User',
      password,
    };
    const result = await userStore.create(user);
    item.user_id = result.id;
  });
  afterAll(async () => {
    const userStore = new UserStore();
    await userStore.delete(item.user_id);
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have an update method', () => {
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
  it('create method should add an order', async () => {
    const result = await store.create(item);
    item.id = result.id;
    expect(result).toEqual(item);
  });
  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([item]);
  });

  it('show method should return the correct order', async () => {
    const result = await store.show(1);
    expect(result).toBeDefined();
    expect(result).toEqual(item);
  });

  it('update method should update the order', async () => {
    const updatedOrder: Order = {
      ...item,
      status: OrderStatus.Complete,
    };
    const result = await store.update(updatedOrder);
    expect(result).toBeDefined();
    expect(result).toEqual(updatedOrder);
  });

  it('delete method should remove the order', async () => {
    await store.delete(item.id);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
