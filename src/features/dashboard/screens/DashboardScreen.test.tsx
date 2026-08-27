import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('DashboardScreen', () => {
  it('renderiza a home do Trilha.Fin na rota "/"', async () => {
    renderApp('/');

    expect(
      await screen.findByText(/Visão geral — Agosto 2026/i),
    ).toBeInTheDocument();

    // Indicadores e uma transação do design.
    expect(screen.getByText('Patrimônio líquido')).toBeInTheDocument();
    expect(screen.getByText('Salário — Vector Studio')).toBeInTheDocument();
  });

  it('alterna o período no controle segmentado', async () => {
    const { user } = renderApp('/');

    const anual = await screen.findByRole('tab', { name: 'Ano' });
    expect(anual).toHaveAttribute('aria-selected', 'false');

    await user.click(anual);
    expect(anual).toHaveAttribute('aria-selected', 'true');
  });

  it('cadastra uma conta pelo modal e ela aparece na sidebar', async () => {
    const { user } = renderApp('/');

    await user.click(
      await screen.findByRole('button', { name: /adicionar conta/i }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText(/nome da conta/i),
      'Carteira Digital',
    );
    await user.type(within(dialog).getByLabelText(/banco/i), 'PicPay');
    await user.type(
      within(dialog).getByLabelText(/número da conta/i),
      '55555-0',
    );
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    // O modal fecha e a nova conta aparece na sidebar.
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Carteira Digital')).toBeInTheDocument();
  });

  it('edita uma conta ao clicar nela', async () => {
    const { user } = renderApp('/');

    await user.click(
      await screen.findByRole('button', {
        name: /editar conta Conta corrente/i,
      }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /editar conta/i }),
    ).toBeInTheDocument();

    const nameInput = within(dialog).getByLabelText(/nome da conta/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Conta salário');
    await user.click(
      within(dialog).getByRole('button', { name: /salvar alterações/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Conta salário')).toBeInTheDocument();
    expect(screen.queryByText('Conta corrente')).not.toBeInTheDocument();
  });

  it('abre o menu do usuário com Configurações, Conta e Sair', async () => {
    const { user } = renderApp('/');

    const trigger = await screen.findByRole('button', {
      name: /menu do usuário/i,
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const menu = screen.getByRole('menu');
    expect(
      within(menu).getByRole('menuitem', { name: /configurações/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole('menuitem', { name: /^conta$/i }),
    ).toBeInTheDocument();
    const sair = within(menu).getByRole('menuitem', { name: /sair/i });
    expect(sair).toBeInTheDocument();

    // Escolher uma opção fecha o menu.
    await user.click(sair);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('vai para Configurações mantendo a casca (topbar + sidebar)', async () => {
    const { user } = renderApp('/');

    expect(await screen.findByText('Para onde foi')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /menu do usuário/i }));
    await user.click(screen.getByRole('menuitem', { name: /configurações/i }));

    // Só o miolo troca: aparece Configurações e o dashboard some…
    expect(
      await screen.findByRole('heading', { name: /configurações/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Para onde foi')).not.toBeInTheDocument();

    // …mas a casca (sidebar/topbar) permanece.
    expect(screen.getByText('Contas')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /menu do usuário/i }),
    ).toBeInTheDocument();
  });

  it('remove uma conta com confirmação', async () => {
    const { user } = renderApp('/');

    await user.click(
      await screen.findByRole('button', { name: /editar conta Reserva/i }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: /remover conta/i }),
    );
    await user.click(
      within(dialog).getByRole('button', { name: /sim, remover/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.queryByText('Reserva')).not.toBeInTheDocument();
  });
});
