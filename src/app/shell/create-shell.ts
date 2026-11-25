import { createElement } from '@/shared/lib/dom/create-element';

export interface NavLink {
  path: string; // 'dashboard' → href '#/dashboard'
  title: string;
  icon: string; // inner SVG markup, viewBox 0 0 24 24
}

export interface Shell {
  element: HTMLElement;
  outlet: HTMLElement; // <main>: the router shows pages here
  setActiveRoute(path: string): void;
}

const LOGO = `<svg class="sidebar__logo-mark" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
  <rect width="32" height="32" rx="8" />
  <path d="M8 21l5-5 4 3 7-8" />
</svg>`;

// Desktop layout: sidebar on the left, the page on the right.
// Static markup only: titles and icons come from the route table, never from user input.
export function createShell(links: NavLink[]): Shell {
  const nav = document.createElement('nav');
  nav.className = 'sidebar';
  nav.setAttribute('aria-label', 'Main');
  nav.innerHTML = `
    <div class="sidebar__logo">${LOGO}<span>FinLab</span></div>
    <ul class="sidebar__links" role="list">${links.map(renderLink).join('')}</ul>
    <div class="sidebar__footer">
      <p class="sidebar__note">Your data stays in this browser. No sign-up needed.</p>
    </div>`;

  const outlet = createElement('main', { classNames: 'app-main' });
  outlet.id = 'main';
  outlet.tabIndex = -1; // the router moves focus here after navigation

  const element = createElement('div', {
    classNames: 'app-shell',
    children: [nav, outlet],
  });

  return {
    element,
    outlet,
    setActiveRoute(path) {
      for (const link of nav.querySelectorAll('a')) {
        if (link.getAttribute('href') === `#/${path}`) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    },
  };
}

function renderLink({ path, title, icon }: NavLink): string {
  const svg = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;

  return `<li><a class="sidebar__link" href="#/${path}">${svg}${title}</a></li>`;
}
