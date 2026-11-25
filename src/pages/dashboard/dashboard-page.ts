import type { RenderPage } from '@/shared/types/render-page.type';
import { createPageHeader } from '@/widgets/page-header/create-page-header';

// Placeholder: the Dashboard comes in its own task.
export const renderDashboardPage: RenderPage = (container) => {
  const header = createPageHeader({ title: 'Dashboard', subtitle: 'Your month at a glance' });

  container.append(header);
};
