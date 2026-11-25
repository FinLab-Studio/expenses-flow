// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { createPageHeader } from './create-page-header';

describe('createPageHeader', () => {
  it('renders the title, subtitle and the parts in the order controls · currency chip · action', () => {
    const controls = document.createElement('div');
    const action = document.createElement('button');

    const header = createPageHeader({
      title: 'Dashboard',
      subtitle: 'November 2026',
      controls,
      action,
    });

    expect(header.querySelector('h1')?.textContent).toBe('Dashboard');
    expect(header.querySelector('p')?.textContent).toBe('November 2026');
    expect([...header.children].slice(1)).toEqual([
      controls,
      header.querySelector('.currency-chip'),
      action,
    ]);
  });

  it('renders only the currency chip next to the title when there are no controls and action', () => {
    const header = createPageHeader({ title: 'Transactions', subtitle: 'History' });

    expect(header.childNodes).toHaveLength(2);
    expect(header.lastChild?.textContent).toBe('Currency: EUR');
  });
});
