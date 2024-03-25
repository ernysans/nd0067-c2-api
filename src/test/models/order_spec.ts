import {Order, OrderStatus, OrderStore} from '../../models/order';
import {User, UserStore} from "../../models/user";

const store = new OrderStore();
const userStore = new UserStore();
describe('Order Model', () => {
  let item: Order = {
    id: null,
    user_id: null,
    status: OrderStatus.Open,
  };
  const password = 'password123';
  let user: User = {
    first_name: 'Test',
    last_name: 'User',
    password,
  };
  beforeAll(async () => {
    const result = await userStore.create(user);
    user.id = result.id;
    item.user_id = result.id;
  });
  afterAll(async () => {
    const userStore = new UserStore();
    await userStore.delete(user.id);
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
    expect(result).toContain(item);
  });

  it('show method should return the correct order', async () => {
    const result = await store.show(item.id);
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
    let result = await store.index();
    // Filter by id and compare as empty array
    result = result.filter((i) => i.id === item.id);
    expect(result).toEqual([]);
  });
});
