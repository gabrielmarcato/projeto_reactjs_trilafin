import styled from 'styled-components';

/**
 * Superfície de conteúdo do Modernist: fill de superfície, borda forte de 1px,
 * sem raio. Nada flutua — a borda organiza. Use para agrupar seções.
 */
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(6)};
`;
