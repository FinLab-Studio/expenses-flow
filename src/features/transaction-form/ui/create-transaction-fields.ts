import type { CategoriesDTO } from '@/entities/category/model/categories.dto';
import type { Category } from '@/entities/category/model/category.interface';
import { CATEGORY_COLORS } from '@/entities/category/model/config/category-colors';
import { createCategoryIcon } from '@/entities/category/ui/category-icon/ui/category-icon';
import { createElement } from '@/shared/lib/dom/create-element';
import type { CurrencyCode } from '@/shared/types/currency-code.type';
import type { TransactionType } from '@/shared/types/transaction-type.type';
import type { ValidationError } from '@/shared/types/validation-error.interface';
import type { TransactionFormErrors } from '../model/transaction-form-errors.interface';
import type { TransactionFormValues } from '../model/transaction-form-values.interface';

export interface TransactionFieldsOptions {
  values: TransactionFormValues; // empty for a new transaction, filled in for editing
  categories: CategoriesDTO;
  currency: CurrencyCode; // shown next to the amount
}

export interface TransactionFields {
  element: HTMLElement;
  getValues(): TransactionFormValues;
  showErrors(errors: TransactionFormErrors | null): void; // null clears all errors
  focusFirstError(): void;
}

const TYPES: readonly { type: TransactionType; label: string }[] = [
  { type: 'expenses', label: 'Expense' },
  { type: 'income', label: 'Income' },
];

const AMOUNT_HINT = 'Comma or dot both work';

// The form lives in a modal and only one modal is open at a time, so fixed ids are enough.
const IDS = {
  amount: 'transaction-amount',
  amountMessage: 'transaction-amount-message',
  categoryLabel: 'transaction-category-label',
  categoryMessage: 'transaction-category-message',
  date: 'transaction-date',
  dateMessage: 'transaction-date-message',
  description: 'transaction-description',
} as const;

// Fields with errors, in the order of the form: the first one gets focus after Save
const ERROR_FIELDS = ['amount', 'categoryId', 'date'] as const;

