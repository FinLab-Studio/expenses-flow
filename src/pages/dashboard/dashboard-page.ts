import type { RenderPage } from '@/shared/types/render-page.type';
import { createPageHeader } from '@/widgets/page-header';
import { createDashboardPageLayout } from './dashboard-page-layout';
import { createMonthSwitcher } from '@/features/switch-month/ui/month-switcher';

export const renderDashboardPage: RenderPage = async (container) => {
  const currentMonth = Temporal.Now.plainDateISO().toPlainYearMonth();

  const layout = await createDashboardPageLayout(currentMonth);

  const monthSwitcher = createMonthSwitcher(currentMonth, (month) => {
    layout.updateMonth(month);
  });
  const header = createPageHeader({
    title: 'Dashboard',
    subtitle: 'Your month at a glance',
    controls: monthSwitcher,
  });

  container.append(header, layout.element);

  // The router calls it when the user leaves the Dashboard: the Chart.js chart is freed
  return () => layout.destroy();
};
