import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

// A autenticação chama a API; mockamos o cliente (sem servidor nos testes).
vi.mock('@/lib/api', () => ({
  loginRequest: vi.fn(),
  setAuthToken: vi.fn(),
  apiFetch: vi.fn(),
  ApiError: class extends Error {},
}));

import { loginRequest } from '@/lib/api';

describe('LoginScreen / autenticação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para /login quando não autenticado', async () => {
    renderApp('/', { authenticated: false });

    expect(
      await screen.findByRole('heading', { name: 'Entrar' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Visão geral — Agosto 2026/i),
    ).not.toBeInTheDocument();
  });

  it('mostra erro com credenciais inválidas', async () => {
    vi.mocked(loginRequest).mockRejectedValue(new Error('inválido'));
    const { user } = renderApp('/login', { authenticated: false });

    await user.type(await screen.findByLabelText(/usuário/i), 'teste');
    await user.type(screen.getByLabelText(/senha/i), 'errado');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText(/usuário ou senha inválidos/i),
    ).toBeInTheDocument();
  });

  it('entra com teste/teste e acessa a home', async () => {
    vi.mocked(loginRequest).mockResolvedValue({
      token: 'jwt-de-teste',
      user: { username: 'teste' },
    });
    const { user } = renderApp('/login', { authenticated: false });

    await user.type(await screen.findByLabelText(/usuário/i), 'teste');
    await user.type(screen.getByLabelText(/senha/i), 'teste');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Visão geral — Agosto 2026/i),
      ).toBeInTheDocument(),
    );
    expect(loginRequest).toHaveBeenCalledWith('teste', 'teste');
  });
});
