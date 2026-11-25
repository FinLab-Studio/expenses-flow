import { describe, expect, it } from 'vitest';
import { mapFiltersState } from './map-filters-state';
import type { TransactionFiltersState } from './transaction-filters-state.interface';

describe('mapFiltersState', () => {
  it('should return only transaction type when no filters are selected', () => {
    const state: TransactionFiltersState = {
      startDate: '',
      endDate: '',
      categoryId: null,
      type: 'all',
    };

    expect(mapFiltersState(state)).toEqual({
      type: 'all',
    });
  });

  it('should include all selected filters', () => {
    const state: TransactionFiltersState = {
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      categoryId: '1001',
      type: 'income',
    };

    expect(mapFiltersState(state)).toEqual({
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      categoryId: '1001',
      type: 'income',
    });
  });

  it('should include only selected date and type filters', () => {
    const state: TransactionFiltersState = {
      startDate: '2026-06-01',
      endDate: '',
      categoryId: null,
      type: 'expenses',
    };

    expect(mapFiltersState(state)).toEqual({
      startDate: '2026-06-01',
      type: 'expenses',
    });
  });
});
