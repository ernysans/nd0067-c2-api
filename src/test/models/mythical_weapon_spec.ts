import {MythicalWeapon, MythicalWeaponStore} from '../../models/mythical_weapon';

const store = new MythicalWeaponStore();

describe('Mythical Weapon Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.index).toBeDefined();
  });
  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    const item: MythicalWeapon = {
      name: 'Excalibur',
      type: 'Sword',
      weight: 100,
    };
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
      name: 'Excalibur',
      type: 'Sword',
      weight: 100,
    }]);
  });
  it('show method should return the correct product', async () => {
    const result = await store.show("1");
    expect(result).toEqual({
      id: 1,
      name: 'Excalibur',
      type: 'Sword',
      weight: 100,
    });
  });
  // delete
  it('delete method should remove the product', async () => {
    await store.delete("1");
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
