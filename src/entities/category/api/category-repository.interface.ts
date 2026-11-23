import type { TransactionType } from '@/shared/types/transaction-type.type';
import type { CategoriesDTO } from '../model/categories.dto';
import type { Category } from '../model/category.interface';

export interface CategoryRepository {
  getAll(): Promise<CategoriesDTO>;
  add(type: TransactionType, draft: Omit<Category, 'id'>): Promise<Category>;
  update(type: TransactionType, category: Category): Promise<void>;
  remove(type: TransactionType, id: string): Promise<void>;
}
