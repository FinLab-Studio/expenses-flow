import { describe, expect, it } from 'vitest';
import { isNonEmptyString } from './is-non-empty-string';

describe('isNonEmptyString', () => {
  it('should return true for a non-empty string', () => {
    expect(isNonEmptyString('Salary')).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isNonEmptyString('')).toBe(false);
  });

  it('should return false for a whitespace-only string', () => {
    expect(isNonEmptyString('   ')).toBe(false);
  });

  it('should return false for a non-string value', () => {
    expect(isNonEmptyString(123)).toBe(false);
  });
});
