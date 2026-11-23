import { readJson, writeJson } from './local-storage';
import type { Repository } from './repository.interface';

export function createLocalCollection<T extends { id: string }>(
  key: string,
  loadInitial: () => Promise<T[]>,
): Repository<T> {
  async function read(): Promise<T[]> {
    const stored = readJson<T[]>(key);

    if (stored !== null) {
      return stored;
    }

    const initial = await loadInitial();
    writeJson(key, initial);

    return initial;
  }

  return {
    getAll: read,

    async add(draft) {
      // Omit<T, 'id'> + id is T, but TypeScript can't prove it for a generic T
      const item = { ...draft, id: crypto.randomUUID() } as T;
      const items = await read();
      writeJson(key, [...items, item]);

      return item;
    },

    async update(item) {
      const items = await read();
      const updated = items.map((current) => (current.id === item.id ? item : current));
      writeJson(key, updated);
    },

    async remove(id) {
      const items = await read();
      const rest = items.filter((current) => current.id !== id);
      writeJson(key, rest);
    },
  };
}
