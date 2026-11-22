import { describe, expect, it } from 'vitest';
import { isCategory } from './category.validator';

describe('isCategory', () => {
  it('should return true for a valid category', () => {
    const category = {
      id: '1001',
      name: 'Salary',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(true);
  });

  it('should return false for null', () => {
    const category = null;

    expect(isCategory(category)).toBe(false);
  });

  it('should return false for an array', () => {
    const category = ['Salary', 'green'];

    expect(isCategory(category)).toBe(false);
  });

  it('should return false for a primitive value', () => {
    const category = 'gift';

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when id is missing', () => {
    const category = {
      name: 'Salary',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when name is missing', () => {
    const category = {
      id: '1001',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when color is missing', () => {
    const category = {
      id: '1001',
      name: 'Salary',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when icon is missing', () => {
    const category = {
      id: '1001',
      name: 'Salary',
      color: 'green',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when id is empty', () => {
    const category = {
      id: '',
      name: 'Salary',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when name is empty', () => {
    const category = {
      id: '1001',
      name: '',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when id contains only whitespace', () => {
    const category = {
      id: '   ',
      name: 'Salary',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false when name contains only whitespace', () => {
    const category = {
      id: '1001',
      name: '   ',
      color: 'green',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false for an unknown color', () => {
    const category = {
      id: '1001',
      name: 'Salary',
      color: 'black',
      icon: 'case',
    };

    expect(isCategory(category)).toBe(false);
  });

  it('should return false for an unknown icon', () => {
    const category = {
      id: '1001',
      name: 'Salary',
      color: 'green',
      icon: 'fire',
    };

    expect(isCategory(category)).toBe(false);
  });
});
