// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLocalCollection } from './local-collection';

interface Item {
  id: string;
  name: string;
}

const KEY = 'finlab.test-items';

function setup(stored?: Item[]) {
  if (stored) {
    localStorage.setItem(KEY, JSON.stringify(stored));
  }

  const loadInitial = vi.fn().mockResolvedValue([{ id: '1', name: 'Demo' }]);

  return { collection: createLocalCollection<Item>(KEY, loadInitial), loadInitial };
}

describe('createLocalCollection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads and saves initial items on the first read', async () => {
    const { collection } = setup();

    await expect(collection.getAll()).resolves.toEqual([{ id: '1', name: 'Demo' }]);
    expect(JSON.parse(localStorage.getItem(KEY) ?? '')).toEqual([{ id: '1', name: 'Demo' }]);
  });

  it('returns saved items without loading initial ones', async () => {
    const { collection, loadInitial } = setup([]);

    await expect(collection.getAll()).resolves.toEqual([]);
    expect(loadInitial).not.toHaveBeenCalled();
  });

  it('adds an item with a new id and returns it', async () => {
    const { collection } = setup([]);

    const created = await collection.add({ name: 'Coffee' });

    expect(created).toEqual({ id: expect.any(String), name: 'Coffee' });
    await expect(collection.getAll()).resolves.toEqual([created]);
  });

  it('replaces the item with the same id', async () => {
    const { collection } = setup([{ id: '1', name: 'Coffee' }]);

    await collection.update({ id: '1', name: 'Tea' });

    await expect(collection.getAll()).resolves.toEqual([{ id: '1', name: 'Tea' }]);
  });

  it('removes the item by id', async () => {
    const { collection } = setup([{ id: '1', name: 'Coffee' }]);

    await collection.remove('1');

    await expect(collection.getAll()).resolves.toEqual([]);
  });
});
