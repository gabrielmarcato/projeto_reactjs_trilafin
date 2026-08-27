/** Modelo de domínio de um usuário. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const USER_ROLES = ['admin', 'editor', 'viewer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Payload aceito ao criar um usuário (sem `id`, gerado no backend). */
export type CreateUserInput = Omit<User, 'id'>;
