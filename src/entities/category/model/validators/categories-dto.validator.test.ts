import { describe, expect, it } from 'vitest';
import { isCategoriesDTO } from './categories-dto.validator';

describe('isCategoriesDto', () => {
  it('should return true for a valid categories DTO', () => {
    const categories = {
      income: [
        {
          id: '1001',
          name: 'Salary',
          color: 'green',
          icon: 'case',
        },
      ],
      expenses: [
        {
          id: '1005',
          name: 'Housing',
          color: 'indigo',
          icon: 'home',
        },
      ],
    };

    expect(isCategoriesDTO(categories)).toBe(true);
  });

  it('should return false if value is null', () => {
    const categories = null;

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false if value is an array', () => {
    const categories = ['income'];

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false if value is a primitive', () => {
    const categories = 'income';

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return true when both arrays are empty', () => {
    const categories = {
      income: [],
      expenses: [],
    };

    expect(isCategoriesDTO(categories)).toBe(true);
  });

  it('should return false when income is missing', () => {
    const categories = {
      expenses: [],
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false when expenses missing', () => {
    const categories = {
      income: [],
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false when income is invalid', () => {
    const categories = {
      income: 'Salary',
      expenses: [],
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false when expenses invalid', () => {
    const categories = {
      income: [],
      expenses: 'Health',
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false when income contains an invalid category', () => {
    const categories = {
      income: [
        {
          id: '1001',
          name: '   ',
          color: 'green',
          icon: 'case',
        },
      ],
      expenses: [],
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });

  it('should return false when expenses contains an invalid category', () => {
    const categories = {
      income: [],
      expenses: [
        {
          id: '1005',
          name: '    ',
          color: 'indigo',
          icon: 'home',
        },
      ],
    };

    expect(isCategoriesDTO(categories)).toBe(false);
  });
});
