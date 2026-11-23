import type { CategoriesDTO } from '../model/categories.dto';
import type { Category } from '../model/category.interface';
import { isCategory } from './category.validator';

function isCategoryArray(value: unknown): value is Category[] {
  return Array.isArray(value) && value.every((item) => isCategory(item));
}

export function isCategoriesDTO(value: unknown): value is CategoriesDTO {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'income' in value &&
    isCategoryArray(value.income) &&
    'expenses' in value &&
    isCategoryArray(value.expenses)
  );
}
