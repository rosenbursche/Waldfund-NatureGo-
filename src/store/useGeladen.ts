import { useSyncExternalStore } from 'react';

import { useEinstellungen } from './einstellungen';

/**
 * Wartet, bis die gespeicherten Einstellungen vom Handy geladen sind.
 * Vorher wüssten wir nicht, ob schon ein Naturraum gewählt wurde.
 */
export function useGeladen(): boolean {
  return useSyncExternalStore(
    (melden) => useEinstellungen.persist.onFinishHydration(melden),
    () => useEinstellungen.persist.hasHydrated(),
  );
}
