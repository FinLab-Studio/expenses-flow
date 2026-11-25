import { createElement } from '@/shared/lib/dom/create-element';
import { formatMoney, formatSignedMoney } from '@/shared/lib/money';
import type { RenderPage } from '@/shared/types/render-page.type';

// About is the start page: what FinLab does and who made it.
// No page header here: the hero takes its place (the page title is the hero h1).
export const renderAboutPage: RenderPage = (container) => {
  container.classList.add('about-page');
  container.append(createHero());
};

function createHero(): HTMLElement {
  const intro = createElement('div', {
    classNames: 'hero__intro',
    children: [
      createElement('p', {
        classNames: 'hero__badge',
        textContent: 'RS School · Fullstack Engineering · team project',
      }),
      createElement('h1', {
        classNames: 'hero__title',
        textContent: 'Your money, clear at a glance',
      }),
      createElement('p', {
        classNames: 'hero__description',
        textContent:
          'FinLab is a personal finance tracker. Log income and expenses, set a monthly budget, ' +
          'see where your money goes and compare months.',
      }),
      createElement('div', {
        classNames: 'hero__actions',
        children: [
          // Pages can't import route names from app/ (FSD), so the addresses are written here;
          // the page test checks them.
          createLink('Open dashboard', '#/dashboard', 'button button--primary'),
          createLink('Add first transaction', '#/transactions', 'button button--secondary'),
        ],
      }),
    ],
  });

  return createElement('section', { classNames: 'hero', children: [intro, createBudgetPreview()] });
}

// A picture of the Dashboard budget card with example numbers, not the user's data:
// hidden from screen readers. Static markup because createElement can't make SVG;
// the amounts come from formatMoney, so the decimal separator matches the rest of the app.
// Ring: circumference 2π × 54 ≈ 339.3; the coloured part is 81% of it ≈ 274.8.
function createBudgetPreview(): HTMLElement {
  const preview = createElement('div', {
    classNames: 'budget-preview',
    attributes: { 'aria-hidden': 'true' },
  });

  preview.innerHTML = `
    <div class="budget-preview__main">
      <svg class="budget-preview__ring" width="132" height="132" viewBox="0 0 132 132">
        <circle class="budget-preview__track" cx="66" cy="66" r="54" />
        <circle class="budget-preview__value" cx="66" cy="66" r="54"
          stroke-dasharray="274.8 339.3" transform="rotate(-90 66 66)" />
        <text class="budget-preview__percent" x="66" y="62">81%</text>
        <text class="budget-preview__caption" x="66" y="84">of budget</text>
      </svg>
      <div class="budget-preview__summary">
        <span class="budget-preview__label">Monthly budget</span>
        <span class="budget-preview__spent">${formatMoney(243780)}</span>
        <span class="budget-preview__label">of ${formatMoney(300000)}</span>
        <span class="budget-preview__badge">Close to limit</span>
      </div>
    </div>
    <div class="budget-preview__totals">
      <p class="budget-preview__total">
        <span class="budget-preview__label">Income</span>
        <span class="budget-preview__income">${formatSignedMoney(620000)}</span>
      </p>
      <p class="budget-preview__total">
        <span class="budget-preview__label">Expenses</span>
        <span class="budget-preview__expense">${formatSignedMoney(-243780)}</span>
      </p>
    </div>`;

  return preview;
}

// Navigation is a link, not a <button>: it changes the address and works with "open in new tab".
function createLink(text: string, href: string, classNames: string): HTMLAnchorElement {
  return createElement('a', { classNames, textContent: text, attributes: { href } });
}
