import { QueryClient } from '@tanstack/react-query';

/**
 * Instância única do QueryClient da aplicação.
 *
 * É criada em um módulo separado (e não inline no provider) para poder ser
 * reutilizada em testes, onde geralmente instanciamos um client novo com
 * `retry: false` para evitar timeouts.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const queryClient = createQueryClient();
