import styled from 'styled-components';
import { Label } from '@/components/ui/Text';
import { stats } from '../data';

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

/** Faixa de 4 indicadores-chave (patrimônio, entradas, saídas, poupança). */
export function StatBand() {
  return (
    <Band>
      {stats.map((s) => (
        <Cell key={s.label}>
          <Label as="div">{s.label}</Label>
          <Value $tone={s.tone}>{s.value}</Value>
          <Delta>{s.delta}</Delta>
        </Cell>
      ))}
    </Band>
  );
}
