import type { CategoryColor } from './config/category-colors';
import type { CategoryIcon } from './config/category-icons';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  icon: CategoryIcon;
}
