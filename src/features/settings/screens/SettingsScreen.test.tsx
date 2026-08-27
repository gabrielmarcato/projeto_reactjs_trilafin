import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('SettingsScreen', () => {
  it('mostra as abas de configuração', async () => {
    renderApp('/configuracoes');

    expect(
      await screen.findByRole('tab', { name: 'Categorias' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Formas de pagamento' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Tipos de orçamento' }),
    ).toBeInTheDocument();

    // A aba inicial (Categorias) mostra os itens semeados (dentro do painel —
    // "Moradia" também aparece na sidebar de orçamentos).
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText('Moradia')).toBeInTheDocument();
  });

  it('troca de aba e mostra as formas de pagamento', async () => {
    const { user } = renderApp('/configuracoes');

    await user.click(
      await screen.findByRole('tab', { name: 'Formas de pagamento' }),
    );

    expect(screen.getByText('Pix')).toBeInTheDocument();
    expect(screen.getByText('Boleto')).toBeInTheDocument();
  });

  it('cadastra um item pelo modal de adicionar', async () => {
    const { user } = renderApp('/configuracoes');

    const panel = await screen.findByRole('tabpanel');
    await user.click(within(panel).getByRole('button', { name: /adicionar/i }));

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /adicionar categoria/i }),
    ).toBeInTheDocument();
    await user.type(within(dialog).getByLabelText(/nome/i), 'Pets');
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(within(panel).getByText('Pets')).toBeInTheDocument();
  });

  it('edita um item pelo mesmo modal', async () => {
    const { user } = renderApp('/configuracoes');

    const panel = await screen.findByRole('tabpanel');
    await user.click(
      within(panel).getByRole('button', { name: /editar Moradia/i }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /editar categoria/i }),
    ).toBeInTheDocument();
    const input = within(dialog).getByLabelText(/nome/i);
    await user.clear(input);
    await user.type(input, 'Habitação');
    await user.click(within(dialog).getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(within(panel).getByText('Habitação')).toBeInTheDocument();
  });

  it('remove um item com confirmação', async () => {
    const { user } = renderApp('/configuracoes');

    const panel = await screen.findByRole('tabpanel');
    await user.click(
      within(panel).getByRole('button', { name: /remover Lazer/i }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/tem certeza/i)).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole('button', { name: /sim, remover/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(within(panel).queryByText('Lazer')).not.toBeInTheDocument();
  });
});
