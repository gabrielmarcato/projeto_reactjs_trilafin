import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/usersApi';
import type { CreateUserInput, User } from '../types';
import { userKeys } from './userKeys';

/**
 * Hook de escrita (exemplo de `useMutation`).
 *
 * Ao concluir com sucesso, invalida a lista para que a tela de listagem
 * seja refeita com o novo registro.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
