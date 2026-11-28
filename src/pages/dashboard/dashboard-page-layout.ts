import { categoryRepository } from '@/entities/category/api/category-repository';
import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import {
  calculateBalance,
  type BalancePeriod,
} from '@/entities/transactions/operations/calculate-balance';
import { createElement } from '@/shared/lib/dom/create-element';
import { createBudgetProgress } from '@/widgets/budget-progress/budget-progress';
import { MONTHLY_BUDGET } from '@/widgets/budget-progress/model/constants';
import { createDashboardSummary } from '@/widgets/dashboard-summary/ui/dashboard-summary';
import { createExpensesByMonth } from '@/widgets/expenses-by-month/expenses-by-month';
import { createRecentTransactions } from '@/widgets/recent-transactions/recent-transactions';
import { createSpendingByCategory } from '@/widgets/spending-by-category/spending-by-category';

interface DashboardPageLayout {
  element: HTMLElement;
  updateMonth: (month: Temporal.PlainYearMonth) => void;
  destroy: () => void; // frees the charts when the user leaves the page
}

export async function createDashboardPageLayout(
  initialMonth: Temporal.PlainYearMonth,
): Promise<DashboardPageLayout> {
  const [categories, transactions] = await Promise.all([
    categoryRepository.getAll(),
    transactionRepository.getAll(),
  ]);

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

  const expensesByMonth = createExpensesByMonth({ transactions });

  const spendingByCategory = createSpendingByCategory({
    transactions,
    categories: categories.expenses,
  });

  const analyticsRow = createElement('div', {
    classNames: 'dashboard-page__row dashboard-page__row--analytics',
    children: [expensesByMonth, spendingByCategory.element],
  });

  const allCategories = [...categories.income, ...categories.expenses];

  const recentTransactions = createRecentTransactions({
    transactions,
    categories: allCategories,
    month: initialMonth,
  });

  const element = createElement('div', {
    classNames: 'dashboard-page',
    children: [summaryRow, analyticsRow, recentTransactions.element],
  });

  function updateMonth(month: Temporal.PlainYearMonth): void {
    const period = getMonthPeriod(month);

    dashboardSummary.updatePeriod(period);
    budgetProgress.update(calculateBalance(transactions, period).periodExpenses, MONTHLY_BUDGET);
    spendingByCategory.updatePeriod(period);
    recentTransactions.updateMonth(month);
  }

  return {
    element,
    updateMonth,
    destroy: () => spendingByCategory.destroy(),
  };
}
