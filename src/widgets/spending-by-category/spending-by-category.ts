import type { Category } from '@/entities/category/model/category.interface';
import { CATEGORY_COLORS } from '@/entities/category/model/config/category-colors';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import type { BalancePeriod } from '@/entities/transactions/operations/calculate-balance';
import { filterTransactions } from '@/entities/transactions/operations/filter-transactions';
import { createElement } from '@/shared/lib/dom/create-element';
import { formatMoney } from '@/shared/lib/money';
import Chart from 'chart.js/auto';

interface SpendingByCategoryOptions {
  transactions: readonly Transaction[];
  categories: readonly Category[];
}

interface SpendingByCategoryComponent {
  element: HTMLElement;
  updatePeriod: (period: BalancePeriod) => void;
}

export function createSpendingByCategory({
  transactions,
  categories,
}: SpendingByCategoryOptions): SpendingByCategoryComponent {
  const title = createElement('h2', {
    classNames: 'spending-by-category__title',
    textContent: 'Spending by category',
  });

  const periodLabel = createElement('span', {
    classNames: 'spending-by-category__period',
  });

  const header = createElement('div', {
    classNames: 'spending-by-category__header',
    children: [title, periodLabel],
  });

  const canvas = document.createElement('canvas');

  const totalAmount = createElement('span', {
    classNames: 'spending-by-category__total',
  });

  const totalCaption = createElement('span', {
    classNames: 'spending-by-category__total-caption',
  });

  const chartCenter = createElement('div', {
    classNames: 'spending-by-category__chart-center',
    children: [totalAmount, totalCaption],
  });

  const chartContainer = createElement('div', {
    classNames: 'spending-by-category__chart-container',
    children: [canvas, chartCenter],
  });

  const legend = createElement('div', {
    classNames: 'spending-by-category__legend',
  });

  const element = createElement('section', {
    classNames: 'spending-by-category',
    children: [header, chartContainer, legend],
  });

  let chart: Chart<'doughnut'> | null = null;

  function updatePeriod(period: BalancePeriod): void {
    const periodExpenses = filterTransactions(
      transactions,
      {
        categoryId: null,
        type: 'expenses',
        startDate: period.startDate,
        endDate: period.endDate,
      },
      period.endDate,
    );

    const expensesByCategory = categories.map((category) => {
      const amount = periodExpenses
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        id: category.id,
        name: category.name,
        amount,
        color: CATEGORY_COLORS[category.color].chart,
      };
    });

    const chartData = expensesByCategory.filter(({ amount }) => amount > 0);

    if (chart === null) {
      chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: chartData.map(({ name }) => name),
          datasets: [
            {
              data: chartData.map(({ amount }) => amount),
              backgroundColor: chartData.map(({ color }) => color),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    } else {
      chart.data.labels = chartData.map(({ name }) => name);
      chart.data.datasets[0].data = chartData.map(({ amount }) => amount);
      chart.data.datasets[0].backgroundColor = chartData.map(({ color }) => color);

      chart.update();
    }

    const totalExpenses = chartData.reduce((total, category) => total + category.amount, 0);

    const monthName = Temporal.PlainDate.from(period.startDate).toLocaleString('en', {
      month: 'long',
    });

    periodLabel.textContent = monthName;
    totalAmount.textContent = formatMoney(totalExpenses);
    totalCaption.textContent = `spent in ${monthName}`;

    const legendItems = chartData.map((category) => {
      const marker = createElement('span', {
        classNames: 'spending-by-category__legend-marker',
      });
      marker.style.backgroundColor = category.color;

      const name = createElement('span', {
        classNames: 'spending-by-category__legend-name',
        textContent: category.name,
      });

      const amount = createElement('span', {
        classNames: 'spending-by-category__legend-amount',
        textContent: formatMoney(category.amount),
      });

      const percentage = createElement('span', {
        classNames: 'spending-by-category__legend-percentage',
        textContent: `${((category.amount / totalExpenses) * 100).toFixed(1)}%`,
      });

      return createElement('div', {
        classNames: 'spending-by-category__legend-item',
        children: [marker, name, amount, percentage],
      });
    });

    legend.replaceChildren(...legendItems);
  }

  updatePeriod({
    startDate: Temporal.Now.plainDateISO().toPlainYearMonth().toPlainDate({ day: 1 }).toString(),
    endDate: Temporal.Now.plainDateISO().toString(),
  });

  return {
    element,
    updatePeriod,
  };
}
