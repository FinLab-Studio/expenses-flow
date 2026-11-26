import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import {
  calculateBalance,
  type BalancePeriod,
} from '@/entities/transactions/operations/calculate-balance';
import { createElement } from '@/shared/lib/dom/create-element';
import { formatMoney, formatSignedMoney } from '@/shared/lib/money';

interface BalanceSummaryOptions {
  transactions: readonly Transaction[];
  period: BalancePeriod;
}

interface BalanceSummaryComponent {
  element: HTMLElement;
  updatePeriod: (period: BalancePeriod) => void;
}

export function createBalanceSummary({
  transactions,
  period,
}: BalanceSummaryOptions): BalanceSummaryComponent {
  const incomeAmount = createElement('p', {
    classNames: 'balance-summary__amount',
  });

  const expensesAmount = createElement('p', {
    classNames: 'balance-summary__amount',
  });

  const netAmount = createElement('p', {
    classNames: 'balance-summary__amount',
  });

  const cards = [
    {
      label: 'Income',
      amount: incomeAmount,
      className: 'balance-summary__card--income',
    },
    {
      label: 'Expenses',
      amount: expensesAmount,
      className: 'balance-summary__card--expense',
    },
    {
      label: 'Net for period',
      amount: netAmount,
      className: '',
    },
  ];

  const cardElements = cards.map(({ label, amount, className }) => {
    const labelElement = createElement('p', {
      classNames: 'balance-summary__label',
      textContent: label,
    });

    return createElement('article', {
      classNames: `balance-summary__card ${className}`,
      children: [labelElement, amount],
    });
  });

  const element = createElement('section', {
    classNames: 'balance-summary',
    attributes: {
      'aria-label': 'Balance summary',
    },
    children: cardElements,
  });

  function updatePeriod(nextPeriod: BalancePeriod): void {
    const summary = calculateBalance(transactions, nextPeriod);

    incomeAmount.textContent = formatMoney(summary.periodIncome);
    expensesAmount.textContent = formatMoney(summary.periodExpenses);
    netAmount.textContent = formatSignedMoney(summary.periodChange);
  }

  updatePeriod(period);

  return {
    element,
    updatePeriod,
  };
}
