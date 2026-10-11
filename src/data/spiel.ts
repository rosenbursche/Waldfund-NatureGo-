import { colors } from '@/theme/theme';

import type { IconName, KategorieId, RoteListe, Schutz, Seltenheit } from './artTypen';

/** Spielregeln aus dem Prototyp: Seltenheit, Schutzstatus, Level, Ränge. */

export const SELTENHEIT: Record<Seltenheit, { name: string; punkte: number; farbe: string }> = {
  1: { name: 'Häufig', punkte: 10, farbe: colors.fog },
  2: { name: 'Selten', punkte: 50, farbe: colors.rune },
  3: { name: 'Sehr selten', punkte: 150, farbe: colors.rare },
  4: { name: 'Legendär', punkte: 400, farbe: colors.legend },
};

/** Ab dieser Seltenheit erscheint eine Art nur als Rätsel (Mystery-Zone), bis man sie findet. */
export const MYSTERY_AB: Seltenheit = 3;

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
export const LEVEL_SCHWELLEN = [0, 40, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600, 3300];

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
