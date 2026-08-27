import { z } from 'zod';
import { USER_ROLES } from './types';

/**
 * Schema de validação do formulário de usuário.
 *
 * É a única fonte de verdade da validação: o tipo `UserFormValues` é
 * INFERIDO do schema (via `z.infer`), evitando duplicação entre o shape do
 * formulário e as regras de validação.
 */
export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter ao menos 3 caracteres')
    .max(80, 'O nome deve ter no máximo 80 caracteres'),
  email: z.string().trim().email('Informe um e-mail válido'),
  role: z.enum(USER_ROLES, {
    message: 'Selecione um perfil válido',
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

/** Valores iniciais do formulário de criação. */
export const emptyUserForm: UserFormValues = {
  name: '',
  email: '',
  role: 'viewer',
};
