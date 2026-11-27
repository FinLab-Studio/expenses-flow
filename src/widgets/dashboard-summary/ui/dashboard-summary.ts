import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import {
  calculateBalance,
  type BalancePeriod,
} from '@/entities/transactions/operations/calculate-balance';
import { createElement } from '@/shared/lib/dom/create-element';
import { formatMoney, formatSignedMoney } from '@/shared/lib/money';

interface DashboardSummaryOptions {
  transactions: readonly Transaction[];
  period: BalancePeriod;
}

interface DashboardSummaryComponent {
  element: HTMLElement;
  updatePeriod: (period: BalancePeriod) => void;
}

export function createDashboardSummary({
  transactions,
  period,
}: DashboardSummaryOptions): DashboardSummaryComponent {
  const balanceAmount = createElement('p', {
    classNames: 'dashboard-summary__amount',
  });

  const incomeAmount = createElement('p', {
    classNames: 'dashboard-summary__amount',
  });

  const expensesAmount = createElement('p', {
    classNames: 'dashboard-summary__amount',
  });

  const balanceDescription = createElement('p', {
    classNames: 'dashboard-summary__description',
    textContent: 'All income minus all expenses',
  });

  const incomeDescription = createElement('p', {
    classNames: 'dashboard-summary__description',
    textContent: 'Salary, freelance, etc.',
  });

  const expensesDescription = createElement('p', {
    classNames: 'dashboard-summary__description',
  });

  const cards = [
    {
      label: 'Balance',
      amount: balanceAmount,
      description: balanceDescription,
      className: '',
    },
    {
      label: 'Income',
      amount: incomeAmount,
      description: incomeDescription,
      className: 'dashboard-summary__card--income',
    },
    {
      label: 'Expenses',
      amount: expensesAmount,
      description: expensesDescription,
      className: 'dashboard-summary__card--expense',
    },
  ];

  const cardElements = cards.map(({ label, amount, description, className }) => {
    const labelElement = createElement('p', {
      classNames: 'dashboard-summary__label',
      textContent: label,
    });

    return createElement('article', {
      classNames: `dashboard-summary__card ${className}`,
      children: [labelElement, amount, description],
    });
  });

  const element = createElement('section', {
    classNames: 'dashboard-summary',
    attributes: {
      'aria-label': 'Dashboard summary',
    },
    children: cardElements,
  });

  function updatePeriod(nextPeriod: BalancePeriod): void {
    const summary = calculateBalance(transactions, nextPeriod);

    const currentMonth = Temporal.PlainDate.from(nextPeriod.startDate).toPlainYearMonth();

    const previousMonth = currentMonth.subtract({ months: 1 });

    const previousPeriod: BalancePeriod = {
      startDate: previousMonth.toPlainDate({ day: 1 }).toString(),
      endDate: previousMonth.toPlainDate({ day: previousMonth.daysInMonth }).toString(),
    };

    const previousExpenses = calculateBalance(transactions, previousPeriod).periodExpenses;

    balanceAmount.textContent = formatMoney(summary.closingBalance);
    incomeAmount.textContent = formatSignedMoney(summary.periodIncome);
    expensesAmount.textContent = formatSignedMoney(-summary.periodExpenses);

    const previousMonthName = previousMonth
      .toPlainDate({ day: 1 })
      .toLocaleString('en', { month: 'long' });

    if (previousExpenses === 0) {
      expensesDescription.textContent = `No expenses in ${previousMonthName}`;
      expensesDescription.className = 'dashboard-summary__description';
    } else {
      const difference = ((summary.periodExpenses - previousExpenses) / previousExpenses) * 100;

      const percentage = new Intl.NumberFormat('en', {
        maximumFractionDigits: 1,
      }).format(Math.abs(difference));

      if (difference < 0) {
        expensesDescription.textContent = `${percentage}% less than ${previousMonthName}`;
        expensesDescription.className =
          'dashboard-summary__description dashboard-summary__description--positive';
      } else if (difference > 0) {
        expensesDescription.textContent = `${percentage}% more than ${previousMonthName}`;
        expensesDescription.className =
          'dashboard-summary__description dashboard-summary__description--negative';
      } else {
        expensesDescription.textContent = `Same as ${previousMonthName}`;
        expensesDescription.className = 'dashboard-summary__description';
      }
    }
  }

  updatePeriod(period);

  return {
    element,
    updatePeriod,
  };
}
