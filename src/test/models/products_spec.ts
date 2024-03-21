import {Product, ProductStore} from '../../models/product';

const store = new ProductStore();

describe('Product Model', () => {
  const item: Product = {
    name: 'Test Product',
    price: 1000,
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
    expect(result).toEqual([]);
  });

  it('create method should add a product', async () => {
    const result = await store.create(item);
    expect(result).toEqual({
      id: 1,
      ...item,
    });
  });
  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([{
      id: 1,
      ...item,
    }]);
  });
  it('show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      ...item,
    });
  });
  it('update method should update the product', async () => {
    const item: Product = {
      name: 'Test Product Updated',
      price: 2000,
    };
    const result = await store.update(1, item);
    expect(result).toEqual({
      id: 1,
      ...item,
    });
  });
  it('delete method should remove the product', async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
