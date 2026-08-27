import { createRoute } from '@tanstack/react-router';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { shellRoute } from './shell.route';

/** Rota "/" — home (dashboard), renderizada dentro da casca. */
export const indexRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/',
  component: DashboardScreen,
});
