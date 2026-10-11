import { ARTEN } from '@/data/arten';
import type { KategorieId } from '@/data/artTypen';
import type { Naturraum } from '@/data/typen';

import { getHeimischeBaeume } from './regelEngine';

/**
 * Welche Arten zählen in einer Kategorie?
 * Pflanzen = Arten aus dem Prototyp + die heimischen Baumarten des Naturraums.
 * (Stieleiche und Rotbuche gibt es in beiden Listen – sie zählen nur einmal.)
 */
export function artIdsDerKategorie(kategorie: KategorieId, naturraum?: Naturraum): string[] {
  const ids = ARTEN.filter((a) => a.kategorie === kategorie).map((a) => a.id);
  if (kategorie === 'pflanzen' && naturraum) {
    for (const b of getHeimischeBaeume(naturraum)) if (!ids.includes(b.baumart.id)) ids.push(b.baumart.id);
  }
  return ids;
}

export function fortschrittDerKategorie(
  kategorie: KategorieId,
  gefunden: Record<string, unknown>,
  naturraum?: Naturraum,
): { gefunden: number; gesamt: number; anteil: number } {
  const ids = artIdsDerKategorie(kategorie, naturraum);
  const n = ids.filter((id) => id in gefunden).length;
  return { gefunden: n, gesamt: ids.length, anteil: ids.length ? n / ids.length : 0 };
}
