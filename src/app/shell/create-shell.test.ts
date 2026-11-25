// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { ABOUT_PAGE, DASHBOARD_PAGE } from '../path-names';
import { createShell } from './create-shell';

describe('createShell', () => {
  it('marks only the link of the active route as the current page', () => {
    const shell = createShell([
      { path: ABOUT_PAGE, title: 'About', icon: '' },
      { path: DASHBOARD_PAGE, title: 'Dashboard', icon: '' },
    ]);

    shell.setActiveRoute(ABOUT_PAGE);
    shell.setActiveRoute(DASHBOARD_PAGE);

    const current = shell.element.querySelectorAll('[aria-current="page"]');
    expect([...current].map((link) => link.textContent)).toEqual(['Dashboard']);
  });
});
