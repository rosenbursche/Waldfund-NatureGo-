import type { Fundstueck, FundstueckTyp, Monat } from '@/data/fundstueckTypen';

/**
 * Reine Rechenfunktionen für Fundstücke und die Stufen einer Art
 * (Gesamtkonzept G1, `docs/KONZEPT-GESAMT.md` Abschnitt 2.2).
 */

/** Typen, die das Lebewesen selbst zeigen (Tier gesehen, ganze Pflanze, Pilz). Alles andere ist ein Zeichen. */
const BEGEGNUNG: ReadonlySet<FundstueckTyp> = new Set(['sichtung', 'ganz', 'fruchtkoerper']);

/** So viele Zeichen braucht den Bronze-Taler (bei Arten mit weniger Zeichen: alle) */
export const ZEICHEN_FUER_ERKANNT = 3;

/** Taler-Prägung: 0 = verborgen, 1 = Holz, 2 = Bronze, 3 = Silber, 4 = Gold */
export type Stufe = 0 | 1 | 2 | 3 | 4;

export const STUFEN_NAMEN: Record<Stufe, string> = {
  0: 'Verborgen',
  1: 'Holz-Taler',
  2: 'Bronze-Taler',
  3: 'Silber-Taler',
  4: 'Gold-Taler',
};

export function istBegegnung(f: Fundstueck): boolean {
  return BEGEGNUNG.has(f.typ);
}

/**
 * Stufe einer Art aus ihren Fundstücken und den IDs der gefundenen.
 * - Holz: irgendein Fundstück
 * - Bronze: 3 Zeichen (Spuren, Federn, Blätter …)
 * - Silber: das Lebewesen selbst gesehen – egal wie viele Zeichen
 * - Gold: alle Fundstücke
 */
export function artStufe(fundstuecke: readonly Fundstueck[], gefunden: ReadonlySet<string>): Stufe {
  const da = fundstuecke.filter((f) => gefunden.has(f.id));
  if (da.length === 0) return 0;
  if (da.length === fundstuecke.length) return 4;
  if (da.some(istBegegnung)) return 3;
  const zeichenGesamt = fundstuecke.filter((f) => !istBegegnung(f)).length;
  const zeichenDa = da.filter((f) => !istBegegnung(f)).length;
  if (zeichenDa >= Math.min(ZEICHEN_FUER_ERKANNT, zeichenGesamt)) return 2;
  return 1;
}

/** Fortschritt einer Art: gefunden / gesamt */
export function artFortschritt(fundstuecke: readonly Fundstueck[], gefunden: ReadonlySet<string>) {
  return { gefunden: fundstuecke.filter((f) => gefunden.has(f.id)).length, gesamt: fundstuecke.length };
}

/** Ist das Fundstück in diesem Monat zu finden? */
export function inSaison(f: Fundstueck, monat: Monat): boolean {
  return f.monate.includes(monat);
}

/** Fundstücke, die gerade in Saison sind und noch fehlen – die einfachsten zuerst */
export function jetztMoeglich(fundstuecke: readonly Fundstueck[], gefunden: ReadonlySet<string>, monat: Monat) {
  return fundstuecke
    .filter((f) => !gefunden.has(f.id) && inSaison(f, monat))
    .sort((a, b) => a.findbarkeit - b.findbarkeit);
}
