import styled from 'styled-components';

/**
 * "Kicker": rótulo curto em caixa-alta com tracking largo, na cor de acento.
 * Abre seções no padrão Modernist (ex.: "VISÃO GERAL — AGOSTO 2026").
 */
export const Kicker = styled.div`
  font-size: ${({ theme }) => theme.type.kicker};
  letter-spacing: ${({ theme }) => theme.tracking.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

/** Rótulo neutro em caixa-alta (cabeçalhos de coluna, seções da sidebar). */
export const Label = styled.div`
  font-size: ${({ theme }) => theme.type.label};
  letter-spacing: ${({ theme }) => theme.tracking.label};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textFaint};
`;

/** Título de card/seção (Archivo 800, 17px). */
export const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.heading};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;
