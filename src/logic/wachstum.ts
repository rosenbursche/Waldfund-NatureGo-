import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';

/**
 * Wachstum einer Pflanze vom Keimling bis zur ausgewachsenen (bzw. alten) Pflanze.
 * Bei Bäumen in Lebensjahren bis zum ungefähren Höchstalter der Art,
 * sonst in drei einfachen Stufen.
 */
export type Wachstum = {
  /** Größe 0–1 (1 = ausgewachsen) */
  groesse: number;
  stufe: string;
  /** Regler-Bereich */
  max: number;
  einheit: 'Jahre' | 'Stufe';
};

/** Regler-Länge: bei Bäumen das Höchstalter, sonst 3 Stufen */
export function wachstumsBereich(id: string): { max: number; einheit: 'Jahre' | 'Stufe' } {
  const baum = baumById[id];
  if (baum?.hoechstalter) return { max: baum.hoechstalter, einheit: 'Jahre' };
  return { max: 3, einheit: 'Stufe' };
}

const STUFEN_KRAUT = ['Samen', 'Keimling', 'Jungpflanze', 'ausgewachsen'];
const STUFEN_BUSCH = ['Samen', 'Keimling', 'junger Strauch', 'ausgewachsener Strauch'];

export function wachstum(id: string, wert: number): Wachstum {
  const { max, einheit } = wachstumsBereich(id);
  if (einheit === 'Jahre') {
    // Bäume wachsen anfangs schnell in die Höhe, später langsam – nach etwa einem Fünftel
    // des Höchstalters sind sie fast ausgewachsen
    const reif = max * 0.2;
    const groesse = Math.min(1, Math.max(0.04, Math.sqrt(Math.min(wert, reif) / reif)));
    const stufe =
      wert < 1
        ? 'Keimling'
        : wert < 5
          ? 'Sämling'
          : wert < reif * 0.35
            ? 'Jungbaum'
            : wert < reif
              ? 'junger Baum'
              : wert < max * 0.7
                ? 'ausgewachsener Baum'
                : 'alter Baum';
    return { groesse, stufe, max, einheit };
  }
  const n = Math.round(Math.max(0, Math.min(3, wert)));
  const busch = artById[id]?.modell.t === 'shrub';
  return { groesse: [0.08, 0.25, 0.6, 1][n], stufe: (busch ? STUFEN_BUSCH : STUFEN_KRAUT)[n], max, einheit };
}
