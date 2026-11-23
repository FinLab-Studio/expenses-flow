// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import type { CategoriesDTO } from '../model/categories.dto';
import { createLocalCategoryRepository } from './local-category-repository';

const DEFAULTS: CategoriesDTO = {
  income: [{ id: '1001', name: 'Salary', color: 'green', icon: 'case' }],
  expenses: [{ id: '1011', name: 'Other', color: 'gray', icon: 'dots' }],
};

function setup() {
  return createLocalCategoryRepository(() => Promise.resolve(DEFAULTS));
}

describe('createLocalCategoryRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns income and expenses categories', async () => {
    await expect(setup().getAll()).resolves.toEqual(DEFAULTS);
  });

  it('adds a category to the list of its type', async () => {
    const repository = setup();

    const created = await repository.add('expenses', { name: 'Pets', color: 'teal', icon: 'dots' });

    const { expenses } = await repository.getAll();
    expect(expenses).toEqual([...DEFAULTS.expenses, created]);
  });

  it('updates a category in the list of its type', async () => {
    const repository = setup();

    await repository.update('income', { id: '1001', name: 'Wage', color: 'green', icon: 'case' });

    const { income } = await repository.getAll();
    expect(income).toEqual([{ id: '1001', name: 'Wage', color: 'green', icon: 'case' }]);
  });

  it('removes a category from the list of its type', async () => {
    const repository = setup();

    await repository.remove('income', '1001');

    const { income } = await repository.getAll();
    expect(income).toEqual([]);
  });
});
