import type { BudgetStatus } from '@/shared/types/budget-status.type';
import { BUDGET_WARNING_THRESHOLD } from '@/widgets/budget-progress/model/constants';

/**
 * Monthly budget status (decided 23.11): below 80% — 'ok', from 80% to 100% inclusive —
 * 'warning', above 100% — 'exceeded'. Both amounts are integer cents.
 * Compared without division: whole numbers, no rounding and no problem with a zero limit.
 */
export function checkBudget(spent: number, limit: number): BudgetStatus {
  if (spent > limit) {
    return 'exceeded';
  }

  // spent / limit >= 80%  ⇔  spent * 100 >= limit * 80
  if (spent * 100 >= limit * BUDGET_WARNING_THRESHOLD) {
    return 'warning';
  }

  return 'ok';
}
