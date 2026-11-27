import { createTransactionsPageLayout } from './ui/transactions-page-layout';
import type { RenderPage } from '@/shared/types/render-page.type';

export const renderTransactionsPage: RenderPage = async (container) => {
  const hashQuery = location.hash.split('?')[1] ?? '';
  const searchParams = new URLSearchParams(hashQuery);
  const month = searchParams.get('month');
  const page = await createTransactionsPageLayout(month);

  container.append(...Array.from(page.childNodes));
};
