import { colors } from '@/theme/theme';

import type { IconName, KategorieId, RoteListe, Schutz, Seltenheit } from './artTypen';

/** Spielregeln aus dem Prototyp: Seltenheit, Schutzstatus, Level, Ränge. */

export const SELTENHEIT: Record<Seltenheit, { name: string; punkte: number; farbe: string }> = {
  // Seltene Arten bringen überproportional mehr: jede Stufe etwa 5–6-mal so viel wie die darunter
  1: { name: 'Häufig', punkte: 10, farbe: colors.fog },
  2: { name: 'Selten', punkte: 60, farbe: colors.rune },
  3: { name: 'Sehr selten', punkte: 300, farbe: colors.rare },
  4: { name: 'Legendär', punkte: 1000, farbe: colors.legend },
};

/** Ab dieser Seltenheit erscheint eine Art nur als Rätsel (Mystery-Zone), bis man sie findet. */
export const MYSTERY_AB: Seltenheit = 3;

/** Ab dieser Seltenheit hängt eine Art zusätzlich als Stern über der Krone des Lebensbaums. */
export const STERN_AB: Seltenheit = 4;

/** Bonus für einen vollständigen Zweig bzw. Ast im Lebensbaum (bewusst klein: Seltenheit bleibt der größte Reiz) */
export const ZWEIG_BONUS = 25;
export const AST_BONUS = 150;

export const SCHUTZ_NAME: Record<Schutz, string> = {
  0: 'Nicht geschützt',
  1: 'Besonders geschützt',
  2: 'Streng geschützt',
};

export const ROTE_LISTE_NAME: Record<RoteListe, string> = {
  '*': 'Ungefährdet',
  V: 'Vorwarnliste',
  '3': 'Gefährdet',
  '2': 'Stark gefährdet',
  '1': 'Vom Aussterben bedroht',
};

export const KATEGORIEN: { id: KategorieId; name: string; tag: string; icon: IconName | 'leaf' | 'paw' }[] = [
  { id: 'pflanzen', name: 'Pflanzen', tag: 'FLORA', icon: 'leaf' },
  { id: 'pilze', name: 'Pilze', tag: 'FUNGI', icon: 'shroom' },
  { id: 'voegel', name: 'Vögel', tag: 'AVES', icon: 'bird' },
  { id: 'saeuger', name: 'Säugetiere', tag: 'MAMMALIA', icon: 'paw' },
];

/** Aktivitätspunkte (AP), ab denen ein Level beginnt. Index 0 = Level 1. */
// An die höheren Punkte angepasst: die ersten Level bleiben schnell erreichbar, die oberen brauchen seltene Funde
export const LEVEL_SCHWELLEN = [0, 40, 120, 260, 480, 800, 1250, 1900, 2800, 4000, 5600, 7600];

/** Rang-Titel je Level (gleicher Index wie LEVEL_SCHWELLEN) */
export const RAENGE = [
  'Entdecker',
  'Spurenleser',
  'Spurenleser',
  'Waldläufer',
  'Waldläufer',
  'Feldforscher',
  'Feldforscher',
  'Artenkenner',
  'Naturdetektiv',
  'Biotop-Profi',
  'Wildnis-Legende',
  'Wildnis-Legende',
];

/** Serienbonus: 5 AP pro Tag in Folge, höchstens 50 AP. Gibt es ab dem 2. Tag. */
export const SERIE_AP_PRO_TAG = 5;
export const SERIE_MAX_BONUS = 50;
