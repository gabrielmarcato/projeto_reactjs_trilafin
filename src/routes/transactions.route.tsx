import { createRoute } from '@tanstack/react-router';
import { TransactionsScreen } from '@/features/transactions/screens/TransactionsScreen';
import { shellRoute } from './shell.route';

/** Rota "/transacoes" — lista de transações, dentro da casca. */
export const transactionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/transacoes',
  component: TransactionsScreen,
});
