import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './styles/main.scss';
import { createTransactionsPage } from './pages/transactions';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const transactionsPage = await createTransactionsPage();
  app.append(transactionsPage);
}
