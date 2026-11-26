import { createTransactionsPageLayout } from './ui/transactions-page-layout';
import type { RenderPage } from '@/shared/types/render-page.type';

export const renderTransactionsPage: RenderPage = async (container) => {
  const page = await createTransactionsPageLayout();

  container.append(...Array.from(page.childNodes));
};
