import { useMemo } from 'react';
import styled from 'styled-components';
import { Label } from '@/components/ui/Text';
import { money } from '@/lib/format';
import { theme } from '@/styles/theme';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import {
  filterByPeriod,
  PERIOD_CAPTION,
  summarize,
  type Period,
} from '../aggregate';

const Band = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};

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

const Delta = styled.div`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/**
 * Faixa de 4 indicadores da home, calculados das transações reais no período
 * selecionado: Entradas, Saídas, Saldo e Lançamentos. Reativa — qualquer
 * mudança nas transações reflete aqui na hora (a store é a fonte).
 */
export function StatBand({ period }: { period: Period }) {
  const transactions = useTransactionsStore((s) => s.transactions);

  const summary = useMemo(
    () => summarize(filterByPeriod(transactions, period)),
    [transactions, period],
  );

  return (
    <Band>
      <Cell>
        <Label as="div">Entradas</Label>
        <Value $tone={theme.colors.text}>{money(summary.entradas)}</Value>
        <Delta>
          {plural(summary.countEntradas, 'lançamento', 'lançamentos')}
        </Delta>
      </Cell>
      <Cell>
        <Label as="div">Saídas</Label>
        <Value $tone={theme.colors.accent}>{money(summary.saidas)}</Value>
        <Delta>
          {plural(summary.countSaidas, 'lançamento', 'lançamentos')}
        </Delta>
      </Cell>
      <Cell>
        <Label as="div">Saldo</Label>
        <Value
          $tone={summary.saldo >= 0 ? theme.colors.text : theme.colors.accent}
        >
          {money(summary.saldo)}
        </Value>
        <Delta>entradas − saídas</Delta>
      </Cell>
      <Cell>
        <Label as="div">Lançamentos</Label>
        <Value $tone={theme.colors.text}>{summary.count}</Value>
        <Delta>{PERIOD_CAPTION[period]}</Delta>
      </Cell>
    </Band>
  );
}
