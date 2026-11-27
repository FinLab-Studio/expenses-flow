import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import {
  calculateBalance,
  type BalancePeriod,
} from '@/entities/transactions/operations/calculate-balance';
import { createElement } from '@/shared/lib/dom/create-element';
import { MONTHLY_BUDGET } from '../budget-progress/model/constants';
import { formatMoney } from '@/shared/lib/money';

interface ExpensesByMonthOptions {
  transactions: readonly Transaction[];
}

export function createExpensesByMonth({ transactions }: ExpensesByMonthOptions): HTMLElement {
  const currentMonth = Temporal.Now.plainDateISO().toPlainYearMonth();

  const months = Array.from({ length: 6 }, (_, index) => {
    const month = currentMonth.subtract({ months: 5 - index });
    const period: BalancePeriod = {
      startDate: month.toPlainDate({ day: 1 }).toString(),
      endDate: month.toPlainDate({ day: month.daysInMonth }).toString(),
    };

    const expenses = calculateBalance(transactions, period).periodExpenses;

    return {
      label: month.toPlainDate({ day: 1 }).toLocaleString('en', {
        month: 'short',
      }),
      amount: expenses,
      isCurrent: month.equals(currentMonth),
    };
  });

  const maxExpenses = Math.max(...months.map(({ amount }) => amount));

  const chartMax = Math.max(400_000, Math.ceil(maxExpenses / 100_000) * 100_000);

  const chartStep = chartMax / 4;

  const bars = months.map(({ amount, isCurrent }) => {
    const amountElement = createElement('span', {
      classNames: 'expenses-by-month__amount',
      textContent: formatMoney(amount),
    });

    const bar = createElement('div', {
      classNames: 'expenses-by-month__bar',
    });

    const barHeight = (amount / chartMax) * 100;

    bar.style.height = `${barHeight}%`;

    const barItem = createElement('div', {
      classNames: 'expenses-by-month__bar-item',
      children: [amountElement, bar],
    });

    barItem.style.setProperty('--bar-height', `${barHeight}%`);

    if (amount > MONTHLY_BUDGET) {
      bar.classList.add('expenses-by-month__bar--over-budget');
    } else if (isCurrent) {
      bar.classList.add('expenses-by-month__bar--current');
    } else {
      bar.classList.add('expenses-by-month__bar--within-budget');
    }

    return barItem;
  });

  const budgetLine = createElement('div', {
    classNames: 'expenses-by-month__budget-line',
  });

  const budgetPosition = (MONTHLY_BUDGET / chartMax) * 100;
  budgetLine.style.bottom = `${budgetPosition}%`;

  const plotArea = createElement('div', {
    classNames: 'expenses-by-month__plot-area',
    children: [budgetLine, ...bars],
  });

  const monthsRow = createElement('div', {
    classNames: 'expenses-by-month__months',
    children: months.map(({ label, isCurrent }) =>
      createElement('span', {
        classNames: isCurrent
          ? 'expenses-by-month__month expenses-by-month__month--current'
          : 'expenses-by-month__month',
        textContent: label,
      }),
    ),
  });

  const plot = createElement('div', {
    classNames: 'expenses-by-month__plot',
    children: [plotArea, monthsRow],
  });

  plot.style.setProperty('--budget-position', `${budgetPosition}%`);

  const axisLabels = Array.from({ length: 5 }, (_, index) => {
    return formatMoney(chartStep * (4 - index));
  });

  const yAxis = createElement('div', {
    classNames: 'expenses-by-month__y-axis',
    children: axisLabels.map((label) =>
      createElement('span', {
        classNames: 'expenses-by-month__axis-label',
        textContent: label,
      }),
    ),
  });

  const chart = createElement('div', {
    classNames: 'expenses-by-month__chart',
    children: [yAxis, plot],
  });

  const legendItems = [
    {
      label: 'Within budget',
      className: 'expenses-by-month__legend-marker--within-budget',
    },
    {
      label: 'Over budget',
      className: 'expenses-by-month__legend-marker--over-budget',
    },
    {
      label: 'Current month, in progress',
      className: 'expenses-by-month__legend-marker--current',
    },
    {
      label: 'Budget',
      className: 'expenses-by-month__legend-marker--budget',
    },
  ];

  const legend = createElement('div', {
    classNames: 'expenses-by-month__legend',
    children: legendItems.map(({ label, className }) => {
      const marker = createElement('span', {
        classNames: `expenses-by-month__legend-marker ${className}`,
      });

      const text = createElement('span', {
        textContent: label,
      });

      return createElement('div', {
        classNames: 'expenses-by-month__legend-item',
        children: [marker, text],
      });
    }),
  });

  const heading = createElement('h2', {
    classNames: 'expenses-by-month__title',
    textContent: 'Expenses by Month',
  });

  const period = createElement('span', {
    classNames: 'expenses-by-month__period',
    textContent: 'Last 6 Months',
  });

  const header = createElement('div', {
    classNames: 'expenses-by-month__header',
    children: [heading, period],
  });

  return createElement('section', {
    classNames: 'expenses-by-month',
    children: [header, chart, legend],
  });
}
