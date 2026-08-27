import styled, { css } from 'styled-components';

type TagVariant = 'accent' | 'neutral' | 'outline' | 'outlineAccent';

/**
 * Etiqueta pequena (badge). Variantes tiradas das rampas do Modernist.
 * Sem raio, caixa levemente espaçada. Uso: `<Tag $variant="accent">Vencendo</Tag>`.
 */
export const Tag = styled.span<{ $variant?: TagVariant }>`
  display: inline-flex;
  align-items: center;
  font-size: ${({ theme }) => theme.type.kicker};
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  white-space: nowrap;

  ${({ $variant = 'neutral', theme }) => {
    switch ($variant) {
      case 'accent':
        return css`
          background: ${theme.colors.accentSoft};
          color: ${theme.colors.accentTextHover};
        `;
      case 'outline':
        return css`
          border-color: ${theme.colors.border};
          color: ${theme.colors.textMuted};
        `;
      case 'outlineAccent':
        return css`
          border-color: ${theme.colors.accent};
          color: ${theme.colors.accentText};
        `;
      case 'neutral':
      default:
        return css`
          background: ${theme.colors.borderSubtle};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;
