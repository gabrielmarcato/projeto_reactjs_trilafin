import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { Tag } from '@/components/ui/Tag';
import { SectionTitle } from '@/components/ui/Text';
import { money, shortDate } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import type { Transaction } from '@/store/useTransactionsStore';

const RECENT_LIMIT = 6;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  flex-wrap: wrap;
`;

const SeeAll = styled(Link)`
  font-size: ${({ theme }) => theme.type.small};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.accentText};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accentTextHover};
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderStrong};
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

const Foot = styled.div`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-top: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(10)};
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
`;

function amountView(t: Transaction): { text: string; tone: string } {
  if (t.type === 'entrada') {
    return { text: '+ ' + money(t.amount), tone: theme.colors.text };
  }
  return { text: '− ' + money(t.amount), tone: theme.colors.accent };
}

/**
 * Transações recentes (somente visualização) — as últimas por data, lidas da
 * store real. As ações de editar/remover ficam na tela de Transações.
 */
export function TransactionsCard() {
  const transactions = useTransactionsStore((s) => s.transactions);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, RECENT_LIMIT),
    [transactions],
  );

  return (
    <Card>
      <Head>
        <SectionTitle style={{ marginRight: 'auto' }}>
          Transações recentes
        </SectionTitle>
        <SeeAll to="/transacoes">Ver todas</SeeAll>
      </Head>

      {recent.length === 0 ? (
        <Empty>Sem lançamentos recentes.</Empty>
      ) : (
        <>
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
              {recent.map((t) => {
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
                      {t.categories.length ? (
                        <Tags>
                          {t.categories.map((c) => (
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
          <Foot>
            Mostrando {recent.length} de {transactions.length}{' '}
            {transactions.length === 1 ? 'lançamento' : 'lançamentos'}
          </Foot>
        </>
      )}
    </Card>
  );
}
