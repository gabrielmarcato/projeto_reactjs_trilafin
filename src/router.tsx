import { createRouter } from '@tanstack/react-router';
import type { RouterHistory } from '@tanstack/react-router';
import { rootRoute } from './routes/root.route';
import { shellRoute } from './routes/shell.route';
import { indexRoute } from './routes/index.route';
import { settingsRoute } from './routes/settings.route';
import { transactionsRoute } from './routes/transactions.route';
import { importsRoute } from './routes/imports.route';
import { importReviewRoute } from './routes/importReview.route';
import { reportsRoute } from './routes/reports.route';
import { loginRoute } from './routes/login.route';
import { usersRoute } from './routes/users.route';
import { userNewRoute } from './routes/userNew.route';

/**
 * Árvore de rotas da aplicação.
 *
 * `shellRoute` é a casca (Topbar + Sidebar); suas filhas (`indexRoute`,
 * `settingsRoute`) trocam apenas o miolo. Ao adicionar uma tela que compartilha
 * a casca, pendure-a em `shellRoute.addChildren`.
 */
const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    indexRoute,
    settingsRoute,
    transactionsRoute,
    importsRoute,
    importReviewRoute,
    reportsRoute,
  ]),
  loginRoute,
  usersRoute,
  userNewRoute,
]);

/**
 * Factory do router. Aceita um `history` opcional para que os testes possam
 * injetar um `createMemoryHistory` apontando para a rota sob teste.
 */
export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, ...(history ? { history } : {}) });
}

export const router = createAppRouter();

// Torna o router totalmente tipado (params, links, navegação) em toda a app.
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
