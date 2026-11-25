// MVP routes. The first one opens for an empty or unknown hash: About is the start page.

import { renderAboutPage } from '@/pages/about/about-page';
import { ABOUT_PAGE, DASHBOARD_PAGE, TRANSACTIONS_PAGE } from './path-names';
import type { Route } from './router/router';
import type { NavLink } from './shell/create-shell';
import { renderDashboardPage } from '@/pages/dashboard/dashboard-page';
import { renderTransactionsPage } from '@/pages/transactions/transactions-page';

// Icons: the sidebar icons from the design, viewBox 0 0 24 24.
export const routes: (Route & NavLink)[] = [
  {
    path: ABOUT_PAGE,
    title: 'About',
    icon: '<circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />',
    render: renderAboutPage,
  },
  {
    path: DASHBOARD_PAGE,
    title: 'Dashboard',
    icon: '<rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />',
    render: renderDashboardPage,
  },
  {
    path: TRANSACTIONS_PAGE,
    title: 'Transactions',
    icon: '<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />',
    render: renderTransactionsPage,
  },
];
