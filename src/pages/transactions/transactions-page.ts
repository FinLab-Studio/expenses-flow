import { createTransactionsPageLayout } from './ui/transactions-page-layout';
import type { RenderPage } from '@/shared/types/render-page.type';
import { getMonthParam } from './model/get-month-param';

export const renderTransactionsPage: RenderPage = async (container) => {
  const page = await createTransactionsPageLayout(getMonthParam(location.hash));

  container.append(...Array.from(page.childNodes));
};
