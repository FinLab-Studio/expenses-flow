export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  add(draft: Omit<T, 'id'>): Promise<T>;
  update(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}
