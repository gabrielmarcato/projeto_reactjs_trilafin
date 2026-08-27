import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

describe('ReportsScreen', () => {
  it('mostra filtros, resumo e a tabela de resultados', async () => {
    renderApp('/relatorios');

    expect(
      await screen.findByRole('heading', { name: 'Relatórios' }),
    ).toBeInTheDocument();
    // Filtros
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Conta')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText(/valor mínimo/i)).toBeInTheDocument();
    // Botão exportar
    expect(
      screen.getByRole('button', { name: /exportar csv/i }),
    ).toBeInTheDocument();
    // Um lançamento aparece na tabela de resultados
    expect(screen.getByText('Salário — Vector Studio')).toBeInTheDocument();
  });

  it('filtra por tipo (saídas)', async () => {
    const { user } = renderApp('/relatorios');

    await user.selectOptions(await screen.findByLabelText('Tipo'), 'saida');

    // Entradas somem da tabela; saídas permanecem.
    expect(
      screen.queryByText('Salário — Vector Studio'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Aluguel Vila Madalena')).toBeInTheDocument();
  });

  it('exporta CSV com os resultados filtrados', async () => {
    // jsdom não implementa createObjectURL; definimos para o clique não quebrar.
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    const createURL = vi.fn(() => 'blob:mock');
    URL.createObjectURL = createURL as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    const { user } = renderApp('/relatorios');
    await user.click(
      await screen.findByRole('button', { name: /exportar csv/i }),
    );

    expect(createURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
    clickSpy.mockRestore();
  });
});
