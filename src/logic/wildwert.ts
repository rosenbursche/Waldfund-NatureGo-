import { artById } from '@/data/arten';
import type { RoteListe } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import { NATURRAEUME } from '@/data/naturraeume';

import { katalogEintrag } from './katalog';
import { istHeimisch } from './regelEngine';
import { vorkommen } from './verbreitung';

/**
 * Wild-Wert: eine Zahl von 1 bis 100 – wie selten ist diese Art?
 *
 * Nachvollziehbar zusammengesetzt aus:
 * - Verbreitung (55 %): Anteil der Rasterfelder ohne Nachweis (Demo-Karte)
 * - Seltenheitsstufe im Spiel (30 %)
 * - Rote Liste Deutschland (15 %)
 * Solange die Verbreitung Demo-Daten sind, ist auch der Wild-Wert ein Demo-Wert.
 */
const RL_FAKTOR: Record<RoteListe, number> = { '*': 0, V: 0.25, '3': 0.5, '2': 0.75, '1': 1 };

export type WildWert = {
  wert: number;
  /** z. B. "Gefährdet (Rote Liste 3)" oder null, wenn nicht bedroht/nicht bewertet */
  bedroht: string | null;
  vorwarnung: boolean;
};

const ROTE_LISTE_TEXT: Record<RoteListe, string> = {
  '*': '',
  V: 'Vorwarnliste',
  '3': 'Gefährdet',
  '2': 'Stark gefährdet',
  '1': 'Vom Aussterben bedroht',
};

/** Anteil Deutschlands, in dem die Art vorkommt (0–1) */
function verbreitungsAnteil(id: string): number {
  const art = artById[id];
  if (art) {
    const occ = vorkommen(id, art.verbreitung);
    return occ.filter(Boolean).length / occ.length;
  }
  if (baumById[id]) return NATURRAEUME.filter((n) => istHeimisch(id, n)).length / NATURRAEUME.length;
  return 1;
}

export function berechneWildWert(id: string): WildWert {
  const e = katalogEintrag(id);
  const rl = artById[id]?.roteListe;
  const seltenheit = e?.seltenheit ?? 1;
  const roh = 0.55 * (1 - verbreitungsAnteil(id)) + 0.3 * ((seltenheit - 1) / 3) + 0.15 * (rl ? RL_FAKTOR[rl] : 0);
  const wert = Math.max(1, Math.min(100, Math.round(roh * 100)));
  const bedroht = rl && '123'.includes(rl) ? `${ROTE_LISTE_TEXT[rl]} (Rote Liste ${rl})` : null;
  return { wert, bedroht, vorwarnung: rl === 'V' };
}
