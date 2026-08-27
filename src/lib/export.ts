/**
 * Gera um CSV a partir de linhas (a primeira costuma ser o cabeçalho) e dispara
 * o download no navegador. Usa `;` como separador (amigável ao Excel pt-BR) e
 * BOM UTF-8 para acentuação correta.
 */
export function downloadCsv(
  filename: string,
  rows: (string | number)[][],
): void {
  const escape = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;
  const csv = rows.map((row) => row.map(escape).join(';')).join('\r\n');

  const blob = new Blob(['﻿' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
