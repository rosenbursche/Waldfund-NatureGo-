import { DEUTSCHLAND_UMRISS, VERBREITUNG } from '@/data/verbreitung';

import { punktInRing } from './geo';

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

/** Für jedes Rasterfeld: kommt die Art dort (laut Demo-Modell) vor? */
export function vorkommen(artId: string, modellName: string): boolean[] {
  const m = VERBREITUNG[modellName] ?? VERBREITUNG.all;
  const sd = startwert(artId);
  return rasterZellen().map(({ lon, lat, i, j }) => {
    let p = m.bg;
    for (const [hx, hy, r, a] of m.hs ?? []) {
      const dx = (lon - hx) * 0.63;
      const dy = lat - hy;
      p = Math.max(p, a * Math.exp(-(dx * dx + dy * dy) / (r * r)));
    }
    return hash(i, j, sd) < p;
  });
}

/** Umrechnung Länge/Breite → Bildpunkte auf einer Karte 340 × 440 (wie im Prototyp) */
export const KARTE = { breite: 340, hoehe: 440 };
export function projiziere(lon: number, lat: number): [number, number] {
  return [16 + (lon - 5.85) * 33.5, 10 + (55.1 - lat) * 53.5];
}
