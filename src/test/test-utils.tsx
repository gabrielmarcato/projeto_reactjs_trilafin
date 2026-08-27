import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'styled-components';
import { createAppRouter } from '@/router';
import { useUsersUiStore } from '@/store/useUsersUiStore';
import { initialAccounts, useAccountsStore } from '@/store/useAccountsStore';
import { initialCollections, useSettingsStore } from '@/store/useSettingsStore';
import { initialProfile, useProfileStore } from '@/store/useProfileStore';
import {
  initialTransactions,
  useTransactionsStore,
} from '@/store/useTransactionsStore';
import { initialImports, useImportsStore } from '@/store/useImportsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { theme } from '@/styles/theme';

/** QueryClient isolado por teste, sem retentativas (falha rápido). */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

/**
 * Renderiza a aplicação real (router + providers) começando em `initialPath`.
 *
 * Use em testes de screen: `renderApp('/users')` monta a listagem com todo o
 * contexto de tema, query e roteamento — do mesmo jeito que em produção.
 */
export function renderApp(
  initialPath: string,
  { authenticated = true }: { authenticated?: boolean } = {},
) {
  // Zera as stores globais para não vazar estado entre os testes.
  useUsersUiStore.getState().reset();
  useAccountsStore.setState({ accounts: initialAccounts });
  useSettingsStore.setState({ collections: initialCollections });
  useProfileStore.setState({ profile: initialProfile });
  useTransactionsStore.setState({ transactions: initialTransactions });
  useImportsStore.setState({ imports: initialImports, pendingImport: null });
  // Zera a auth (limpa token/localStorage) e define o estado desejado.
  useAuthStore.getState().logout();
  useAuthStore.setState({ isAuthenticated: authenticated });
  useToastStore.setState({ toasts: [] });

  const history = createMemoryHistory({ initialEntries: [initialPath] });
  const router = createAppRouter(history);
  const queryClient = createTestQueryClient();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );

  // `delay: null` remove o atraso por tecla do userEvent — testes com muita
  // digitação/interação ficam rápidos e não estouram o timeout.
  return {
    ...result,
    router,
    queryClient,
    user: userEvent.setup({ delay: null }),
  };
}
