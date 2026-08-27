import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'styled-components';
import { queryClient } from '@/lib/queryClient';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { theme } from '@/styles/theme';

/**
 * Composição de providers globais da aplicação.
 *
 * A ordem importa: o `ThemeProvider` precisa envolver o `GlobalStyle` (que
 * consome tokens do tema). O mesmo componente é reutilizado nos testes para
 * renderizar telas com todo o contexto necessário.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
