import type { Transaction } from '@/store/useTransactionsStore';

/** Períodos do seletor da home. */
export type Period = 'Semana' | 'Mês' | 'Ano';

export const PERIODS: readonly Period[] = ['Semana', 'Mês', 'Ano'];

/** Descrição curta do período (para legendas). */
export const PERIOD_CAPTION: Record<Period, string> = {
  Semana: 'nesta semana',
  Mês: 'neste mês',
  Ano: 'neste ano',
};

const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

/** Intervalo `[from, to]` (ISO) correspondente ao período, relativo a `now`. */
export function periodRange(
  period: Period,
  now: Date = new Date(),
): { from: string; to: string } {
  const y = now.getFullYear();
  const m = now.getMonth();
  if (period === 'Ano') return { from: `${y}-01-01`, to: `${y}-12-31` };
  if (period === 'Mês') {
    const mm = String(m + 1).padStart(2, '0');
    const lastDay = new Date(y, m + 1, 0).getDate();
    return {
      from: `${y}-${mm}-01`,
      to: `${y}-${mm}-${String(lastDay).padStart(2, '0')}`,
    };
  }
  // Semana: últimos 7 dias (hoje inclusive).
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  return { from: toIso(start), to: toIso(now) };
}

/** Filtra transações dentro do período (comparação de strings ISO). */
export function filterByPeriod(
  txs: Transaction[],
  period: Period,
  now: Date = new Date(),
): Transaction[] {
  const { from, to } = periodRange(period, now);
  return txs.filter((t) => t.date >= from && t.date <= to);
}

export interface Summary {
  entradas: number;
  saidas: number;
  saldo: number;
  count: number;
  countEntradas: number;
  countSaidas: number;
}

/** Soma entradas/saídas/saldo e contagens de um conjunto de transações. */
export function summarize(txs: Transaction[]): Summary {
  let entradas = 0;
  let saidas = 0;
  let countEntradas = 0;
  let countSaidas = 0;
  for (const t of txs) {
    if (t.type === 'entrada') {
      entradas += t.amount;
      countEntradas += 1;
    } else {
      saidas += t.amount;
      countSaidas += 1;
    }
  }
  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
    count: txs.length,
    countEntradas,
    countSaidas,
  };
}

export interface CategorySlice {
  label: string;
  amount: number;
  /** Percentual em relação à maior categoria, ex.: "100%". */
  pct: string;
}

/**
 * Ranking de despesas (saídas) por categoria. Quando um lançamento tem várias
 * categorias, o valor é dividido igualmente entre elas — assim a soma das
 * fatias equivale ao total de saídas. Sem categoria vira "Sem categoria".
 */
export function topCategories(txs: Transaction[], limit = 6): CategorySlice[] {
  const totals = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== 'saida') continue;
    const cats = t.categories.length ? t.categories : ['Sem categoria'];
    const share = t.amount / cats.length;
    for (const c of cats) totals.set(c, (totals.get(c) ?? 0) + share);
  }
  const ranked = [...totals.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
  const max = ranked[0]?.amount ?? 0;
  return ranked.map((r) => ({
    ...r,
    pct: max ? `${Math.round((r.amount / max) * 100)}%` : '0%',
  }));
}
