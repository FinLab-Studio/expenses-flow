import { categoryRepository } from '@/entities/category/api/category-repository';
import { settingsRepository } from '@/entities/settings/api/settings-repository';
import { transactionRepository } from '@/entities/transactions/api/transaction-repository';
import type { Transaction } from '@/entities/transactions/model/transaction.interface';
import { createElement } from '@/shared/lib/dom/create-element';
import { formatMoney } from '@/shared/lib/money';
import { toTransactionDraft } from '../model/to-transaction-draft';
import type { TransactionFormValues } from '../model/transaction-form-values.interface';
import { validateTransaction } from '../model/validate-transaction';
import { createTransactionFields } from './create-transaction-fields';

export interface TransactionModalOptions {
  transaction?: Transaction; // edit this transaction; without it the modal adds a new one
  onSaved: () => void; // called after saving: the page reads the transactions again
}

const TITLE_ID = 'transaction-modal-title';

const CLOSE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>`;

// "New transaction" / "Edit transaction": a native <dialog> opened with showModal().
// The browser keeps focus inside, makes the page behind inert, closes the dialog on Escape
// and returns focus to the button that opened it. A new dialog is made for every opening,
// so there is no state to reset.
export async function openTransactionModal({
  transaction,
  onSaved,
}: TransactionModalOptions): Promise<void> {
  const [categories, settings] = await Promise.all([
    categoryRepository.getAll(),
    settingsRepository.get(),
  ]);

  const fields = createTransactionFields({
    values: getInitialValues(transaction),
    categories,
    currency: settings.currency,
  });

  const closeButton = createElement('button', {
    classNames: 'icon-button',
    attributes: { type: 'button', 'aria-label': 'Close' },
  });
  closeButton.innerHTML = CLOSE_ICON; // static markup

  const cancelButton = createElement('button', {
    classNames: 'button button--secondary',
    textContent: 'Cancel',
    attributes: { type: 'button' },
  });

  const saveButton = createElement('button', {
    classNames: 'button button--primary',
    textContent: transaction ? 'Save changes' : 'Save',
    attributes: { type: 'submit' }, // Enter in a text field submits too
  });

  const form = createElement('form', {
    classNames: 'modal__form',
    children: [
      createElement('header', {
        classNames: 'modal__header',
        children: [
          createElement('h2', {
            classNames: 'modal__title',
            textContent: transaction ? 'Edit transaction' : 'New transaction',
            attributes: { id: TITLE_ID },
          }),
          closeButton,
        ],
      }),
      createElement('div', { classNames: 'modal__body', children: [fields.element] }),
      createElement('footer', {
        classNames: 'modal__footer',
        children: [cancelButton, saveButton],
      }),
    ],
  });

  const dialog = createElement('dialog', {
    classNames: 'modal',
    attributes: { 'aria-labelledby': TITLE_ID },
    children: [form],
  });

  // Errors appear after the first Save and then follow the user's edits
  let submitted = false;

  form.addEventListener('input', () => {
    if (submitted) {
      fields.showErrors(validateTransaction(fields.getValues()));
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void save();
  });

  async function save(): Promise<void> {
    submitted = true;

    const values = fields.getValues();
    const errors = validateTransaction(values);

    fields.showErrors(errors);

    if (errors) {
      fields.focusFirstError();
      return;
    }

    const draft = toTransactionDraft(values);

    if (transaction) {
      await transactionRepository.update({ ...draft, id: transaction.id });
    } else {
      await transactionRepository.add(draft);
    }

    dialog.close();
    onSaved();
  }

  closeButton.addEventListener('click', () => dialog.close());
  cancelButton.addEventListener('click', () => dialog.close());

  // Close, Cancel, Escape and Save all end here
  dialog.addEventListener('close', () => dialog.remove());

  document.body.append(dialog);
  dialog.showModal();
}

function getInitialValues(transaction?: Transaction): TransactionFormValues {
  if (!transaction) {
    return {
      type: 'expenses',
      amount: '',
      categoryId: '', // no default category: the user chooses it
      date: Temporal.Now.plainDateISO().toString(),
      description: '',
    };
  }

  return {
    type: transaction.type,
    amount: formatMoney(transaction.amount), // '48,90' or '48.90', as in the browser's language
    categoryId: transaction.categoryId,
    date: transaction.date,
    description: transaction.description ?? '',
  };
}
