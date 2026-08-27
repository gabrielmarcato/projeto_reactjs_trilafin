import 'styled-components';
import type { AppTheme } from './theme';

/**
 * Estende a interface `DefaultTheme` do styled-components para que
 * `props.theme` seja fortemente tipado com o nosso `AppTheme`.
 *
 * Com isso, dentro de qualquer `styled.x` o autocomplete conhece
 * `theme.colors.primary`, `theme.spacing(2)`, etc.
 */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
