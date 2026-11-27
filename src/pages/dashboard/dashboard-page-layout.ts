import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import {
  calculateBalance,
  type BalancePeriod,
} from '@/entities/transactions/operations/calculate-balance';
import { createElement } from '@/shared/lib/dom/create-element';
import { createBudgetProgress } from '@/widgets/budget-progress/budget-progress';
import { MONTHLY_BUDGET } from '@/widgets/budget-progress/model/constants';
import { createDashboardSummary } from '@/widgets/dashboard-summary/ui/dashboard-summary';

interface DashboardPageLayout {
  element: HTMLElement;
  updateMonth: (month: Temporal.PlainYearMonth) => void;
}

export async function createDashboardPageLayout(
  initialMonth: Temporal.PlainYearMonth,
): Promise<DashboardPageLayout> {
  const transactions = await transactionRepository.getAll();

  function getMonthPeriod(month: Temporal.PlainYearMonth): BalancePeriod {
    return {
      startDate: month.toPlainDate({ day: 1 }).toString(),
      endDate: month.toPlainDate({ day: month.daysInMonth }).toString(),
    };
  }

  const initialPeriod = getMonthPeriod(initialMonth);

  const dashboardSummary = createDashboardSummary({
    transactions,
    period: initialPeriod,
  });

  const budgetProgress = createBudgetProgress({
    spentAmount: calculateBalance(transactions, getMonthPeriod(initialMonth)).periodExpenses,
    budgetAmount: MONTHLY_BUDGET,
  });

  const summaryRow = createElement('div', {
    classNames: 'dashboard-page__row dashboard-page__row--summary',
    children: [dashboardSummary.element, budgetProgress.element],
  });

  const element = createElement('div', {
    classNames: 'dashboard-page',
    children: [summaryRow],
  });

  function updateMonth(month: Temporal.PlainYearMonth): void {
    const period = getMonthPeriod(month);

    dashboardSummary.updatePeriod(period);
    budgetProgress.update(calculateBalance(transactions, period).periodExpenses, MONTHLY_BUDGET);
  }

  return {
    element,
    updateMonth,
  };
}
