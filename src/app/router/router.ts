import type { RenderPage } from '@/shared/types/render-page.type';

export interface Route {
  path: string; // 'dashboard' → address '#/dashboard'
  title: string; // tab title and sidebar link text
  render: RenderPage;
}

export interface RouterOptions {
  routes: Route[]; // the first route opens for an empty or unknown hash
  outlet: HTMLElement; // where pages are shown: <main>
  onNavigate: (route: Route) => void; // e.g. highlight the sidebar link
}

export interface Router {
  start(): void;
  stop(): void; // for tests: the next test gets a fresh router
  onLeave(path: string, handler: () => void): void;
}

export const LOAD_ERROR_MESSAGE = 'Could not load this page. Try reloading it.';

type PageCleanup = Awaited<ReturnType<RenderPage>>;

export function createRouter({ routes, outlet, onNavigate }: RouterOptions): Router {
  const leaveHandlers: { path: string; handler: () => void }[] = [];
  let current: Route | undefined;
  let cleanup: PageCleanup;

  function navigate(): void {
    const hashPath = location.hash.slice(2).split('?')[0];

    let route = routes.find(({ path }) => path === hashPath);

    if (!route) {
      route = routes[0];
      // replace, not push: "Back" should not return to the broken address
      history.replaceState(null, '', `#/${route.path}`);
    }

    if (route === current) {
      return;
    }

    leave();
    current = route;
    document.title = `${route.title} · FinLab`;
    onNavigate(route);
    void show(route);
  }

  function leave(): void {
    for (const { path, handler } of leaveHandlers) {
      if (path === current?.path) {
        handler();
      }
    }

    cleanup?.();
    cleanup = undefined;
  }

  async function show(route: Route): Promise<void> {
    // A new root for every visit: if the user leaves before an async page finishes,
    // the late page draws into the detached root, not over the next page.
    const root = document.createElement('div');
    root.className = 'page';
    outlet.replaceChildren(root);
    outlet.focus();
    window.scrollTo(0, 0);

    try {
      const pageCleanup = await route.render(root);

      if (outlet.contains(root)) {
        cleanup = pageCleanup;
      } else {
        pageCleanup?.();
      }
    } catch (error) {
      console.error(error);
      root.append(createLoadError());
    }
  }

  return {
    start() {
      window.addEventListener('hashchange', navigate);
      navigate();
    },
    stop() {
      window.removeEventListener('hashchange', navigate);
    },
    onLeave(path, handler) {
      leaveHandlers.push({ path, handler });
    },
  };
}

function createLoadError(): HTMLElement {
  const message = document.createElement('p');
  message.className = 'page-error';
  message.setAttribute('role', 'alert');
  message.textContent = LOAD_ERROR_MESSAGE;

  return message;
}
