import styled from 'styled-components';
import { SectionTitle } from '@/components/ui/Text';
import { theme } from '@/styles/theme';
import { flow } from '../data';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 4px;
`;

const Legend = styled.div`
  display: flex;
  gap: 18px;
  font-size: ${({ theme }) => theme.type.kicker};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LegendItem = styled.span<{ $tone: string }>`
  display: flex;
  align-items: center;
  gap: 7px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    background: ${({ $tone }) => $tone};
  }
`;

const Bars = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 18px;
  align-items: end;
  height: 220px;
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
`;

const BarPair = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 100%;
`;

const BarIn = styled.div<{ $h: string }>`
  flex: 1;
  background: ${({ theme }) => theme.colors.textBright};
  height: ${({ $h }) => $h};
`;

const BarOut = styled.div<{ $h: string }>`
  flex: 1;
  background: ${({ theme }) => theme.colors.accent};
  height: ${({ $h }) => $h};
`;

const Axis = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 18px;
  margin-top: -14px;
`;

const AxisLabel = styled.div`
  font-size: ${({ theme }) => theme.type.kicker};
  color: ${({ theme }) => theme.colors.textFaint};
  letter-spacing: 0.06em;
`;

/** Gráfico de barras entradas × saídas dos últimos 8 meses. */
export function CashFlowCard() {
  return (
    <Card>
      <Head>
        <div>
          <SectionTitle>Fluxo de caixa</SectionTitle>
          <Sub>Entradas e saídas, últimos 8 meses</Sub>
        </div>
        <Legend>
          <LegendItem $tone={theme.colors.textBright}>Entradas</LegendItem>
          <LegendItem $tone={theme.colors.accent}>Saídas</LegendItem>
        </Legend>
      </Head>

      <Bars>
        {flow.map((f) => (
          <BarPair key={f.month}>
            <BarIn $h={f.inH} />
            <BarOut $h={f.outH} />
          </BarPair>
        ))}
      </Bars>
      <Axis>
        {flow.map((f) => (
          <AxisLabel key={f.month}>{f.month}</AxisLabel>
        ))}
      </Axis>
    </Card>
  );
}
