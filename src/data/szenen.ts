import type { KategorieId } from './artTypen';

/** Bild aus require('…png'): Metro gibt dafür eine Nummer zurück */
type Bild = number;

/**
 * Startszenen als 2,5D-Diorama: übereinanderliegende Bildebenen (1024 × 1536),
 * die sich beim Kippen des Handys unterschiedlich stark verschieben.
 * Wie die Bilder entstehen: docs/SZENE-PROMPTS.md
 *
 * Alle Punkte sind Bildkoordinaten (Pixel im 1024 × 1536-Bild), damit Effekte und
 * Runensteine genau an Schornstein, Fenster, Tümpel usw. sitzen.
 */
export const SZENE_BREITE = 1024;
export const SZENE_HOEHE = 1536;

export type Punkt = { x: number; y: number };

export type SzenenEbene = {
  bild: Bild;
  /** Tiefe 0 = unendlich weit (bewegt sich kaum), 1 = ganz vorne (bewegt sich am stärksten) */
  tiefe: number;
};

export type DioramaSzene = {
  id: string;
  name: string;
  /** true = nur selbst gezeichnete Platzhalter, noch keine echten Bilder */
  platzhalter: boolean;
  himmel: SzenenEbene;
  ferne: SzenenEbene;
  mittelgrund: SzenenEbene;
  lichtung: SzenenEbene;
  /** Hütte je Ausbaustufe 0–3; fehlt eine Stufe, wird die nächstniedrigere (oder Stufe 1) gezeigt */
  huette: Partial<Record<0 | 1 | 2 | 3, Bild>>;
  huetteTiefe: number;
  vordergrund: SzenenEbene;
  orte: {
    mond: Punkt;
    schornstein: Punkt;
    fenster: Punkt;
    /** Mitte und Halbachsen des Tümpels (für das Glitzern) */
    tuempel: Punkt & { rx: number; ry: number };
    /** Höhe der Nebelbänke (y) */
    nebel: number[];
    /** Bereich, in dem Glühwürmchen schweben */
    gluehwuermchen: { x1: number; y1: number; x2: number; y2: number };
    /** Runensteine stehen auf der Lichtung; Größe = Höhe des Steins in Bildpixeln */
    runen: Record<KategorieId, Punkt & { groesse: number }>;
    /** Tippfläche der Hütte */
    huette: { x1: number; y1: number; x2: number; y2: number };
  };
};

/** Selbst gezeichnete Platzhalter (scripts/platzhalter-szene.mjs) – bis die ChatGPT-Bilder da sind */
export const PLATZHALTER_HEIDE: DioramaSzene = {
  id: 'platzhalter',
  name: 'Heide in der Dämmerung (Platzhalter)',
  platzhalter: true,
  himmel: { bild: require('../../assets/szene/platzhalter/0-himmel.png'), tiefe: 0.05 },
  ferne: { bild: require('../../assets/szene/platzhalter/1-ferne.png'), tiefe: 0.18 },
  mittelgrund: { bild: require('../../assets/szene/platzhalter/2-mittelgrund.png'), tiefe: 0.4 },
  lichtung: { bild: require('../../assets/szene/platzhalter/3-lichtung.png'), tiefe: 0.6 },
  huette: { 1: require('../../assets/szene/platzhalter/4-huette-1.png') },
  huetteTiefe: 0.6,
  vordergrund: { bild: require('../../assets/szene/platzhalter/5-vordergrund.png'), tiefe: 1 },
  orte: {
    mond: { x: 720, y: 300 },
    schornstein: { x: 577, y: 826 },
    fenster: { x: 553, y: 954 },
    tuempel: { x: 795, y: 1176, rx: 110, ry: 26 },
    nebel: [780, 900, 1010],
    gluehwuermchen: { x1: 120, y1: 820, x2: 940, y2: 1250 },
    runen: {
      pilze: { x: 345, y: 1150, groesse: 120 },
      pflanzen: { x: 650, y: 1300, groesse: 130 },
      voegel: { x: 350, y: 1000, groesse: 95 },
      saeuger: { x: 705, y: 1040, groesse: 95 },
    },
    huette: { x1: 390, y1: 820, x2: 634, y2: 1015 },
  },
};

/** Alle Diorama-Szenen; die erste ist die aktuelle Pilotszene */
export const DIORAMA_SZENEN: DioramaSzene[] = [PLATZHALTER_HEIDE];

/** Hüttenbild zur Stufe – fehlt das Bild, die nächstniedrigere Stufe, sonst irgendeine vorhandene */
export function huettenBild(szene: DioramaSzene, stufe: 0 | 1 | 2 | 3): Bild | undefined {
  for (let s = stufe; s >= 0; s--) {
    const b = szene.huette[s as 0 | 1 | 2 | 3];
    if (b) return b;
  }
  return szene.huette[1] ?? Object.values(szene.huette)[0];
}

/**
 * Rechnet Bildkoordinaten in Bildschirmpunkte um. Das Bild füllt den Bildschirm ("cover")
 * plus etwas Rand, damit beim Verschieben nie eine Kante sichtbar wird.
 */
export function bildAufBildschirm(breite: number, hoehe: number, rand = 1.08) {
  const massstab = Math.max(breite / SZENE_BREITE, hoehe / SZENE_HOEHE) * rand;
  const links = (breite - SZENE_BREITE * massstab) / 2;
  const oben = (hoehe - SZENE_HOEHE * massstab) / 2;
  return {
    massstab,
    links,
    oben,
    /**
     * größte Verschiebung (in Bildschirmpunkten) für die vorderste Ebene: nie über die Bildkante hinaus
     * und höchstens 9 % der Breite bzw. 4 % der Höhe – mehr wirkt unruhig
     */
    spielraumX: Math.min(-links, breite * 0.09),
    spielraumY: Math.min(-oben, hoehe * 0.04),
    punkt: (p: Punkt) => ({ x: links + p.x * massstab, y: oben + p.y * massstab }),
  };
}
