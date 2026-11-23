import type { Transaction } from '../model/transaction.interface';

interface BalanceSummary {
  openingBalance: number;
  periodChange: number;
  closingBalance: number;
}

interface BalancePeriod {
  startDate: string;
  endDate: string;
}

function getTransactionBalanceChange(transaction: Transaction): number {
  return transaction.type === 'income' ? transaction.amount : -transaction.amount;
}

export function calculateBalance(
  transactions: readonly Transaction[],
  period?: BalancePeriod,
): BalanceSummary {
  if (!period) {
    const totalBalance = transactions.reduce(
      (balance, transaction) => balance + getTransactionBalanceChange(transaction),
      0,
    );

    return {
      openingBalance: 0,
      periodChange: totalBalance,
      closingBalance: totalBalance,
    };
  }

  const { openingBalance, periodChange } = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.date < period.startDate) {
        return {
          ...accumulator,
          openingBalance: accumulator.openingBalance + getTransactionBalanceChange(transaction),
        };
      }

      if (transaction.date <= period.endDate) {
        return {
          ...accumulator,
          periodChange: accumulator.periodChange + getTransactionBalanceChange(transaction),
        };
      }

      return accumulator;
    },
    {
      openingBalance: 0,
      periodChange: 0,
    },
  );

  return {
    openingBalance,
    periodChange,
    closingBalance: openingBalance + periodChange,
  };
}
