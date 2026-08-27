import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import { Kicker } from '@/components/ui/Text';
import { PencilIcon, TrashIcon } from '@/components/icons';
import { money, shortDate } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import type { Transaction } from '@/store/useTransactionsStore';
import { useImportsStore } from '@/store/useImportsStore';
import { TransactionModal } from '@/features/transactions/components/TransactionModal';
import type { TransactionFormValues } from '@/features/transactions/transactionSchema';

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.title};
  letter-spacing: ${({ theme }) => theme.tracking.display};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ $right?: boolean }>`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  font-size: ${({ theme }) => theme.type.label};
  letter-spacing: ${({ theme }) => theme.tracking.kicker};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textFaint};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td<{ $right?: boolean }>`
  padding: 14px ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: ${({ theme }) => theme.type.small};
  vertical-align: middle;
`;

const Desc = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Amount = styled.span<{ $tone: string }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.body};
  letter-spacing: ${({ theme }) => theme.tracking.snug};
  color: ${({ $tone }) => $tone};
  white-space: nowrap;
`;

const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(10)};
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
`;

// Movimentações "lidas do arquivo" (mock): trazem data/descrição/valor/tipo,
// mas sem conta e categorias — o usuário completa manualmente.
const READ_MOVEMENTS: Omit<Transaction, 'id'>[] = [
  {
    date: '2026-08-19',
    description: 'PIX RECEBIDO - JOAO SILVA',
    type: 'entrada',
    amount: 250,
    account: '',
    categories: [],
    tags: [],
  },
  {
    date: '2026-08-18',
    description: 'IFOOD *IFOOD',
    type: 'saida',
    amount: 63.9,
    account: '',
    categories: [],
    tags: [],
  },
  {
    date: '2026-08-18',
    description: 'POSTO SHELL 1234',
    type: 'saida',
    amount: 180,
    account: '',
    categories: [],
    tags: [],
  },
  {
    date: '2026-08-17',
    description: 'SPOTIFY BR',
    type: 'saida',
    amount: 21.9,
    account: '',
    categories: [],
    tags: [],
  },
  {
    date: '2026-08-16',
    description: 'TED ENVIADA MARIA',
    type: 'saida',
    amount: 500,
    account: '',
    categories: [],
    tags: [],
  },
];

function isReady(row: Transaction): boolean {
  return row.categories.length > 0 && row.account !== '';
}

function amountView(t: Transaction): { text: string; tone: string } {
  if (t.type === 'entrada') {
    return { text: '+ ' + money(t.amount), tone: theme.colors.text };
  }
  return { text: '− ' + money(t.amount), tone: theme.colors.accent };
}

/**
 * Tela de revisão da importação. Lista as movimentações lidas do arquivo; o
 * usuário completa os dados manuais (conta, categorias, forma de pagamento…)
 * via modal e confirma a entrada dos prontos na lista de transações.
 */
export function ImportReviewScreen() {
  const navigate = useNavigate();
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const addImport = useImportsStore((s) => s.addImport);
  const pendingImport = useImportsStore((s) => s.pendingImport);
  const setPendingImport = useImportsStore((s) => s.setPendingImport);

  const [rows, setRows] = useState<Transaction[]>(() =>
    READ_MOVEMENTS.map((m, i) => ({
      id: `read-${i}`,
      ...m,
      // Já pré-preenche a conta escolhida no modal (etapa 1).
      account: pendingImport?.account ?? '',
    })),
  );
  const [editing, setEditing] = useState<Transaction | null>(null);

  const readyCount = rows.filter(isReady).length;

  const handleComplete = (values: TransactionFormValues) => {
    if (!editing) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              date: values.date,
              description: values.description,
              type: values.type,
              amount: values.amount,
              account: values.account,
              categories: values.categories,
              tags: values.tags,
              paymentMethod: values.paymentMethod || undefined,
              budgetType: values.budgetType || undefined,
            }
          : r,
      ),
    );
  };

  const confirm = () => {
    const ready = rows.filter(isReady);
    ready.forEach((r) =>
      addTransaction({
        date: r.date,
        description: r.description,
        type: r.type,
        amount: r.amount,
        account: r.account,
        categories: r.categories,
        tags: r.tags,
        paymentMethod: r.paymentMethod,
        budgetType: r.budgetType,
      }),
    );
    addImport({
      fileName: pendingImport?.fileName ?? 'importação',
      format: pendingImport?.format ?? '—',
      account: pendingImport?.account ?? ready[0]?.account ?? '—',
      source: pendingImport?.source ?? 'Extrato bancário',
      date: '2026-08-26',
      records: ready.length,
      status: 'concluida',
    });
    setPendingImport(null);
    navigate({ to: '/transacoes' });
  };

  return (
    <>
      <Header>
        <HeaderText>
          <Kicker>Importação</Kicker>
          <Title>Revisar importação</Title>
          <Subtitle>
            {pendingImport ? (
              <>
                Arquivo <strong>{pendingImport.fileName}</strong>.{' '}
              </>
            ) : null}
            {rows.length} movimentações lidas · {readyCount} prontas ·{' '}
            {rows.length - readyCount} pendentes. Complete conta e categorias de
            cada uma para importá-las.
          </Subtitle>
        </HeaderText>
        <HeaderActions>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => {
              setPendingImport(null);
              navigate({ to: '/importacoes' });
            }}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={confirm} disabled={readyCount === 0}>
            Confirmar importação ({readyCount})
          </Button>
        </HeaderActions>
      </Header>

      <Card>
        {rows.length === 0 ? (
          <Empty>Nenhuma movimentação para revisar.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Descrição</Th>
                <Th $right>Valor</Th>
                <Th>Conta</Th>
                <Th>Categorias</Th>
                <Th>Status</Th>
                <Th $right>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const view = amountView(row);
                const ready = isReady(row);
                return (
                  <Tr key={row.id}>
                    <Td>
                      <Muted>{shortDate(row.date)}</Muted>
                    </Td>
                    <Td>
                      <Desc>{row.description}</Desc>
                    </Td>
                    <Td $right>
                      <Amount $tone={view.tone}>{view.text}</Amount>
                    </Td>
                    <Td>
                      {row.account ? (
                        <Muted>{row.account}</Muted>
                      ) : (
                        <Muted>—</Muted>
                      )}
                    </Td>
                    <Td>
                      {row.categories.length ? (
                        <Tags>
                          {row.categories.map((c) => (
                            <Tag key={c} $variant="outline">
                              {c}
                            </Tag>
                          ))}
                        </Tags>
                      ) : (
                        <Muted>—</Muted>
                      )}
                    </Td>
                    <Td>
                      <Tag $variant={ready ? 'neutral' : 'outlineAccent'}>
                        {ready ? 'Pronto' : 'Pendente'}
                      </Tag>
                    </Td>
                    <Td $right>
                      <RowActions>
                        <IconButton
                          type="button"
                          onClick={() => setEditing(row)}
                          aria-label={`Completar ${row.description}`}
                        >
                          <PencilIcon />
                        </IconButton>
                        <IconButton
                          type="button"
                          onClick={() =>
                            setRows((prev) =>
                              prev.filter((r) => r.id !== row.id),
                            )
                          }
                          aria-label={`Descartar ${row.description}`}
                        >
                          <TrashIcon />
                        </IconButton>
                      </RowActions>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      <TransactionModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        transaction={editing}
        onSubmit={handleComplete}
      />
    </>
  );
}
