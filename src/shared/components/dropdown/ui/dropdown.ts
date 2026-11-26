import { createElement } from '@/shared/lib/dom/create-element';
import type { DropdownOptions } from '../model/dropdown.interface';

export function createDropdown({
  label,
  value,
  content,
  classNames,
  onSelect,
}: DropdownOptions): HTMLElement {
  const trigger = createElement('button', {
    classNames: 'dropdown__trigger',
    textContent: value,
    attributes: {
      type: 'button',
      'aria-label': label,
      'aria-expanded': 'false',
      'aria-haspopup': 'true',
    },
  });

  const menu = createElement('ul', {
    classNames: 'dropdown__menu',
    attributes: {
      role: 'list',
    },
    children: content,
  });

  const dropdown = createElement('div', {
    classNames: `dropdown ${classNames ?? ''}`.trim(),
    children: [trigger, menu],
  });

  let isOpen = false;

  trigger.addEventListener('click', () => {
    isOpen = !isOpen;

    dropdown.classList.toggle('dropdown--open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', (event: MouseEvent) => {
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    const selectedValue = event.target.dataset.value;

    if (selectedValue === undefined) {
      return;
    }

    trigger.textContent = event.target.textContent;
    onSelect?.(selectedValue);

    isOpen = false;

    dropdown.classList.remove('dropdown--open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  return dropdown;
}
