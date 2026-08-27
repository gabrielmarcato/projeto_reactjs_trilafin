/**
 * Design tokens do Trilha.Fin — variante DARK do design system "Modernist".
 *
 * Traços do sistema: fundo quase-preto, tinta clara, um único acento coral
 * (#ff563c), Archivo em todo lugar, RAIO ZERO (cantos retos) e réguas fortes
 * de 2px. Rótulos em caixa-alta com tracking largo; números e títulos em
 * Archivo 800 com letter-spacing negativo.
 *
 * Este objeto é a única fonte de verdade da aparência. O tipo `AppTheme` é
 * derivado dele e injetado no `DefaultTheme` do styled-components
 * (ver `styled.d.ts`), então todo `${({ theme }) => ...}` fica tipado.
 */
export const theme = {
  colors: {
    // — ground & superfícies (dark) —
    background: '#100f0e',
    surface: '#151312',
    surfaceAlt: '#1c1a19',
    surfaceHover: '#232120',
    avatar: '#2d2b2b',

    // — réguas / bordas —
    border: '#3d3937', // borda padrão (controles)
    borderStrong: '#35312f', // divisores de seção (2px)
    borderSubtle: '#262322', // linhas internas (listas, tabelas)

    // — tinta (texto), claro sobre escuro —
    text: '#f3f2f2',
    textBright: '#eae7e7',
    textSecondary: '#d7d3d3',
    textTertiary: '#bab6b6',
    textMuted: '#9b9797',
    textFaint: '#7d7979',
    textFaintest: '#605d5d',

    // — acento (coral-red) —
    accent: '#ff563c',
    accentHover: '#dd2b0f',
    accentText: '#ff7a64', // acento para texto/links sobre dark
    accentTextHover: '#ff9783',
    accentSoft: 'rgba(255,86,60,0.16)', // fill tênue (tags/alertas)
    accentSoftHover: 'rgba(255,86,60,0.12)',
    onAccent: '#100f0e', // tinta sobre fundo de acento

    // — aliases semânticos (compat. com componentes genéricos) —
    primary: '#ff563c',
    primaryHover: '#dd2b0f',
    success: '#6fae8f',
    danger: '#ff563c',
    dangerSurface: 'rgba(255,86,60,0.16)',
  },

  /** Famílias — Archivo para título e corpo (carregada no GlobalStyle). */
  fonts: {
    heading: '"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif',
    body: '"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif',
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 800,
  },

  /** Escala rem genérica (usada por componentes utilitários). */
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
  },

  /** Escala tipográfica em px do layout (grid modernista é pixel-preciso). */
  type: {
    display: '52px',
    title: '32px',
    heading: '17px',
    stat: '34px',
    amount: '16px',
    body: '15px',
    small: '13px',
    micro: '12px',
    label: '10px',
    kicker: '11px',
  },

  /** Tracking (letter-spacing) recorrente no sistema. */
  tracking: {
    display: '-0.03em',
    tight: '-0.035em',
    snug: '-0.02em',
    label: '0.14em',
    kicker: '0.12em',
  },

  /** Passo base de 4px (space-1..space-8 do Modernist). */
  spacing: (multiplier: number) => `${multiplier * 4}px`,

  /** RAIO ZERO — regra do Modernist: nenhum canto é arredondado. */
  radius: {
    sm: '0px',
    md: '0px',
    lg: '0px',
  },

  /** Espessura das réguas. */
  rule: {
    hairline: '1px',
    strong: '2px',
  },

  shadows: {
    card: '0 1px 2px rgba(0,0,0,0.35)',
    lg: '0 12px 32px rgba(0,0,0,0.45)',
  },
} as const;

export type AppTheme = typeof theme;
