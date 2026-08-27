import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('LoginScreen / autenticação', () => {
  it('redireciona para /login quando não autenticado', async () => {
    renderApp('/', { authenticated: false });

    expect(
      await screen.findByRole('heading', { name: 'Entrar' }),
    ).toBeInTheDocument();
    // A home (protegida) não aparece.
    expect(
      screen.queryByText(/Visão geral — Agosto 2026/i),
    ).not.toBeInTheDocument();
  });

  it('mostra erro com credenciais inválidas', async () => {
    const { user } = renderApp('/login', { authenticated: false });

    await user.type(await screen.findByLabelText(/usuário/i), 'teste');
    await user.type(screen.getByLabelText(/senha/i), 'errado');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText(/usuário ou senha inválidos/i),
    ).toBeInTheDocument();
  });

  it('entra com teste/teste e acessa a home', async () => {
    const { user } = renderApp('/login', { authenticated: false });

    await user.type(await screen.findByLabelText(/usuário/i), 'teste');
    await user.type(screen.getByLabelText(/senha/i), 'teste');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Visão geral — Agosto 2026/i),
      ).toBeInTheDocument(),
    );
  });
});
