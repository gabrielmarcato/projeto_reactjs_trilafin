import { createRoute } from '@tanstack/react-router';
import { UserFormScreen } from '@/features/users/screens/UserFormScreen';
import { rootRoute } from './root.route';

/** Rota "/users/new" — tela de formulário de criação. */
export const userNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/new',
  component: UserFormScreen,
});
