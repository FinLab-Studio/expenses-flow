import { describe, beforeEach, vi, afterEach, it, expect } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a function', () => {
    const callback = vi.fn<(query: string) => void>();
    const debounced = debounce(callback, 500);

    expect(typeof debounced).toBe('function');
  });

  it('should not be called immediately or before the time expires', () => {
    const callback = vi.fn<(query: string) => void>();
    const debounced = debounce(callback, 400);

    debounced('Cinema City');

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(399);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the function after the specified delay', () => {
    const callback = vi.fn<(query: string) => void>();
    const debounced = debounce(callback, 400);

    debounced('Cinema City');

    vi.advanceTimersByTime(400);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('Cinema City');
  });

  it('should cancel the previous timer when called again', () => {
    const callback = vi.fn<(query: string) => void>();
    const debounced = debounce(callback, 500);

    debounced('Cinema City');

    vi.advanceTimersByTime(200);

    debounced('Salary');

    vi.advanceTimersByTime(200);

    debounced('Rent');

    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('Rent');
  });

  it('should execute the last call with its arguments', () => {
    const callback = vi.fn<(query: string) => void>();
    const debounced = debounce(callback, 500);

    debounced('Pharmacy');
    debounced('Biedronka');
    debounced('Uber');

    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('Uber');
  });
});
