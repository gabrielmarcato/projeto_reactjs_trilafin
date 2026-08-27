import { createRoute } from '@tanstack/react-router';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { shellRoute } from './shell.route';

/** Rota "/configuracoes" — Configurações, dentro da casca (só o miolo muda). */
export const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/configuracoes',
  component: SettingsScreen,
});
