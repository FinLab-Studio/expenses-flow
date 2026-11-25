import { createElement } from '@/shared/lib/dom/create-element';
import type { RenderPage } from '@/shared/types/render-page.type';

// Placeholder: the About page (hero, currency choice, team) comes in its own task.

export const renderAboutPage: RenderPage = (container) => {
  const title = createElement('h1', { textContent: 'About FinLab' });
  const text = createElement('p', {
    textContent: 'Personal finance tracker by the FinLab team. This page is in progress.',
  });

  container.append(title, text);
};
