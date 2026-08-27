import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import { Kicker } from '@/components/ui/Text';
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from '@/components/icons';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { money, shortDate } from '@/lib/format';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import type { Transaction } from '@/store/useTransactionsStore';
import { toast } from '@/store/useToastStore';
import { theme } from '@/styles/theme';
import { ImportModal } from '@/features/imports/components/ImportModal';
import { TransactionModal } from '../components/TransactionModal';
import type { TransactionFormValues } from '../transactionSchema';

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

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.title};
  letter-spacing: ${({ theme }) => theme.tracking.display};
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  flex-wrap: wrap;
`;

const Search = styled.input`
  flex: 1;
  min-width: 200px;
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const PerPage = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const PerPageSelect = styled.select`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Foot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-top: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
  flex-wrap: wrap;
`;

const Pager = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  padding: 6px ${({ theme }) => theme.spacing(3)};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onAccent : theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.onAccent : theme.colors.text};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PAGE_SIZES = [10, 30, 60, 100];

/** Janela de até 7 números de página ao redor da página atual. */
function pageWindow(current: number, total: number): number[] {
  const size = 7;
  if (total <= size) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - Math.floor(size / 2));
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

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

/** Sinal + cor de exibição do valor conforme o tipo. */
function amountView(t: Transaction): { text: string; tone: string } {
  if (t.type === 'entrada') {
    return { text: '+ ' + money(t.amount), tone: theme.colors.text };
  }
  return { text: '− ' + money(t.amount), tone: theme.colors.accent };
}

/**
 * Tela de Transações. Mesmo padrão da tela de Configurações (header + conteúdo
 * na casca), mas o corpo é uma tabela como a da home — com múltiplas categorias
 * por linha e ações de editar/remover.
 */
export function TransactionsScreen() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const removeTransaction = useTransactionsStore((s) => s.removeTransaction);

  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [removing, setRemoving] = useState<Transaction | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  // Filtra por descrição, conta, categorias ou etiquetas.
  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return transactions;
    return transactions.filter((t) =>
      [
        t.description,
        t.account,
        t.paymentMethod ?? '',
        ...t.categories,
        ...t.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [transactions, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Volta à página 1 quando muda a busca ou o tamanho da página.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  // Mantém a página dentro do total (ex.: após remover itens).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setFormOpen(true);
  };

  const handleSubmit = (values: TransactionFormValues) => {
    const input = {
      description: values.description,
      date: values.date,
      type: values.type,
      amount: values.amount,
      account: values.account,
      categories: values.categories,
      tags: values.tags,
      paymentMethod: values.paymentMethod || undefined,
      budgetType: values.budgetType || undefined,
    };
    if (editing) {
      updateTransaction(editing.id, input);
      toast.success('Lançamento atualizado.');
    } else {
      addTransaction(input);
      toast.success('Lançamento adicionado.');
    }
  };

  return (
    <>
      <Header>
        <HeaderText>
          <Kicker>Movimentações</Kicker>
          <Title>Transações</Title>
        </HeaderText>
        <HeaderActions>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => setImportOpen(true)}
          >
            <UploadIcon />
            Importar
          </Button>
          <Button type="button" onClick={openAdd}>
            <PlusIcon />
            Novo lançamento
          </Button>
        </HeaderActions>
      </Header>

      <Card>
        <Toolbar>
          <Search
            type="search"
            placeholder="Buscar por descrição, conta, categoria ou etiqueta…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar transações"
          />
          <PerPage>
            Registros por página
            <PerPageSelect
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Registros por página"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </PerPageSelect>
          </PerPage>
        </Toolbar>

        {transactions.length === 0 ? (
          <Empty>Nenhuma transação cadastrada ainda.</Empty>
        ) : filtered.length === 0 ? (
          <Empty>Nenhum resultado para “{search}”.</Empty>
        ) : (
          <>
            <TableScroll>
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Descrição</Th>
                    <Th>Categorias</Th>
                    <Th>Etiquetas</Th>
                    <Th>Conta</Th>
                    <Th>Pagamento</Th>
                    <Th $right>Valor</Th>
                    <Th $right>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((t) => {
                    const view = amountView(t);
                    return (
                      <Tr key={t.id}>
                        <Td>
                          <Muted>{shortDate(t.date)}</Muted>
                        </Td>
                        <Td>
                          <Desc>{t.description}</Desc>
                        </Td>
                        <Td>
                          <Tags>
                            {t.categories.map((cat) => (
                              <Tag key={cat} $variant="outline">
                                {cat}
                              </Tag>
                            ))}
                          </Tags>
                        </Td>
                        <Td>
                          {t.tags.length ? (
                            <Tags>
                              {t.tags.map((tag) => (
                                <Tag key={tag} $variant="neutral">
                                  {tag}
                                </Tag>
                              ))}
                            </Tags>
                          ) : (
                            <Muted>—</Muted>
                          )}
                        </Td>
                        <Td>
                          <Muted>{t.account}</Muted>
                        </Td>
                        <Td>
                          <Muted>{t.paymentMethod ?? '—'}</Muted>
                        </Td>
                        <Td $right>
                          <Amount $tone={view.tone}>{view.text}</Amount>
                        </Td>
                        <Td $right>
                          <RowActions>
                            <IconButton
                              type="button"
                              onClick={() => openEdit(t)}
                              aria-label={`Editar ${t.description}`}
                            >
                              <PencilIcon />
                            </IconButton>
                            <IconButton
                              type="button"
                              onClick={() => setRemoving(t)}
                              aria-label={`Remover ${t.description}`}
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
            </TableScroll>
            <Foot>
              <span>
                Mostrando {start + 1}–
                {Math.min(start + pageSize, filtered.length)} de{' '}
                {filtered.length}
              </span>
              <Pager>
                <PageBtn
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </PageBtn>
                {pageWindow(page, totalPages).map((n) => (
                  <PageBtn
                    key={n}
                    type="button"
                    $active={n === page}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageBtn>
                ))}
                <PageBtn
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </PageBtn>
              </Pager>
            </Foot>
          </>
        )}
      </Card>

      <TransactionModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        transaction={editing}
        onSubmit={handleSubmit}
      />

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onConfirm={() => navigate({ to: '/importacoes/revisar' })}
      />

      <ConfirmDialog
        open={removing !== null}
        title="Remover lançamento"
        message={
          <>
            Tem certeza que deseja remover{' '}
            <strong>{removing?.description}</strong>? Esta ação não pode ser
            desfeita.
          </>
        }
        confirmLabel="Sim, remover"
        onConfirm={() => {
          if (removing) {
            removeTransaction(removing.id);
            toast.success('Lançamento removido.');
          }
        }}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
