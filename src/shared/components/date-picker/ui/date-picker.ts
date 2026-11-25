import { createElement } from '@/shared/lib/dom/create-element';
import { getCalendarDays } from '../model/get-calendar-days';
import type { DatePickerOptions } from '../model/date-picker-options.interface';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type CalendarView = 'days' | 'months' | 'years';

export function createDatePicker({ label, value, onSelect }: DatePickerOptions): HTMLElement {
  let selectedDate = Temporal.PlainDate.from(value);
  let displayedMonth = selectedDate.with({ day: 1 });
  let currentView: CalendarView = 'days';

  const calendar = createElement('div', {
    classNames: 'date-picker',
    attributes: {
      'aria-label': label,
    },
  });

  const yearButton = createElement('button', {
    classNames: 'date-picker__year',
    textContent: String(displayedMonth.year),
    attributes: { type: 'button' },
  });

  const monthButton = createElement('button', {
    classNames: 'date-picker__month',
    textContent: MONTHS[displayedMonth.month - 1],
    attributes: { type: 'button' },
  });

  const previousMonthButton = createElement('button', {
    classNames: 'date-picker__navigation date-picker__navigation--previous',
    textContent: '‹',
    attributes: {
      type: 'button',
      'aria-label': 'Previous month',
    },
  });

  const nextMonthButton = createElement('button', {
    classNames: 'date-picker__navigation date-picker__navigation--next',
    textContent: '›',
    attributes: {
      type: 'button',
      'aria-label': 'Next month',
    },
  });

  previousMonthButton.addEventListener('click', () => {
    displayedMonth = displayedMonth.subtract({ months: 1 });
    currentView = 'days';
    render();
  });

  nextMonthButton.addEventListener('click', () => {
    displayedMonth = displayedMonth.add({ months: 1 });
    currentView = 'days';
    render();
  });

  const grid = createElement('div', {
    classNames: 'date-picker__grid',
  });

  function renderDays(): void {
    const weekdays = WEEKDAYS.map((day) =>
      createElement('span', {
        classNames: 'date-picker__weekday',
        textContent: day,
      }),
    );

    const days = getCalendarDays(displayedMonth).map((day) => {
      if (day === null) {
        return createElement('span', {
          classNames: 'date-picker__day date-picker__day--empty',
        });
      }

      const date = displayedMonth.with({ day });
      const isSelected = date.equals(selectedDate);

      const button = createElement('button', {
        classNames: `date-picker__day ${isSelected ? 'date-picker__day--selected' : ''}`.trim(),
        textContent: String(day),
        attributes: {
          type: 'button',
          'aria-pressed': String(isSelected),
        },
      });

      button.addEventListener('click', () => {
        selectedDate = date;
        onSelect?.(selectedDate.toString());
        render();
      });

      return button;
    });

    grid.replaceChildren(...weekdays, ...days);
  }

  function renderMonths(): void {
    const months = MONTHS.map((month, index) => {
      const button = createElement('button', {
        classNames: 'date-picker__option',
        textContent: month,
        attributes: { type: 'button' },
      });

      button.addEventListener('click', () => {
        displayedMonth = displayedMonth.with({ month: index + 1 });
        currentView = 'days';
        render();
      });

      return button;
    });

    grid.replaceChildren(...months);
  }

  function renderYears(): void {
    const currentYear = Temporal.Now.plainDateISO().year;
    const years = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

    const yearButtons = years.map((year) => {
      const button = createElement('button', {
        classNames: 'date-picker__option',
        textContent: String(year),
        attributes: { type: 'button' },
      });

      button.addEventListener('click', () => {
        displayedMonth = displayedMonth.with({ year });
        currentView = 'days';
        render();
      });

      return button;
    });

    grid.replaceChildren(...yearButtons);
  }

  function render(): void {
    yearButton.textContent = String(displayedMonth.year);
    monthButton.textContent = MONTHS[displayedMonth.month - 1];

    if (currentView === 'days') {
      renderDays();
    } else if (currentView === 'months') {
      renderMonths();
    } else {
      renderYears();
    }
  }

  yearButton.addEventListener('click', () => {
    currentView = currentView === 'years' ? 'days' : 'years';
    render();
  });

  monthButton.addEventListener('click', () => {
    currentView = currentView === 'months' ? 'days' : 'months';
    render();
  });

  calendar.append(previousMonthButton, yearButton, monthButton, nextMonthButton, grid);

  render();

  return calendar;
}
