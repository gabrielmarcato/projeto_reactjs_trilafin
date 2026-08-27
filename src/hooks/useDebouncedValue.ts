import { useEffect, useState } from 'react';

/**
 * Retorna uma versão "atrasada" de `value`, que só é atualizada após
 * `delayMs` sem mudanças. Útil para não filtrar/buscar a cada tecla.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
