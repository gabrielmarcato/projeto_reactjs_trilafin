import { createRoute } from '@tanstack/react-router';
import { UsersListScreen } from '@/features/users/screens/UsersListScreen';
import { rootRoute } from './root.route';

/** Rota "/users" — tela de listagem. */
export const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersListScreen,
});
