import type { KategorieId } from '@/data/artTypen';
import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';
import { KATEGORIEN, MYSTERY_AB, SELTENHEIT } from '@/data/spiel';
import type { Naturraum } from '@/data/typen';
import { useEinstellungen } from '@/store/einstellungen';

import { punktInGeometrie } from './geo';
import { artIdsDerKategorie, katalogEintrag, type KatalogEintrag } from './katalog';
import { normalisiere } from './ortsuche';
import { istHeimisch } from './regelEngine';
import { rasterZellen, vorkommen } from './verbreitung';
import { berechneWildWert } from './wildwert';

/**
 * Suche und Entdecken: alle Arten mit Wild-Wert und Punkten, dazu Listen
 * „die Seltensten in deinem Naturraum“, „leicht zu finden“ und „gefährlich & tödlich“.
 *
 * „In deinem Naturraum“ heißt: Die Art kommt laut Verbreitungskarte in mindestens einem
 * Rasterfeld des Naturraums vor (Bäume: heimisch im Naturraum). Die Karte ist noch ein
 * Demo-Modell, deshalb sind auch diese Listen vorerst Demo-Werte.
 */

export type SuchEintrag = KatalogEintrag & { kategorie: KategorieId; wildWert: number; punkte: number };

const eintraegeCache = new Map<string, SuchEintrag[]>();

/** Alle Arten aller Kategorien mit Wild-Wert und Punkten (je Naturraum und Belastungstest-Stand gemerkt) */
export function alleSuchEintraege(naturraum?: Naturraum): SuchEintrag[] {
  const e = useEinstellungen.getState();
  const schluessel = `${naturraum?.id ?? '-'}|${e.belastungstest ? e.testGruppierung : 'aus'}`;
  const da = eintraegeCache.get(schluessel);
  if (da) return da;
  const out: SuchEintrag[] = [];
  for (const k of KATEGORIEN) {
    for (const id of artIdsDerKategorie(k.id, naturraum)) {
      const eintrag = katalogEintrag(id);
      if (!eintrag) continue;
      out.push({
        ...eintrag,
        kategorie: k.id,
        wildWert: berechneWildWert(id).wert,
        punkte: SELTENHEIT[eintrag.seltenheit].punkte,
      });
    }
  }
  eintraegeCache.set(schluessel, out);
  return out;
}

/** Noch nicht gefundene Mystery-Art: Name bleibt ein Rätsel */
export function istRaetsel(e: KatalogEintrag, gefunden: Record<string, unknown>): boolean {
  return e.seltenheit >= MYSTERY_AB && !(e.id in gefunden);
}

/**
 * Suche nach deutschem oder lateinischem Namen (Groß-/Kleinschreibung und Umlaute egal).
 * Mystery-Arten, die man noch nicht gefunden hat, findet man nicht über den Namen –
 * außer gefährliche Arten: Vor denen soll jeder gewarnt werden können.
 */
export function sucheArten(
  text: string,
  eintraege: SuchEintrag[],
  gefunden: Record<string, unknown>,
  max = 40,
): SuchEintrag[] {
  const q = normalisiere(text);
  if (q.length < 2) return [];
  const treffer = eintraege.filter((e) => {
    if (istRaetsel(e, gefunden) && !e.gefahr) return false;
    return normalisiere(e.name).includes(q) || normalisiere(e.lat).includes(q);
  });
  // Treffer am Wortanfang zuerst, dann alphabetisch
  const rang = (e: SuchEintrag) =>
    normalisiere(e.name)
      .split(/[\s-]/)
      .some((w) => w.startsWith(q))
      ? 0
      : 1;
  return treffer.sort((a, b) => rang(a) - rang(b) || a.name.localeCompare(b.name)).slice(0, max);
}

// ---------- Naturraum ----------

const zellenCache = new Map<string, number[]>();

/** Indizes der Rasterfelder, deren Mittelpunkt im Naturraum liegt (einmal berechnet, dann gemerkt) */
function zellenImNaturraum(n: Naturraum): number[] {
  const da = zellenCache.get(n.id);
  if (da) return da;
  const ids = rasterZellen()
    .map((z, i) => (punktInGeometrie(z.lon, z.lat, n.geometrie) ? i : -1))
    .filter((i) => i >= 0);
  zellenCache.set(n.id, ids);
  return ids;
}

/** Kommt die Art im Naturraum vor? Ohne Naturraum: ja. */
export function imNaturraum(id: string, naturraum?: Naturraum): boolean {
  if (!naturraum) return true;
  if (baumById[id] && !artById[id]) return istHeimisch(id, naturraum);
  const art = artById[id];
  if (!art) return false;
  const occ = vorkommen(id, art.verbreitung);
  return zellenImNaturraum(naturraum).some((i) => occ[i]);
}

// ---------- Listen fürs Entdecken ----------

/** Die Arten mit dem höchsten Wild-Wert im Naturraum (gefährliche stehen in ihrer eigenen Liste) */
export function seltensteInDerNaehe(eintraege: SuchEintrag[], naturraum?: Naturraum, n = 8): SuchEintrag[] {
  return eintraege
    .filter((e) => !e.gefahr && imNaturraum(e.id, naturraum))
    .sort((a, b) => b.wildWert - a.wildWert || b.seltenheit - a.seltenheit || a.name.localeCompare(b.name))
    .slice(0, n);
}

/** Häufige Arten im Naturraum, die man noch nicht gefunden hat – gut für den Anfang */
export function leichtZuFinden(
  eintraege: SuchEintrag[],
  gefunden: Record<string, unknown>,
  naturraum?: Naturraum,
  n = 8,
): SuchEintrag[] {
  return eintraege
    .filter((e) => e.seltenheit === 1 && !e.gefahr && !(e.id in gefunden) && imNaturraum(e.id, naturraum))
    .sort((a, b) => a.wildWert - b.wildWert || a.name.localeCompare(b.name))
    .slice(0, n);
}

/** Wie gefährlich? tödlich giftig > sehr giftig > alles andere */
export function gefahrStufe(gefahr?: string): number {
  if (!gefahr) return 0;
  if (gefahr.includes('tödlich')) return 3;
  if (gefahr.includes('sehr giftig')) return 2;
  return 1;
}

/** Die gefährlichsten Arten im Naturraum – tödliche zuerst, bei Gleichstand die selteneren */
export function gefaehrlichste(eintraege: SuchEintrag[], naturraum?: Naturraum, n = 10): SuchEintrag[] {
  return eintraege
    .filter((e) => e.gefahr && imNaturraum(e.id, naturraum))
    .sort((a, b) => gefahrStufe(b.gefahr) - gefahrStufe(a.gefahr) || b.wildWert - a.wildWert)
    .slice(0, n);
}

/** Die zuletzt gefundenen Arten */
export function zuletztEntdeckt(
  eintraege: SuchEintrag[],
  gefunden: Record<string, { datum: string }>,
  n = 4,
): SuchEintrag[] {
  return eintraege
    .filter((e) => e.id in gefunden)
    .sort((a, b) => gefunden[b.id].datum.localeCompare(gefunden[a.id].datum))
    .slice(0, n);
}
