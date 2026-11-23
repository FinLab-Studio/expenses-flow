import { createLocalCollection } from '@/shared/api';
import type { CategoriesDTO } from '../model/categories.dto';
import type { Category } from '../model/category.interface';
import type { CategoryRepository } from './category-repository.interface';

export function createLocalCategoryRepository(
  loadDefaults: () => Promise<CategoriesDTO>,
): CategoryRepository {
  const lists = {
    income: createLocalCollection<Category>(
      'finlab.categories.income',
      async () => (await loadDefaults()).income,
    ),
    expenses: createLocalCollection<Category>(
      'finlab.categories.expenses',
      async () => (await loadDefaults()).expenses,
    ),
  };

  return {
    async getAll() {
      const [income, expenses] = await Promise.all([
        lists.income.getAll(),
        lists.expenses.getAll(),
      ]);
      return { income, expenses };
    },
    add: (type, draft) => lists[type].add(draft),
    update: (type, category) => lists[type].update(category),
    remove: (type, id) => lists[type].remove(id),
  };
}
