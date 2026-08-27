import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('ImportReviewScreen', () => {
  it('escolhe o arquivo no modal e abre a revisão com as movimentações', async () => {
    const { user } = renderApp('/importacoes');

    await user.click(await screen.findByRole('button', { name: /importar/i }));

    // Etapa 1: modal de seleção de arquivo.
    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByLabelText(/arquivo de importação/i);
    await user.upload(
      input,
      new File(['conteudo'], 'extrato-itau.ofx', { type: 'text/plain' }),
    );
    await user.click(
      within(dialog).getByRole('button', { name: /continuar/i }),
    );

    // Etapa 2: tela de revisão, com o nome do arquivo e as movimentações.
    expect(
      await screen.findByRole('heading', { name: /revisar importação/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('extrato-itau.ofx')).toBeInTheDocument();
    expect(screen.getByText('PIX RECEBIDO - JOAO SILVA')).toBeInTheDocument();
  });

  it('completa uma movimentação e confirma a importação', async () => {
    const { user } = renderApp('/importacoes/revisar');

    await user.click(
      await screen.findByRole('button', {
        name: /completar PIX RECEBIDO - JOAO SILVA/i,
      }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Receita' }));
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    await user.click(
      screen.getByRole('button', { name: /confirmar importação \(1\)/i }),
    );

    expect(
      await screen.findByRole('heading', { name: 'Transações' }),
    ).toBeInTheDocument();
    expect(screen.getByText('PIX RECEBIDO - JOAO SILVA')).toBeInTheDocument();
  });
});
