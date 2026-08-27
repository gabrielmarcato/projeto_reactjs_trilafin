/**
 * Factory de query keys da feature `users`.
 *
 * Centralizar as keys evita strings mágicas espalhadas e garante que
 * mutations invalidem exatamente as queries certas.
 */
export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
