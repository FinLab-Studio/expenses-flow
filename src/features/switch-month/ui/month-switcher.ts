import { createElement } from '@/shared/lib/dom/create-element';
import { createMonthSwitcherIcon } from './month-switcher-icon';

export function createMonthSwitcher(
  initialMonth: Temporal.PlainYearMonth,
  onChange: (month: Temporal.PlainYearMonth) => void,
): HTMLElement {
  let month = initialMonth;

  const label = createElement('span', {
    classNames: 'month-switcher__label',
    attributes: { 'aria-live': 'polite' },
  });

  const previousButton = createElement('button', {
    classNames: 'month-switcher__button',
    attributes: {
      type: 'button',
      'aria-label': 'Previous month',
    },
    children: [createMonthSwitcherIcon('previous')],
  });

  const nextButton = createElement('button', {
    classNames: 'month-switcher__button',
    attributes: {
      type: 'button',
      'aria-label': 'Next month',
    },
    children: [createMonthSwitcherIcon('next')],
  });

  function update(): void {
    label.textContent = month
      .toPlainDate({ day: 1 })
      .toLocaleString('en', { month: 'long', year: 'numeric' });

    const currentMonth = Temporal.Now.plainDateISO().toPlainYearMonth();

    nextButton.disabled = Temporal.PlainYearMonth.compare(month, currentMonth) >= 0;
  }

  function changeMonth(offset: number): void {
    month = month.add({ months: offset });
    update();
    onChange(month);
  }

  previousButton.addEventListener('click', () => changeMonth(-1));
  nextButton.addEventListener('click', () => changeMonth(1));

  update();

  return createElement('div', {
    classNames: 'month-switcher',
    attributes: {
      role: 'group',
      'aria-label': 'Month navigation',
    },
    children: [previousButton, label, nextButton],
  });
}
