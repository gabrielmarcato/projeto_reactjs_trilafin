import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('TransactionsScreen', () => {
  it('mostra a tabela com transações de mais de uma categoria', async () => {
    renderApp('/transacoes');

    expect(
      await screen.findByRole('heading', { name: 'Transações' }),
    ).toBeInTheDocument();

    const row = screen.getByText('Mercado Oba Hortifruti').closest('tr');
    expect(row).not.toBeNull();
    expect(
      within(row as HTMLElement).getByText('Alimentação'),
    ).toBeInTheDocument();
    expect(within(row as HTMLElement).getByText('Outros')).toBeInTheDocument();
  });

  it('tem busca e seletor de registros por página (10 padrão)', async () => {
    renderApp('/transacoes');

    expect(await screen.findByLabelText(/registros por página/i)).toHaveValue(
      '10',
    );
    expect(screen.getByText(/mostrando 1.7 de 7/i)).toBeInTheDocument();
  });

  it('filtra a tabela pela busca', async () => {
    const { user } = renderApp('/transacoes');

    const search = await screen.findByLabelText(/buscar transações/i);
    await user.type(search, 'Aluguel');

    await waitFor(() =>
      expect(
        screen.queryByText('Salário — Vector Studio'),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Aluguel Vila Madalena')).toBeInTheDocument();
  });

  it('adiciona uma transação com múltiplas categorias', async () => {
    const { user } = renderApp('/transacoes');

    await user.click(
      await screen.findByRole('button', { name: /novo lançamento/i }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText(/descrição/i),
      'Livros e curso',
    );
    await user.type(within(dialog).getByLabelText(/valor/i), '250');
    await user.click(
      within(dialog).getByRole('checkbox', { name: 'Educação' }),
    );
    await user.click(within(dialog).getByRole('checkbox', { name: 'Lazer' }));
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Livros e curso')).toBeInTheDocument();
  });

  it('exige ao menos uma categoria', async () => {
    const { user } = renderApp('/transacoes');

    await user.click(
      await screen.findByRole('button', { name: /novo lançamento/i }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText(/descrição/i),
      'Sem categoria',
    );
    await user.type(within(dialog).getByLabelText(/valor/i), '10');
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar' }));

    expect(
      await within(dialog).findByText(/selecione ao menos uma categoria/i),
    ).toBeInTheDocument();
  });

  it('remove uma transação com confirmação', async () => {
    const { user } = renderApp('/transacoes');

    await user.click(
      await screen.findByRole('button', {
        name: /remover Aluguel Vila Madalena/i,
      }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: /sim, remover/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.queryByText('Aluguel Vila Madalena')).not.toBeInTheDocument();
  });
});
