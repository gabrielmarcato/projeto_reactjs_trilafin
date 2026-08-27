import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { renderApp } from '@/test/test-utils';

async function openProfile(user: ReturnType<typeof renderApp>['user']) {
  await user.click(
    await screen.findByRole('button', { name: /menu do usuário/i }),
  );
  await user.click(screen.getByRole('menuitem', { name: /^conta$/i }));
  return screen.findByRole('dialog');
}

describe('ProfileModal', () => {
  it('abre a conta pelo menu com os dados do perfil', async () => {
    const { user } = renderApp('/');

    const dialog = await openProfile(user);
    expect(
      within(dialog).getByRole('heading', { name: /minha conta/i }),
    ).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/nome completo/i)).toHaveValue(
      'Marina Ribeiro',
    );
    expect(within(dialog).getByLabelText(/e-mail/i)).toHaveValue(
      'marina@trilhafin.dev',
    );
  });

  it('valida o CPF', async () => {
    const { user } = renderApp('/');

    const dialog = await openProfile(user);
    await user.type(
      within(dialog).getByLabelText('CPF'),
      '111.111.111-11', // dígitos repetidos → inválido
    );
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    expect(
      await within(dialog).findByText(/cpf inválido/i),
    ).toBeInTheDocument();
  });

  it('salva e atualiza as iniciais do avatar', async () => {
    const { user } = renderApp('/');

    const trigger = await screen.findByRole('button', {
      name: /menu do usuário/i,
    });
    expect(trigger).toHaveTextContent('MR');

    const dialog = await openProfile(user);
    const name = within(dialog).getByLabelText(/nome completo/i);
    await user.clear(name);
    await user.type(name, 'Ana Lima');
    await user.click(within(dialog).getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: /menu do usuário/i }),
    ).toHaveTextContent('AL');
  });
});
