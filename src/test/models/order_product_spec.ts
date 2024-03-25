import {OrderProduct, OrderProductStore} from '../../models/order_product';
import {User, UserStore} from "../../models/user";
import {Order, OrderStatus, OrderStore} from "../../models/order";
import {Product, ProductStore} from "../../models/product";

const store = new OrderProductStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();
describe('OrderProduct Model', () => {
  let item: OrderProduct = {
    order_id: null,
    product_id: null,
    quantity: 1,
  };
  const password = 'password123';
  let user: User = {
    first_name: 'Test',
    last_name: 'User',
    password,
  };

  beforeAll(async () => {
    /// Create User
    const result = await userStore.create(user);
    expect(user.id).toBeUndefined();
    user.id = result.id;
    /// Create Order
    const order: Order = {
      user_id: user.id,
      status: OrderStatus.Open,
    };
    const orderResult = await orderStore.create(order);
    item.order_id = orderResult.id;
    /// Create Product
    const product: Product = {
      name: 'Test Product',
      price: 1000,
    };
    const productResult = await productStore.create(product);
    item.product_id = productResult.id;
    expect(item.product_id).toBeTruthy();
    expect(item.order_id).toBeTruthy();
  });
  afterAll(async () => {
    const userStore = new UserStore();
    await userStore.delete(user.id);
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('index method should return an empty list', async () => {
    const result = await store.index();
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
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

  it('create method should add a product', async () => {
    const result = await store.create(item);
    item.id = result.id;
    expect(result).toEqual(item);
  });
  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toContain(item);
  });
  it('index method should return a list of products for a specific order', async () => {
    const result = await store.index(item.order_id);
    const filtered = result.filter((i) => i.order_id !== item.order_id);
    expect(result).toContain(item);
    expect(filtered).toEqual([]);
  });

  it('show method should return the correct order product', async () => {
    const result = await store.show(item.id);
    expect(result).toBeDefined();
    expect(result).toEqual(item);
  });

  it('update method should update the order product', async () => {
    const updatedOrderProduct: OrderProduct = {
      ...item,
      quantity: 2,
    };
    const result = await store.update(updatedOrderProduct);
    expect(result).toBeDefined();
    expect(result).toEqual(updatedOrderProduct);
  });

  it('delete method should remove the order product', async () => {
    await store.delete(item.id);
    let result = await store.index();
    // Filter by id and compare as empty array
    result = result.filter((i) => i.id === item.id);
    expect(result).toEqual([]);
  });
});
