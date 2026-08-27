import { useMemo } from 'react';
import styled from 'styled-components';
import { SectionTitle } from '@/components/ui/Text';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { money } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import {
  filterByPeriod,
  summarize,
  topCategories,
  type Period,
} from '../aggregate';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 4px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const Name = styled.span`
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textBright};
`;

const Amount = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(8)} 0;
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

// Tons que decrescem conforme o ranking (destaque no topo).
const TONES = [
  theme.colors.textBright,
  theme.colors.accent,
  theme.colors.textMuted,
  theme.colors.textMuted,
  theme.colors.textFaintest,
  theme.colors.textFaintest,
];

/** "Para onde foi": top 6 categorias de despesa do período, das transações. */
export function CategoriesCard({ period }: { period: Period }) {
  const transactions = useTransactionsStore((s) => s.transactions);

  const { rows, totalSaidas } = useMemo(() => {
    const inPeriod = filterByPeriod(transactions, period);
    return {
      rows: topCategories(inPeriod, 6),
      totalSaidas: summarize(inPeriod).saidas,
    };
  }, [transactions, period]);

  return (
    <Card>
      <div>
        <SectionTitle>Para onde foi</SectionTitle>
        <Sub>
          {rows.length
            ? `${money(totalSaidas)} em despesas`
            : 'Ranking das categorias de despesa'}
        </Sub>
      </div>
      {rows.length === 0 ? (
        <Empty>Sem despesas no período.</Empty>
      ) : (
        <List>
          {rows.map((c, i) => (
            <Row key={c.label}>
              <Head>
                <Name>{c.label}</Name>
                <Amount>{money(c.amount)}</Amount>
              </Head>
              <ProgressBar
                pct={c.pct}
                tone={TONES[i] ?? theme.colors.textFaintest}
                height={4}
              />
            </Row>
          ))}
        </List>
      )}
    </Card>
  );
}
