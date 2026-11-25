import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import { createElement } from '@/shared/lib/dom/create-element';
import type { RenderPage } from '@/shared/types/render-page.type';
import { createPageHeader } from '@/widgets/page-header/create-page-header';

// Placeholder: the Transactions page comes in its own task.
// It already shows the pattern: header first, then await the data, then draw the rest.
export const renderTransactionsPage: RenderPage = async (container) => {
  const header = createPageHeader({
    title: 'Transactions',
    subtitle: 'History of your income and expenses',
  });

  container.append(header);

  const transactions = await transactionRepository.getAll();
  const text = createElement('p', {
    textContent: `Transactions loaded: ${transactions.length}. The list is in progress.`,
  });

  container.append(text);
};
