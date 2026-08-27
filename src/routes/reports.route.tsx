import { createRoute } from '@tanstack/react-router';
import { ReportsScreen } from '@/features/reports/screens/ReportsScreen';
import { shellRoute } from './shell.route';

/** Rota "/relatorios" — relatórios e exportação, dentro da casca. */
export const reportsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/relatorios',
  component: ReportsScreen,
});
