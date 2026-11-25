import { createElement } from '@/shared/lib/dom/create-element';
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

  return createElement('section', { classNames: 'hero', children: [intro] });
}

// Navigation is a link, not a <button>: it changes the address and works with "open in new tab".
function createLink(text: string, href: string, classNames: string): HTMLAnchorElement {
  return createElement('a', { classNames, textContent: text, attributes: { href } });
}
