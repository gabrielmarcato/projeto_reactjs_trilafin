import { createRoute } from '@tanstack/react-router';
import { ImportReviewScreen } from '@/features/imports/screens/ImportReviewScreen';
import { shellRoute } from './shell.route';

/** Rota "/importacoes/revisar" — revisão das movimentações lidas do arquivo. */
export const importReviewRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/importacoes/revisar',
  component: ImportReviewScreen,
});
