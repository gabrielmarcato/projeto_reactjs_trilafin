import { createRoute, redirect } from '@tanstack/react-router';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { useAuthStore } from '@/store/useAuthStore';
import { rootRoute } from './root.route';

/** Rota "/login" — fora da casca. Se já autenticado, vai para a home. */
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginScreen,
});
