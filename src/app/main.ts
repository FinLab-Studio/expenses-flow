import 'temporal-polyfill/global';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@/styles/main.scss';
import { createShell } from './shell/create-shell';
import { createRouter } from './router/router';
import { routes } from './routes';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const shell = createShell(routes);
  app.replaceChildren(shell.element);

  const router = createRouter({
    routes,
    outlet: shell.outlet,
    onNavigate: (route) => shell.setActiveRoute(route.path),
  });

  router.start();
}
