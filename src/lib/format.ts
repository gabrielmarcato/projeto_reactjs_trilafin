/** Formata um número como moeda BRL: `money(225220.27)` → "R$ 225.220,27". */
export function money(value: number): string {
  return (
    'R$ ' +
    value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

const MONTHS_SHORT = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

/** Formata uma data ISO (`yyyy-mm-dd`) como "26 AGO". */
export function shortDate(iso: string): string {
  const [, month, day] = iso.split('-');
  const monthIndex = Number(month) - 1;
  const label = MONTHS_SHORT[monthIndex] ?? '';
  return `${day} ${label}`.trim();
}
