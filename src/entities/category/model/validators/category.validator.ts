import type { Category } from '../category.interface';
import { CATEGORY_COLORS, type CategoryColor } from '../config/category-colors';
import { CATEGORY_ICONS, type CategoryIcon } from '../config/category-icons';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCategoryColor(value: unknown): value is CategoryColor {
  return typeof value === 'string' && Object.hasOwn(CATEGORY_COLORS, value);
}

function isCategoryIcon(value: unknown): value is CategoryIcon {
  return typeof value === 'string' && Object.hasOwn(CATEGORY_ICONS, value);
}

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'id' in value &&
    isNonEmptyString(value.id) &&
    'name' in value &&
    isNonEmptyString(value.name) &&
    'color' in value &&
    isCategoryColor(value.color) &&
    'icon' in value &&
    isCategoryIcon(value.icon)
  );
}
