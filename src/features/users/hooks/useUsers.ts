import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import { userKeys } from './userKeys';

/**
 * Hook de leitura da lista de usuários (exemplo de `useQuery`).
 *
 * A `queryKey` vem de uma factory centralizada (`userKeys`) para que
 * invalidações fiquem consistentes entre queries e mutations.
 */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
  });
}
