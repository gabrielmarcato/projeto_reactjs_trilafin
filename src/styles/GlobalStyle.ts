import { createGlobalStyle } from 'styled-components';

/**
 * Reset leve + base do Trilha.Fin. Carrega a Archivo (Google Fonts) e aplica
 * o ground escuro, seleção com tinta de acento e foco de teclado temático
 * (regra do Modernist: nunca o anel azul padrão do browser).
 *
 * Consome tokens do tema, então precisa ficar dentro do `ThemeProvider`.
 */
export const GlobalStyle = createGlobalStyle`
  /* A fonte Archivo é carregada via <link> no index.html — o styled-components
     desaconselha importar folhas de estilo dentro do createGlobalStyle. */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.type.body};
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: 1.12;
    letter-spacing: ${({ theme }) => theme.tracking.snug};
  }

  a {
    color: ${({ theme }) => theme.colors.accentText};
    text-decoration: none;
  }
  a:hover {
    color: ${({ theme }) => theme.colors.accentTextHover};
  }

  button {
    font-family: ${({ theme }) => theme.fonts.heading};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
