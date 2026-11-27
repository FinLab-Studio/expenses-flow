import { createElement } from '@/shared/lib/dom/create-element';
import type { TransactionItemOptions } from '../model/transaction-item-options.interface';
import { createCategoryIcon } from '@/entities/category/ui/category-icon/ui/category-icon';
import { CATEGORY_COLORS } from '@/entities/category/model/config/category-colors';
import { formatSignedMoney } from '@/shared/lib/money';

export function createTransactionItem({
  transaction,
  category,
  showCategoryMarker = false,
  highlightIncome = false,
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

  const categoryMarker = createElement('span', {
    classNames: `transaction-item__category-marker${
      showCategoryMarker ? ' transaction-item__category-marker--visible' : ''
    }`,
  });

  categoryMarker.style.backgroundColor = CATEGORY_COLORS[category?.color ?? 'gray'].chart;

  const categoryName = createElement('span', {
    classNames: 'transaction-item__category-name',
    textContent: category?.name ?? 'Unknown category',
  });

  const categoryElement = createElement('div', {
    classNames: 'transaction-item__category',
    children: [categoryMarker, categoryName],
  });

  const details = createElement('div', {
    classNames: 'transaction-item__details',
    children: [description, categoryElement],
  });

  const formattedAmount = formatSignedMoney(
    transaction.type === 'income' ? transaction.amount : -transaction.amount,
  );

  const amount = createElement('span', {
    classNames: `transaction-item__amount${
      highlightIncome && transaction.type === 'income' ? ' transaction-item__amount--income' : ''
    }`,
    textContent: formattedAmount,
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
