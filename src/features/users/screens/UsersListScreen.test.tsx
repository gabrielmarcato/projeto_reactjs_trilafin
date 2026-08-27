import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';
import type { User } from '../types';

/** Resolve após `ms`, para que o estado de loading seja observável. */
function resolveAfter<T>(value: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Mocka a camada de API para controlar loading/erro de forma determinística.
vi.mock('../api/usersApi', () => ({
  fetchUsers: vi.fn(),
  fetchUser: vi.fn(),
  createUser: vi.fn(),
}));

import { fetchUsers } from '../api/usersApi';

const mockUsers: User[] = [
  { id: '1', name: 'Ana Souza', email: 'ana@trilafin.dev', role: 'admin' },
  { id: '2', name: 'Bruno Lima', email: 'bruno@trilafin.dev', role: 'editor' },
];

describe('UsersListScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra o estado de loading e depois a lista de usuários', async () => {
    vi.mocked(fetchUsers).mockReturnValue(resolveAfter(mockUsers));

    renderApp('/users');

    expect(await screen.findByText(/carregando usuários/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(
      () => screen.queryByText(/carregando usuários/i),
      { timeout: 4000 },
    );

    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('bruno@trilafin.dev')).toBeInTheDocument();
  });

  it('exibe mensagem de erro quando a busca falha', async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error('Falha de rede'));

    renderApp('/users');

    expect(
      await screen.findByText(/falha ao carregar: falha de rede/i),
    ).toBeInTheDocument();
  });

  it('filtra a lista pelo termo de busca', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockUsers);

    const { user } = renderApp('/users');

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/buscar usuários/i), 'bruno');

    // A busca é debounced (300ms): esperamos Ana sair da lista.
    await waitForElementToBeRemoved(() => screen.queryByText('Ana Souza'));
    expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
  });
});
