import { createElement } from '@/shared/lib/dom/create-element';
import type { TransactionItemOptions } from '../model/transaction-item-options.interface';
import { createCategoryIcon } from '@/shared/components/category-icon/ui/category-icon';
import { CATEGORY_COLORS } from '@/entities/category/model/config/category-colors';

export function createTransactionItem({
  transaction,
  category,
}: TransactionItemOptions): HTMLLIElement {
  const date = createElement('time', {
    classNames: 'transaction-item__date',
    textContent: transaction.date,
    attributes: {
      dateTime: transaction.date,
    },
  });

  const categoryColors = CATEGORY_COLORS[category?.color ?? 'gray'];

  const iconWrapper = createElement('div', {
    classNames: 'transaction-item__icon-wrapper',
    children: [
      category
        ? createCategoryIcon({
            icon: category.icon,
            classNames: 'transaction-item__icon',
          })
        : createElement('span', {
            classNames: 'transaction-item__icon-fallback',
            textContent: '?',
            attributes: {
              'aria-hidden': 'true',
            },
          }),
    ],
  });

  iconWrapper.style.setProperty('--category-icon-color', categoryColors.icon);
  iconWrapper.style.setProperty('--category-icon-tint', categoryColors.tint);

  const description = createElement('span', {
    classNames: 'transaction-item__description',
    textContent: transaction.description?.trim() || 'Other',
  });

  const categoryName = createElement('span', {
    classNames: 'transaction-item__category',
    textContent: category?.name ?? 'Unknown category',
  });

  const details = createElement('div', {
    classNames: 'transaction-item__details',
    children: [description, categoryName],
  });

  const sign = transaction.type === 'income' ? '+' : '-';
  const formattedAmount = (transaction.amount / 100).toFixed(2);

  const amount = createElement('span', {
    classNames: 'transaction-item__amount',
    textContent: `${sign}  ${formattedAmount}`,
  });

  const content = createElement('div', {
    classNames: 'transaction-item__content',
    children: [iconWrapper, details, amount],
  });

  return createElement('li', {
    classNames: 'transaction-item',
    children: [date, content],
  });
}
