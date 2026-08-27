import { createRoute } from '@tanstack/react-router';
import { ImportsScreen } from '@/features/imports/screens/ImportsScreen';
import { shellRoute } from './shell.route';

/** Rota "/importacoes" — histórico de importações, dentro da casca. */
export const importsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/importacoes',
  component: ImportsScreen,
});
