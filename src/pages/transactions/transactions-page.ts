import { createTransactionsPage } from './ui/transactions-page';
import type { RenderPage } from '@/shared/types/render-page.type';

export const renderTransactionsPage: RenderPage = async (container) => {
  const page = await createTransactionsPage();

  container.append(...Array.from(page.childNodes));
};
