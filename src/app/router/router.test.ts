// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RenderPage } from '@/shared/types/render-page.type';
import { LOAD_ERROR_MESSAGE, type Route, type Router, createRouter } from './router';
import { ABOUT_PAGE, DASHBOARD_PAGE } from '../path-names';

// hashchange is delivered after the current task, like in a browser: wait one macrotask
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function showText(text: string): RenderPage {
  return (container) => {
    container.textContent = text;
  };
}

let router: Router | undefined;

function setup(hash: string, aboutRender: RenderPage = showText('About page')) {
  history.replaceState(null, '', hash || '/');

  const routes: Route[] = [
    { path: ABOUT_PAGE, title: 'About', render: aboutRender },
    { path: DASHBOARD_PAGE, title: 'Dashboard', render: showText('Dashboard page') },
  ];
  const outlet = document.createElement('main');
  outlet.tabIndex = -1;
  document.body.replaceChildren(outlet);
  const onNavigate = vi.fn();

  router = createRouter({ routes, outlet, onNavigate });

  return { router, routes, outlet, onNavigate };
}

describe('createRouter', () => {
  afterEach(async () => {
    router?.stop();
    vi.restoreAllMocks();
    await tick();
  });

  it('opens the first route and fixes the address when the hash matches no route', () => {
    const { router, outlet } = setup('');

    router.start();

    expect(outlet.textContent).toBe('About page');
    expect(location.hash).toBe('#/about');
  });

  it('opens the page from the hash, sets the title, reports the route and focuses the outlet', () => {
    const { router, routes, outlet, onNavigate } = setup('#/dashboard');

    router.start();

    expect(outlet.textContent).toBe('Dashboard page');
    expect(document.title).toBe('Dashboard · FinLab');
    expect(onNavigate).toHaveBeenCalledWith(routes[1]);
    expect(document.activeElement).toBe(outlet);
  });

  it('replaces the page on hash change and runs the leave handlers of the page left', async () => {
    const { router, outlet } = setup('#/about');
    const leaveAbout = vi.fn();
    const leaveDashboard = vi.fn();
    router.onLeave(ABOUT_PAGE, leaveAbout);
    router.onLeave(DASHBOARD_PAGE, leaveDashboard);
    router.start();

    location.hash = '#/dashboard';
    await tick();

    expect(outlet.textContent).toBe('Dashboard page');
    expect(leaveAbout).toHaveBeenCalledOnce();
    expect(leaveDashboard).not.toHaveBeenCalled();
  });

  it('stays on the page when the new hash leads to the same route', async () => {
    const render = vi.fn();
    const { router } = setup('#/about', render);
    const leaveAbout = vi.fn();
    router.onLeave(ABOUT_PAGE, leaveAbout);
    router.start();

    location.hash = '#/unknown';
    await tick();

    expect(render).toHaveBeenCalledOnce();
    expect(leaveAbout).not.toHaveBeenCalled();
  });

  it('calls the cleanup returned by the page when the user leaves it', async () => {
    const cleanup = vi.fn();
    const { router } = setup('#/about', () => cleanup);
    router.start();

    location.hash = '#/dashboard';
    await tick();

    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('shows an error message when the page fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { router, outlet } = setup('#/about', () =>
      Promise.reject(new Error('Storage is broken')),
    );

    router.start();
    await tick();

    expect(outlet.querySelector('[role="alert"]')?.textContent).toBe(LOAD_ERROR_MESSAGE);
    expect(console.error).toHaveBeenCalledOnce();
  });

  it('calls the cleanup at once when the page finishes loading after the user has left', async () => {
    const cleanup = vi.fn();
    let finishLoading = () => {};
    const { router } = setup(
      '#/about',
      () => new Promise((resolve) => (finishLoading = () => resolve(cleanup))),
    );
    router.start();

    location.hash = '#/dashboard';
    await tick();
    finishLoading();
    await tick();

    expect(cleanup).toHaveBeenCalledOnce();
  });
});
