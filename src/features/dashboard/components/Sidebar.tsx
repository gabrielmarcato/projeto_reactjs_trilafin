import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Text';
import { PlusIcon } from '@/components/icons';
import { money } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useAccountsStore } from '@/store/useAccountsStore';
import type { Account } from '@/store/useAccountsStore';
import { AccountModal } from './AccountModal';

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: 0 ${({ theme }) => theme.spacing(6)}
    ${({ theme }) => theme.spacing(4)};
`;

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountRow = styled.button`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const AccountHead = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const AccountName = styled.span`
  font-size: ${({ theme }) => theme.type.small};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textBright};
`;

const AccountKind = styled.span`
  font-size: ${({ theme }) => theme.type.label};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textFaint};
`;

const AccountAmount = styled.span<{ $tone: string }>`
  display: block;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.amount};
  letter-spacing: ${({ theme }) => theme.tracking.snug};
  color: ${({ $tone }) => $tone};
`;

/** Valor formatado + cor de exibição de uma conta (cartão soma como fatura). */
function accountView(acc: Account): { amount: string; tone: string } {
  if (acc.type === 'cartao') {
    return { amount: '− ' + money(acc.balance), tone: theme.colors.accent };
  }
  return { amount: money(acc.balance), tone: theme.colors.text };
}

/** Barra lateral: saldos por conta, com cadastro/edição de contas. */
export function Sidebar() {
  const accounts = useAccountsStore((s) => s.accounts);
  const [isModalOpen, setModalOpen] = useState(false);
  // Conta em edição; null = modo de criação.
  const [editing, setEditing] = useState<Account | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setModalOpen(true);
  };

  return (
    <>
      <GroupHeader>
        <Label as="div" style={{ marginRight: 'auto' }}>
          Contas
        </Label>
        <IconButton
          type="button"
          onClick={openCreate}
          aria-label="Adicionar conta"
          title="Adicionar conta"
        >
          <PlusIcon />
        </IconButton>
      </GroupHeader>

      <AccountList>
        {accounts.map((acc) => {
          const view = accountView(acc);
          return (
            <AccountRow
              key={acc.id}
              type="button"
              onClick={() => openEdit(acc)}
              aria-label={`Editar conta ${acc.name}`}
            >
              <AccountHead>
                <AccountName>{acc.name}</AccountName>
                <AccountKind>{acc.bank}</AccountKind>
              </AccountHead>
              <AccountAmount $tone={view.tone}>{view.amount}</AccountAmount>
            </AccountRow>
          );
        })}
      </AccountList>

      <AccountModal
        open={isModalOpen}
        account={editing}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
