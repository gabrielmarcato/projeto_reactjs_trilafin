import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';
import type { CreateUserInput, User } from '../types';

vi.mock('../api/usersApi', () => ({
  fetchUsers: vi.fn(),
  fetchUser: vi.fn(),
  createUser: vi.fn(),
}));

import { createUser, fetchUsers } from '../api/usersApi';

describe('UserFormScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // A listagem é montada após o submit navegar para /users.
    vi.mocked(fetchUsers).mockResolvedValue([]);
  });

  it('exibe erros de validação ao submeter vazio', async () => {
    const { user } = renderApp('/users/new');

    await user.click(await screen.findByRole('button', { name: /salvar/i }));

    expect(
      await screen.findByText(/o nome deve ter ao menos 3 caracteres/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/informe um e-mail válido/i),
    ).toBeInTheDocument();
    expect(createUser).not.toHaveBeenCalled();
  });

  it('valida o formato do e-mail', async () => {
    const { user } = renderApp('/users/new');

    await user.type(await screen.findByLabelText(/nome/i), 'Diana Alves');
    await user.type(screen.getByLabelText(/e-mail/i), 'nao-e-email');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(
      await screen.findByText(/informe um e-mail válido/i),
    ).toBeInTheDocument();
    expect(createUser).not.toHaveBeenCalled();
  });

  it('cria o usuário e navega para a listagem quando válido', async () => {
    const created: User = {
      id: '99',
      name: 'Diana Alves',
      email: 'diana@trilafin.dev',
      role: 'editor',
    };
    vi.mocked(createUser).mockResolvedValue(created);

    const { user, router } = renderApp('/users/new');

    await user.type(await screen.findByLabelText(/nome/i), 'Diana Alves');
    await user.type(screen.getByLabelText(/e-mail/i), 'diana@trilafin.dev');
    await user.selectOptions(screen.getByLabelText(/perfil/i), 'editor');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await vi.waitFor(() => {
      expect(createUser).toHaveBeenCalledTimes(1);
    });

    const payload = vi.mocked(createUser).mock.calls[0]?.[0] as CreateUserInput;
    expect(payload).toEqual({
      name: 'Diana Alves',
      email: 'diana@trilafin.dev',
      role: 'editor',
    });

    await vi.waitFor(() => {
      expect(router.state.location.pathname).toBe('/users');
    });
  });
});
