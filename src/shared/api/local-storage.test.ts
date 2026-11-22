// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readJson, writeJson } from './local-storage';

describe('readJson', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when the key is absent', () => {
    expect(readJson('finlab.test')).toBeNull();
  });

  it('returns the parsed value', () => {
    localStorage.setItem('finlab.test', '[{"id":"1"}]');

    expect(readJson('finlab.test')).toEqual([{ id: '1' }]);
  });

  it('returns null when the value is corrupted', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('finlab.test', '[{"id":');

    expect(readJson('finlab.test')).toBeNull();
  });
});

describe('writeJson', () => {
  it('saves the value as JSON', () => {
    writeJson('finlab.test', [{ id: '1' }]);

    expect(localStorage.getItem('finlab.test')).toBe('[{"id":"1"}]');
  });
});
