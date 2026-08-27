/**
 * Modelos de domínio da home (dashboard). Os `tone` guardam a cor já
 * resolvida do tema para o valor — mantém a camada de dados desacoplada do
 * componente, replicando o design de referência.
 */
export interface Budget {
  label: string;
  used: string;
  pct: string;
  tone: string;
}

export interface Stat {
  label: string;
  value: string;
  tone: string;
  delta: string;
}

export interface FlowPoint {
  month: string;
  /** Altura da barra de entradas, ex.: "62%". */
  inH: string;
  /** Altura da barra de saídas, ex.: "48%". */
  outH: string;
}

export interface Category {
  label: string;
  amount: string;
  pct: string;
  tone: string;
}

export interface Transaction {
  date: string;
  desc: string;
  cat: string;
  account: string;
  amount: string;
  tone: string;
}

export interface TypeSpecimen {
  meta: string;
  weight: number;
  size: string;
  sample: string;
}
