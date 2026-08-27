import styled from 'styled-components';

const Track = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  background: ${({ theme }) => theme.colors.borderSubtle};
`;

const Fill = styled.div<{ $pct: string; $tone: string; $height: number }>`
  height: ${({ $height }) => $height}px;
  width: ${({ $pct }) => $pct};
  background: ${({ $tone }) => $tone};
`;

export interface ProgressBarProps {
  /** Percentual preenchido, ex.: "78%". */
  pct: string;
  /** Cor da barra (token do tema já resolvido). */
  tone: string;
  /** Altura em px (padrão 6). */
  height?: number;
}

/**
 * Barra de progresso reta (sem raio) usada em orçamentos e categorias.
 * Puramente visual; o valor textual acompanha ao lado no layout.
 */
export function ProgressBar({ pct, tone, height = 6 }: ProgressBarProps) {
  return (
    <Track $height={height} role="presentation">
      <Fill $pct={pct} $tone={tone} $height={height} />
    </Track>
  );
}
