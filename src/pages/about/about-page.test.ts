// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { renderAboutPage } from './about-page';

describe('renderAboutPage', () => {
  it('renders one h1 and the hero links to the dashboard and transactions', async () => {
    const container = document.createElement('div');

    await renderAboutPage(container);

    const headings = [...container.querySelectorAll('h1')].map((h1) => h1.textContent);
    const links = [...container.querySelectorAll('.hero a')].map((a) => a.getAttribute('href'));

    expect(headings).toEqual(['Your money, clear at a glance']);
    expect(links).toEqual(['#/dashboard', '#/transactions']);
  });
});
