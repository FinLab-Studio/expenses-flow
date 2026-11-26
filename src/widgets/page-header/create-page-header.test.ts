// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { settingsRepository } from '@/entities/settings/api/settings-repository';
import { createPageHeader } from './create-page-header';

// The chip gets the saved currency after Settings load: wait one macrotask.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createPageHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

  it('shows the saved currency in the chip next to the title when there are no controls and action', async () => {
    await settingsRepository.save({ currency: 'USD', currencyLocked: true });

    const header = createPageHeader({ title: 'Transactions', subtitle: 'History' });
    await tick();

    expect(header.childNodes).toHaveLength(2);
    expect(header.lastChild?.textContent).toBe('Currency: USD');
  });
});
