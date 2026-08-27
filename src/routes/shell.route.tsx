import { useEffect } from 'react';
import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useAccountsStore } from '@/store/useAccountsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useImportsStore } from '@/store/useImportsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { rootRoute } from './root.route';

/**
 * Casca persistente da aplicação: Topbar + Sidebar fixos, com o miolo
 * (`<Outlet />`) trocando conforme a rota filha (dashboard, configurações…).
 * É uma rota-layout sem path (`id`), então não adiciona segmento à URL.
 */
function ShellLayout() {
  // Carrega os dados do backend ao entrar na área autenticada.
  useEffect(() => {
    if (import.meta.env.MODE === 'test') return;
    void useAccountsStore.getState().hydrate();
    void useSettingsStore.getState().hydrate();
    void useTransactionsStore.getState().hydrate();
    void useImportsStore.getState().hydrate();
    void useProfileStore.getState().hydrate();
  }, []);

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
