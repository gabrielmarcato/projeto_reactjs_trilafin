import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { useUsersUiStore } from '@/store/useUsersUiStore';
import { useCreateUser } from '../hooks/useCreateUser';
import { emptyUserForm, userFormSchema } from '../schema';
import type { UserFormValues } from '../schema';
import { USER_ROLES } from '../types';
import * as S from './UserFormScreen.styles';

const ROLE_LABELS: Record<UserFormValues['role'], string> = {
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador',
};

/**
 * Tela de FORMULÁRIO (padrão de referência).
 *
 * Responsabilidades:
 * - Validar com React Hook Form + Zod (via `zodResolver`);
 * - Persistir via mutation do TanStack Query (`useCreateUser`);
 * - Registrar o resultado no Zustand (`setLastCreatedUser`);
 * - Exibir erros de validação por campo e erros de submissão no topo.
 */
export function UserFormScreen() {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const setLastCreatedUser = useUsersUiStore(
    (state) => state.setLastCreatedUser,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyUserForm,
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (values) => {
    const created = await createUser.mutateAsync(values);
    setLastCreatedUser(created);
    await navigate({ to: '/users' });
  });

  return (
    <S.Page>
      <S.Header>
        <S.Title>Novo usuário</S.Title>
        <S.Subtitle>
          Preencha os dados abaixo. Todos os campos são obrigatórios.
        </S.Subtitle>
      </S.Header>

      <S.Form onSubmit={onSubmit} noValidate>
        {createUser.isError ? (
          <S.FormError role="alert">
            Não foi possível salvar: {createUser.error.message}
          </S.FormError>
        ) : null}

        <Field
          label="Nome"
          placeholder="Nome completo"
          error={errors.name?.message}
          {...register('name')}
        />

        <Field
          label="E-mail"
          type="email"
          placeholder="email@empresa.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <S.FieldGroup>
          <S.Label htmlFor="role">Perfil</S.Label>
          <S.Select
            id="role"
            $hasError={Boolean(errors.role)}
            aria-invalid={Boolean(errors.role)}
            {...register('role')}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </S.Select>
          {errors.role ? (
            <S.ErrorText role="alert">{errors.role.message}</S.ErrorText>
          ) : null}
        </S.FieldGroup>

        <S.Actions>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => navigate({ to: '/users' })}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </S.Actions>
      </S.Form>
    </S.Page>
  );
}
