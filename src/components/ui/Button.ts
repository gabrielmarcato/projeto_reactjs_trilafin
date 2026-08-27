import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Botão do design system Modernist.
 *
 * - `primary`: fill de acento sólido, tinta escura por cima.
 * - `secondary`: contorno de 1px, fundo transparente.
 * - `ghost`: só texto em acento, com tint no hover.
 *
 * Regras do sistema: Archivo 800, RAIO ZERO, e rótulo alinhado à esquerda em
 * botões largos (use `$block`). Uso: `<Button $variant="secondary">Filtros</Button>`.
 */
export const Button = styled.button<{
  $variant?: ButtonVariant;
  $block?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: ${({ $block }) => ($block ? 'flex-start' : 'center')};
  gap: ${({ theme }) => theme.spacing(2)};
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing(4)};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.small};
  line-height: 1.2;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  ${({ $block }) => $block && 'width: 100%;'}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background: ${theme.colors.surfaceHover};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.accentText};
          padding: 0 ${theme.spacing(2)};
          &:hover:not(:disabled) {
            background: ${theme.colors.accentSoftHover};
          }
        `;
      case 'danger':
        return css`
          background: transparent;
          border-color: ${theme.colors.danger};
          color: ${theme.colors.accentText};
          &:hover:not(:disabled) {
            background: ${theme.colors.accentSoft};
          }
        `;
      case 'primary':
      default:
        return css`
          background: ${theme.colors.accent};
          border-color: ${theme.colors.accent};
          color: ${theme.colors.onAccent};
          &:hover:not(:disabled) {
            background: ${theme.colors.accentHover};
            border-color: ${theme.colors.accentHover};
          }
        `;
    }
  }}
`;
