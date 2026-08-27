import styled from 'styled-components';

/**
 * Botão quadrado só-ícone (padrão Modernist: 1px de borda, sem raio).
 * Use com um ícone de `@/components/icons` dentro.
 */
export const IconButton = styled.button<{ $size?: number }>`
  width: ${({ $size = 28 }) => $size}px;
  height: ${({ $size = 28 }) => $size}px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
