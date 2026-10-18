import { WUCHSGEBIETE } from '@/data/karte';
import type { Geometrie } from '@/data/typen';
import { ECHTE_VERBREITUNG } from '@/data/nachweise';
import { DEUTSCHLAND_UMRISS, VERBREITUNG } from '@/data/verbreitung';

import { punktInGeometrie, punktInRing } from './geo';

/**
 * Verbreitungskarte im Messtischblatt-Raster (TK25: 10′ Länge × 6′ Breite).
 * Aus dem Prototyp übernommen. DEMO-DATEN: Das Vorkommen wird aus einem einfachen
 * Modell "gewürfelt" – mit festem Startwert, damit die Karte immer gleich aussieht.
 *
 * Schutz der Natur: Es wird nie ein genauerer Ort als das Rasterfeld gezeigt.
 */

export type Zelle = { lon: number; lat: number; i: number; j: number };

const DX = 1 / 6; // 10 Bogenminuten
const DY = 0.1; // 6 Bogenminuten

let zellen: Zelle[] | null = null;

/** Alle Rasterfelder, deren Mittelpunkt in Deutschland liegt */
export function rasterZellen(): Zelle[] {
  if (zellen) return zellen;
  const out: Zelle[] = [];
  let i = 0;
  for (let lon = 5.9 + DX / 2; lon < 15.1; lon += DX, i++) {
    let j = 0;
    for (let lat = 47.3 + DY / 2; lat < 55.1; lat += DY, j++) {
      if (punktInRing(lon, lat, DEUTSCHLAND_UMRISS)) out.push({ lon, lat, i, j });
    }
  }
  zellen = out;
  return out;
}

/** Fester Pseudo-Zufall aus drei Zahlen (wie im Prototyp) */
function hash(a: number, b: number, s: number): number {
  let h = (a * 374761393 + b * 668265263 + s * 2246822519) >>> 0;
  h = (Math.imul(h ^ (h >>> 13), 1274126177) >>> 0) as number;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function startwert(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 9973;
}

const vorkommenCache = new Map<string, boolean[]>();

/** Gibt es echte Nachweise (GBIF) für diese Art? Dann zeigt die Karte sie statt des Demo-Modells. */
export const hatEchteDaten = (artId: string) => artId in ECHTE_VERBREITUNG;

/**
 * Für jedes Rasterfeld: kommt die Art dort vor? Echte Nachweise (`src/data/nachweise/`, aus GBIF),
 * sonst das Demo-Modell. Einmal berechnet, dann gemerkt.
 */
export function vorkommen(artId: string, modellName: string): boolean[] {
  const schluessel = `${artId}|${modellName}`;
  const da = vorkommenCache.get(schluessel);
  if (da) return da;
  const echt = ECHTE_VERBREITUNG[artId];
  if (echt) {
    const occ = rasterZellen().map(({ i, j }) => (echt.zellen[`${i}-${j}`] ?? 0) > 0);
    vorkommenCache.set(schluessel, occ);
    return occ;
  }
  const m = VERBREITUNG[modellName] ?? VERBREITUNG.all;
  const sd = startwert(artId);
  const occ = rasterZellen().map(({ lon, lat, i, j }) => {
    let p = m.bg;
    for (const [hx, hy, r, a] of m.hs ?? []) {
      const dx = (lon - hx) * 0.63;
      const dy = lat - hy;
      p = Math.max(p, a * Math.exp(-(dx * dx + dy * dy) / (r * r)));
    }
    return hash(i, j, sd) < p;
  });
  vorkommenCache.set(schluessel, occ);
  return occ;
}

/** Umrechnung Länge/Breite → Bildpunkte auf einer Karte 340 × 440 (wie im Prototyp) */
export const KARTE = { breite: 340, hoehe: 440 };
export function projiziere(lon: number, lat: number): [number, number] {
  return [16 + (lon - 5.85) * 33.5, 10 + (55.1 - lat) * 53.5];
}

// ---------- Flächen statt Punkte ----------

/** Wie stark kommt eine Art in einem Gebiet vor? */
export type GebietsStufe = 'voll' | 'teil' | 'keine';
export const SCHWELLE_VOLL = 0.45;
export const SCHWELLE_TEIL = 0.12;
/** Echte Nachweise decken nie jedes Feld ab (es wird nicht überall gesucht) – deshalb niedrigere Schwellen.
 *  „vereinzelt“ erst ab 2 Feldern mit Nachweis, damit ein einzelner Ausreißer kein ganzes Gebiet färbt. */
export const SCHWELLE_VOLL_ECHT = 0.2;
export const SCHWELLE_TEIL_ECHT = 0.03;

let zellGebiet: (number | null)[] | null = null;

/** Ordnet jedes Rasterfeld einem Wuchsgebiet zu (einmal berechnet, dann gemerkt). */
export function zellenNachGebiet(): (number | null)[] {
  if (zellGebiet) return zellGebiet;
  const gebiete = WUCHSGEBIETE.map((g) => ({ id: g.id, geo: g.geo, box: begrenzung(g.geo) }));
  zellGebiet = rasterZellen().map(({ lon, lat }) => {
    for (const g of gebiete) {
      const [x0, y0, x1, y1] = g.box;
      if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
      if (punktInGeometrie(lon, lat, g.geo)) return g.id;
    }
    return null;
  });
  return zellGebiet;
}

function begrenzung(g: Geometrie): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const p of polys)
    for (const [x, y] of p[0]) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  return [x0, y0, x1, y1];
}

/**
 * Für jedes Wuchsgebiet: Anteil der Rasterfelder mit Nachweis und daraus die Stufe
 * (voll gefüllt / schraffiert / leer). Gröber als die Rasterfelder – das schützt zusätzlich
 * die Fundorte seltener Arten.
 */
export function gebietsAnteile(
  artId: string,
  modellName: string,
): { id: number; anteil: number; stufe: GebietsStufe }[] {
  const occ = vorkommen(artId, modellName);
  const zuordnung = zellenNachGebiet();
  const zaehler = new Map<number, { ja: number; alle: number }>();
  zuordnung.forEach((id, i) => {
    if (id === null) return;
    const z = zaehler.get(id) ?? { ja: 0, alle: 0 };
    z.alle += 1;
    if (occ[i]) z.ja += 1;
    zaehler.set(id, z);
  });
  const echt = hatEchteDaten(artId);
  const voll = echt ? SCHWELLE_VOLL_ECHT : SCHWELLE_VOLL;
  const teil = echt ? SCHWELLE_TEIL_ECHT : SCHWELLE_TEIL;
  return WUCHSGEBIETE.map((g) => {
    const z = zaehler.get(g.id);
    const anteil = z && z.alle > 0 ? z.ja / z.alle : 0;
    const genug = !echt || (z?.ja ?? 0) >= 2;
    return { id: g.id, anteil, stufe: anteil >= voll && genug ? 'voll' : anteil >= teil && genug ? 'teil' : 'keine' };
  });
}
