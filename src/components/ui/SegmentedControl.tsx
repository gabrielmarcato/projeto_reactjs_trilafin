import styled from 'styled-components';

const Group = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Segment = styled.button<{ $active: boolean }>`
  padding: 9px 18px;
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onAccent : theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.onAccent : theme.colors.text};
  }
`;

export interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Rótulo acessível do grupo. */
  ariaLabel?: string;
}

/**
 * Controle segmentado do Modernist (segmento ativo em fill claro).
 * Ex.: alternar Semana / Mês / Ano. Genérico sobre o tipo das opções.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <Group role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <Segment
          key={option}
          type="button"
          role="tab"
          aria-selected={option === value}
          $active={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </Segment>
      ))}
    </Group>
  );
}
