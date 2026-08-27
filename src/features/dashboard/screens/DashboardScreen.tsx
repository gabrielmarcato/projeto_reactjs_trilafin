import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Kicker } from '@/components/ui/Text';
import { StatBand } from '../components/StatBand';
import { CashFlowCard } from '../components/CashFlowCard';
import { CategoriesCard } from '../components/CategoriesCard';
import { TransactionsCard } from '../components/TransactionsCard';
import { PERIODS, type Period } from '../aggregate';
import * as S from './DashboardScreen.styles';

/**
 * Conteúdo central da home (dashboard). Renderiza dentro da casca da aplicação
 * (`ShellLayout` → Topbar + Sidebar), no `<Outlet />` — por isso NÃO inclui o
 * chrome aqui.
 */
export function DashboardScreen() {
  const [period, setPeriod] = useState<Period>('Mês');

  return (
    <>
      <S.Hero>
        <div>
          <Kicker>Visão geral — Agosto 2026</Kicker>
        </div>
        <SegmentedControl
          options={PERIODS}
          value={period}
          onChange={setPeriod}
          ariaLabel="Período"
        />
      </S.Hero>

      <StatBand period={period} />

      <S.SplitRow>
        <CashFlowCard />
        <CategoriesCard period={period} />
      </S.SplitRow>

      <TransactionsCard />
    </>
  );
}
