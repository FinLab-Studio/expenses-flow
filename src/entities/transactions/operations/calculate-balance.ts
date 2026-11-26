import type { Transaction } from '../model/transaction.interface';

interface BalanceSummary {
  openingBalance: number;
  periodIncome: number;
  periodExpenses: number;
  periodChange: number;
  closingBalance: number;
}

interface BalancePeriod {
  startDate: string;
  endDate: string;
}

export function calculateBalance(
  transactions: readonly Transaction[],
  period?: BalancePeriod,
): BalanceSummary {
  const periodTransactions = period
    ? transactions.filter(
        (transaction) => transaction.date >= period.startDate && transaction.date <= period.endDate,
      )
    : transactions;

  const openingBalance = period
    ? transactions
        .filter((transaction) => transaction.date < period.startDate)
        .reduce(
          (balance, transaction) =>
            balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount),
          0,
        )
    : 0;

  const { periodIncome, periodExpenses } = periodTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'income') {
        return {
          ...accumulator,
          periodIncome: accumulator.periodIncome + transaction.amount,
        };
      }

      return {
        ...accumulator,
        periodExpenses: accumulator.periodExpenses + transaction.amount,
      };
    },
    {
      periodIncome: 0,
      periodExpenses: 0,
    },
  );

  const periodChange = periodIncome - periodExpenses;
  const closingBalance = openingBalance + periodChange;

  // if (!period) {
  //   const totalBalance = transactions.reduce(
  //     (balance, transaction) => balance + getTransactionBalanceChange(transaction),
  //     0,
  //   );

  //   return {
  //     openingBalance: 0,
  //     periodChange: totalBalance,
  //     closingBalance: totalBalance,
  //   };
  // }

  // const periodIncome = transactions
  //   .filter((transaction) => transaction.type === 'income')
  //   .reduce((total, transaction) => total + transaction.amount, 0);

  // const periodExpenses = transactions
  //   .filter((transaction) => transaction.type === 'expenses')
  //   .reduce((total, transaction) => total + transaction.amount, 0);

  // const { openingBalance, periodChange } = transactions.reduce(
  //   (accumulator, transaction) => {
  //     if (transaction.date < period.startDate) {
  //       return {
  //         ...accumulator,
  //         openingBalance: accumulator.openingBalance + getTransactionBalanceChange(transaction),
  //       };
  //     }

  //     if (transaction.date <= period.endDate) {
  //       return {
  //         ...accumulator,
  //         periodChange: accumulator.periodChange + getTransactionBalanceChange(transaction),
  //       };
  //     }

  //     return accumulator;
  //   },
  //   {
  //     openingBalance: 0,
  //     periodChange: 0,
  //   },
  // );

  return {
    openingBalance,
    periodIncome,
    periodExpenses,
    periodChange,
    closingBalance,
  };
}
