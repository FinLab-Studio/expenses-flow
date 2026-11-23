import { fetchJson } from '@/shared/api';
import type { CategoriesDTO } from '../model/categories.dto';
import { createLocalCategoryRepository } from './local-category-repository';

// After the MVP: pick the Firebase implementation here when VITE_STORAGE === 'firebase'
export const categoryRepository = createLocalCategoryRepository(() =>
  fetchJson<CategoriesDTO>('data/categories.json'),
);
