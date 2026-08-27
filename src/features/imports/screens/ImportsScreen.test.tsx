import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('ImportsScreen', () => {
  it('lista o histórico com busca e paginação', async () => {
    renderApp('/importacoes');

    expect(
      await screen.findByRole('heading', { name: 'Importações' }),
    ).toBeInTheDocument();
    expect(screen.getByText('extrato-itau-agosto.ofx')).toBeInTheDocument();
    expect(await screen.findByLabelText(/registros por página/i)).toHaveValue(
      '10',
    );
    expect(screen.getByText(/mostrando 1.3 de 3/i)).toBeInTheDocument();
  });

  it('filtra pela busca', async () => {
    const { user } = renderApp('/importacoes');

    const search = await screen.findByLabelText(/buscar importações/i);
    await user.type(search, 'itau');

    await waitFor(() =>
      expect(
        screen.queryByText('fatura-nubank-08-2026.csv'),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText('extrato-itau-agosto.ofx')).toBeInTheDocument();
  });

  it('remove um registro com confirmação', async () => {
    const { user } = renderApp('/importacoes');

    await user.click(
      await screen.findByRole('button', {
        name: /remover extrato-itau-agosto\.ofx/i,
      }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: /sim, remover/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(
      screen.queryByText('extrato-itau-agosto.ofx'),
    ).not.toBeInTheDocument();
  });
});