// The form fields from the AddTransactionModal artboard: type, amount, category, date, description.
// Type and category are native radio buttons styled as segments and tiles (as the currency select).
export function createTransactionFields({
  values,
  categories,
  currency,
}: TransactionFieldsOptions): TransactionFields {
  const typeSwitch = createElement('div', {
    classNames: 'segmented transaction-form__type',
    attributes: { role: 'radiogroup', 'aria-label': 'Type' },
    children: TYPES.map(({ type, label }) =>
      createElement('label', {
        classNames: `segmented__option transaction-form__type-option--${type}`,
        children: [createRadio('type', type, type === values.type), document.createTextNode(label)],
      }),
    ),
  });

  // Amount: the sign shows the type, the currency is the one chosen on About
  const sign = createElement('span', {
    classNames: 'amount-input__sign',
    attributes: { 'aria-hidden': 'true' },
  });

  const amountInput = createElement('input', {
    classNames: 'amount-input__control',
    attributes: {
      id: IDS.amount,
      name: 'amount',
      type: 'text',
      inputmode: 'decimal',
      autocomplete: 'off',
      autofocus: true, // showModal() focuses it instead of the Close button
      value: values.amount,
      'aria-describedby': IDS.amountMessage,
    },
  });

  const amountMessage = createMessage(IDS.amountMessage);

  const amountField = createElement('div', {
    classNames: 'field',
    children: [
      createLabel('Amount', IDS.amount),
      createElement('div', {
        classNames: 'amount-input',
        children: [
          sign,
          amountInput,
          createElement('span', { classNames: 'amount-input__currency', textContent: currency }),
        ],
      }),
      amountMessage,
    ],
  });

  // Category: tiles of the chosen type; filled in by showType()
  const categoryGroup = createElement('div', {
    classNames: 'category-picker',
    attributes: {
      role: 'radiogroup',
      'aria-labelledby': IDS.categoryLabel,
      'aria-describedby': IDS.categoryMessage,
    },
  });

  const categoryMessage = createMessage(IDS.categoryMessage);

  const categoryField = createElement('div', {
    classNames: 'field',
    children: [
      createElement('span', {
        classNames: 'field__label',
        textContent: 'Category',
        attributes: { id: IDS.categoryLabel },
      }),
      categoryGroup,
      categoryMessage,
    ],
  });

  // Date: a native date field and two shortcuts
  const dateInput = createElement('input', {
    classNames: 'field__input',
    attributes: {
      id: IDS.date,
      name: 'date',
      type: 'date',
      value: values.date,
      'aria-describedby': IDS.dateMessage,
    },
  });

  const today = Temporal.Now.plainDateISO();

  const shortcuts = [
    { label: 'Today', date: today },
    { label: 'Yesterday', date: today.subtract({ days: 1 }) },
  ].map(({ label, date }) => {
    const button = createElement('button', {
      classNames: 'button button--secondary transaction-form__date-shortcut',
      textContent: label,
      attributes: { type: 'button' },
    });

    button.addEventListener('click', () => {
      dateInput.value = date.toString();
      // as if the user typed it: the modal re-checks the form on `input`
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    return button;
  });

  const dateMessage = createMessage(IDS.dateMessage);

  const dateField = createElement('div', {
    classNames: 'field',
    children: [
      createLabel('Date', IDS.date),
      createElement('div', {
        classNames: 'transaction-form__date',
        children: [dateInput, ...shortcuts],
      }),
      dateMessage,
    ],
  });

  const descriptionInput = createElement('input', {
    classNames: 'field__input',
    attributes: {
      id: IDS.description,
      name: 'description',
      type: 'text',
      autocomplete: 'off',
      placeholder: 'Supermarket, weekly groceries',
      value: values.description,
    },
  });

  const descriptionLabel = createLabel('Description', IDS.description);
  descriptionLabel.append(
    createElement('span', { classNames: 'field__optional', textContent: ' (optional)' }),
  );

  const descriptionField = createElement('div', {
    classNames: 'field',
    children: [descriptionLabel, descriptionInput],
  });

  function getType(): TransactionType {
    return getCheckedValue(typeSwitch) === 'income' ? 'income' : 'expenses';
  }

  function showType(type: TransactionType, categoryId: string): void {
    sign.textContent = type === 'income' ? '+' : '−';
    sign.classList.toggle('amount-input__sign--income', type === 'income');

    categoryGroup.replaceChildren(
      ...categories[type].map((category) =>
        createCategoryOption(category, category.id === categoryId),
      ),
    );
  }

  showType(values.type, values.categoryId);

  // `input`, not `change`: it reaches this group before the modal's `input` listener on the form,
  // so the form is re-checked with the new category list. The other type has other categories:
  // nothing is chosen.
  typeSwitch.addEventListener('input', () => showType(getType(), ''));

  const errorParts = {
    amount: { invalidTarget: amountInput, message: amountMessage, hint: AMOUNT_HINT },
    categoryId: { invalidTarget: categoryGroup, message: categoryMessage, hint: '' },
    date: { invalidTarget: dateInput, message: dateMessage, hint: '' },
  };

  const element = createElement('div', {
    classNames: 'transaction-form',
    children: [typeSwitch, amountField, categoryField, dateField, descriptionField],
  });

  function showErrors(errors: TransactionFormErrors | null): void {
    ERROR_FIELDS.forEach((key) => showFieldError(errorParts[key], errors?.[key]));
  }

  showErrors(null); // the amount hint

  return {
    element,

    getValues: () => ({
      type: getType(),
      amount: amountInput.value,
      categoryId: getCheckedValue(categoryGroup),
      date: dateInput.value,
      description: descriptionInput.value,
    }),

    showErrors,

    focusFirstError() {
      const invalid = element.querySelector<HTMLElement>('[aria-invalid="true"]');
      // The category group is a div: focus its first tile instead
      const target = invalid?.matches('input') ? invalid : invalid?.querySelector('input');

      target?.focus();
    },
  };
}

function createRadio(name: string, value: string, checked: boolean): HTMLInputElement {
  return createElement('input', {
    classNames: 'visually-hidden',
    attributes: { type: 'radio', name, value, checked },
  });
}

function createLabel(text: string, forId: string): HTMLLabelElement {
  return createElement('label', {
    classNames: 'field__label',
    textContent: text,
    attributes: { for: forId },
  });
}

function createMessage(id: string): HTMLParagraphElement {
  return createElement('p', { classNames: 'field__message', attributes: { id } });
}

function getCheckedValue(group: HTMLElement): string {
  return group.querySelector<HTMLInputElement>('input:checked')?.value ?? '';
}

// A tile: the icon on the tint of the category color and the name under it
function createCategoryOption(category: Category, checked: boolean): HTMLLabelElement {
  const colors = CATEGORY_COLORS[category.color];

  const icon = createCategoryIcon({ icon: category.icon });
  icon.setAttribute('aria-hidden', 'true'); // the name is enough: the icon's label isn't read

  const iconBox = createElement('span', { classNames: 'category-picker__icon', children: [icon] });
  iconBox.style.setProperty('--category-icon-color', colors.icon);
  iconBox.style.setProperty('--category-icon-tint', colors.tint);

  return createElement('label', {
    classNames: 'category-picker__option',
    children: [
      createRadio('categoryId', category.id, checked),
      iconBox,
      createElement('span', { textContent: category.name }),
    ],
  });
}

interface ErrorParts {
  invalidTarget: HTMLElement; // gets aria-invalid; the styles show the error border by it
  message: HTMLElement; // under the field: the error or the hint
  hint: string;
}

function showFieldError(
  { invalidTarget, message, hint }: ErrorParts,
  error?: ValidationError,
): void {
  invalidTarget.setAttribute('aria-invalid', String(Boolean(error)));
  message.textContent = error?.message ?? hint;
  message.classList.toggle('field__message--error', Boolean(error));
}
