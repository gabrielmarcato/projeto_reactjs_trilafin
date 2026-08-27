import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField';
import { Tag } from '@/components/ui/Tag';
import { Kicker, Label } from '@/components/ui/Text';
import { DownloadIcon } from '@/components/icons';
import { downloadCsv } from '@/lib/export';
import { money, shortDate } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useAccountsStore } from '@/store/useAccountsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import type { Transaction } from '@/store/useTransactionsStore';

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

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

const FiltersHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  min-height: 38px;
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

const Band = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  margin-top: ${({ theme }) => theme.spacing(8)};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Cell = styled.div`
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  border-right: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  &:last-child {
    border-right: none;
  }
`;

const Value = styled.div<{ $tone: string }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.stat};
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  line-height: 1;
  color: ${({ $tone }) => $tone};
`;

const Results = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  margin-top: ${({ theme }) => theme.spacing(8)};
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

const PerPage = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  white-space: nowrap;
`;

const PerPageSelect = styled.select`
  height: 32px;
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
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
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
  padding: 12px ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: ${({ theme }) => theme.type.small};
  vertical-align: middle;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const Amount = styled.span<{ $tone: string }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $tone }) => $tone};
  white-space: nowrap;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(10)};
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const TYPE_OPTIONS: readonly SelectOption[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'entrada', label: 'Entradas' },
  { value: 'saida', label: 'Saídas' },
];

const PERIOD_OPTIONS: readonly SelectOption[] = [
  { value: 'tudo', label: 'Todo o período' },
  { value: 'mes', label: 'Mês atual (ago/2026)' },
  { value: 'trimestre', label: 'Últimos 3 meses' },
  { value: 'ano', label: '2026' },
  { value: 'personalizado', label: 'Personalizado' },
];

const PERIOD_RANGES: Record<string, { from: string; to: string }> = {
  mes: { from: '2026-08-01', to: '2026-08-31' },
  trimestre: { from: '2026-06-01', to: '2026-08-31' },
  ano: { from: '2026-01-01', to: '2026-12-31' },
};

const withAll = (label: string, items: { name: string }[]): SelectOption[] => [
  { value: '', label },
  ...items.map((i) => ({ value: i.name, label: i.name })),
];

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

/**
 * Tela de Relatórios: filtros precisos sobre as transações, resumo, quebra por
 * categoria, tabela de resultados e exportação em CSV.
 */
export function ReportsScreen() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const accounts = useAccountsStore((s) => s.accounts);
  const categories = useSettingsStore((s) => s.collections.categories);
  const paymentMethods = useSettingsStore((s) => s.collections.paymentMethods);
  const tags = useSettingsStore((s) => s.collections.tags);

  const [period, setPeriod] = useState('tudo');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [type, setType] = useState('todos');
  const [account, setAccount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tag, setTag] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const applyPeriod = (value: string) => {
    setPeriod(value);
    if (value === 'tudo') {
      setDateFrom('');
      setDateTo('');
    } else if (PERIOD_RANGES[value]) {
      setDateFrom(PERIOD_RANGES[value].from);
      setDateTo(PERIOD_RANGES[value].to);
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      if (type !== 'todos' && t.type !== type) return false;
      if (account && t.account !== account) return false;
      if (category && !t.categories.includes(category)) return false;
      if (paymentMethod && t.paymentMethod !== paymentMethod) return false;
      if (tag && !t.tags.includes(tag)) return false;
      if (minAmount && t.amount < Number(minAmount)) return false;
      if (maxAmount && t.amount > Number(maxAmount)) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [
    transactions,
    dateFrom,
    dateTo,
    type,
    account,
    category,
    paymentMethod,
    tag,
    minAmount,
    maxAmount,
    search,
  ]);

  const summary = useMemo(() => {
    const entradas = filtered
      .filter((t) => t.type === 'entrada')
      .reduce((s, t) => s + t.amount, 0);
    const saidas = filtered
      .filter((t) => t.type === 'saida')
      .reduce((s, t) => s + t.amount, 0);
    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      count: filtered.length,
    };
  }, [filtered]);

  // Paginação da tabela de resultados.
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    setPage(1);
  }, [filtered, pageSize]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const clearFilters = () => {
    setPeriod('tudo');
    setDateFrom('');
    setDateTo('');
    setType('todos');
    setAccount('');
    setCategory('');
    setPaymentMethod('');
    setTag('');
    setMinAmount('');
    setMaxAmount('');
    setSearch('');
  };

  const exportCsv = () => {
    const header = [
      'Data',
      'Descrição',
      'Tipo',
      'Valor',
      'Conta',
      'Categorias',
      'Forma de pagamento',
      'Etiquetas',
      'Tipo de orçamento',
    ];
    const rows = filtered.map((t) => [
      t.date,
      t.description,
      t.type === 'entrada' ? 'Entrada' : 'Saída',
      t.amount.toFixed(2).replace('.', ','),
      t.account,
      t.categories.join(', '),
      t.paymentMethod ?? '',
      t.tags.join(', '),
      t.budgetType ?? '',
    ]);
    downloadCsv('relatorio-trilhafin.csv', [header, ...rows]);
  };

  const amountView = (t: Transaction) =>
    t.type === 'entrada'
      ? { text: '+ ' + money(t.amount), tone: theme.colors.text }
      : { text: '− ' + money(t.amount), tone: theme.colors.accent };

  return (
    <>
      <Header>
        <HeaderText>
          <Kicker>Análise</Kicker>
          <Title>Relatórios</Title>
        </HeaderText>
        <Button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
        >
          <DownloadIcon />
          Exportar CSV
        </Button>
      </Header>

      <Card>
        <FiltersHead>
          <Label as="div">Filtros</Label>
          <Button type="button" $variant="ghost" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </FiltersHead>
        <FiltersGrid>
          <SelectField
            label="Período"
            name="period"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(e) => applyPeriod(e.target.value)}
          />
          <FieldWrap>
            <FieldLabel htmlFor="from">Data de</FieldLabel>
            <Input
              id="from"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPeriod('personalizado');
              }}
            />
          </FieldWrap>
          <FieldWrap>
            <FieldLabel htmlFor="to">Data até</FieldLabel>
            <Input
              id="to"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPeriod('personalizado');
              }}
            />
          </FieldWrap>
          <SelectField
            label="Tipo"
            name="type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <SelectField
            label="Conta"
            name="account"
            options={withAll('Todas as contas', accounts)}
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <SelectField
            label="Categoria"
            name="category"
            options={withAll('Todas as categorias', categories)}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <SelectField
            label="Forma de pagamento"
            name="paymentMethod"
            options={withAll('Todas', paymentMethods)}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <SelectField
            label="Etiqueta"
            name="tag"
            options={withAll('Todas', tags)}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <Field
            label="Valor mínimo"
            name="minAmount"
            type="number"
            min="0"
            step="0.01"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <Field
            label="Valor máximo"
            name="maxAmount"
            type="number"
            min="0"
            step="0.01"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
          <Field
            label="Buscar descrição"
            name="search"
            placeholder="Ex.: mercado"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FiltersGrid>
      </Card>

      <Band>
        <Cell>
          <Label as="div">Entradas</Label>
          <Value $tone={theme.colors.text}>{money(summary.entradas)}</Value>
        </Cell>
        <Cell>
          <Label as="div">Saídas</Label>
          <Value $tone={theme.colors.accent}>{money(summary.saidas)}</Value>
        </Cell>
        <Cell>
          <Label as="div">Saldo</Label>
          <Value
            $tone={summary.saldo >= 0 ? theme.colors.text : theme.colors.accent}
          >
            {money(summary.saldo)}
          </Value>
        </Cell>
        <Cell>
          <Label as="div">Lançamentos</Label>
          <Value $tone={theme.colors.text}>{summary.count}</Value>
        </Cell>
      </Band>

      <Results>
        {filtered.length === 0 ? (
          <Empty>Nenhum lançamento para os filtros selecionados.</Empty>
        ) : (
          <>
            <TableScroll>
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Descrição</Th>
                    <Th>Categorias</Th>
                    <Th>Conta</Th>
                    <Th $right>Valor</Th>
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
                        <Td>{t.description}</Td>
                        <Td>
                          {t.categories.map((c) => (
                            <Tag
                              key={c}
                              $variant="outline"
                              style={{ marginRight: 4 }}
                            >
                              {c}
                            </Tag>
                          ))}
                        </Td>
                        <Td>
                          <Muted>{t.account}</Muted>
                        </Td>
                        <Td $right>
                          <Amount $tone={view.tone}>{view.text}</Amount>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableScroll>
            <Foot>
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
      </Results>
    </>
  );
}
