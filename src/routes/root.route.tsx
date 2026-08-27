import { createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// Devtools só entram no bundle de desenvolvimento.
const RouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    );

/**
 * Layout raiz. Não desenha chrome próprio — cada tela traz o seu (a home usa
 * o `AppShell` com Topbar + Sidebar). Apenas hospeda o `<Outlet />`.
 */
function RootLayout() {
  return (
    <>
      <Outlet />
      <Suspense>
        <RouterDevtools />
      </Suspense>
    </>
  );
}

export const rootRoute = createRootRoute({
  component: RootLayout,
});
