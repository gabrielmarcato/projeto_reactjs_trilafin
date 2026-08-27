import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { rootRoute } from './root.route';

/**
 * Casca persistente da aplicação: Topbar + Sidebar fixos, com o miolo
 * (`<Outlet />`) trocando conforme a rota filha (dashboard, configurações…).
 * É uma rota-layout sem path (`id`), então não adiciona segmento à URL.
 */
function ShellLayout() {
  return (
    <AppShell sidebar={<Sidebar />}>
      <Outlet />
    </AppShell>
  );
}

export const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'shell',
  // Protege todas as telas da casca: sem autenticação, vai para /login.
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: ShellLayout,
});
