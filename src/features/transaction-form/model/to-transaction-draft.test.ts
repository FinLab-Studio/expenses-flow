import { describe, expect, it } from 'vitest';
import type { TransactionFormValues } from './transaction-form-values.interface';
import { toTransactionDraft } from './to-transaction-draft';

const VALUES: TransactionFormValues = {
  type: 'income',
  amount: '12,5',
  categoryId: '1001',
  date: '2026-11-01',
  description: '  Salary  ',
};

describe('toTransactionDraft', () => {
  it('converts the amount to cents and keeps the type, category, date and trimmed description', () => {
    expect(toTransactionDraft(VALUES)).toEqual({
      type: 'income',
      amount: 1250,
      categoryId: '1001',
      date: '2026-11-01',
      description: 'Salary',
    });
  });

  it('leaves out an empty description', () => {
    expect(toTransactionDraft({ ...VALUES, description: '   ' })).not.toHaveProperty('description');
  });
});
