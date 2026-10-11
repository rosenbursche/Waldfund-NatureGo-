import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';

/**
 * Jahreslauf einer Pflanze: Wann blüht sie, wann trägt sie Früchte, wie sieht das Laub aus?
 * Blüte- und Fruchtzeit stammen aus den Steckbrief-Angaben (z. B. "Blüte März–Mai, Beeren Aug–Okt").
 * Das Laub folgt dem allgemeinen Jahreslauf heimischer Gehölze (Austrieb im Frühjahr,
 * Herbstfärbung im Oktober, kahl im Winter – außer immergrüne Arten).
 */

export const MONATE = ['Jan', 'Feb', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
export const MONATE_LANG = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const FRUCHT_WOERTER = ['Früchte', 'Beeren', 'Nüsse', 'Eicheln', 'Bucheckern', 'Samen'];

/** Monatsbereich "Sep–Nov" → [9, 10, 11]; auch über den Jahreswechsel ("Nov–Feb") */
function bereich(von: string, bis: string): number[] {
  const a = MONATE.indexOf(von) + 1;
  const b = MONATE.indexOf(bis) + 1;
  if (a === 0 || b === 0) return [];
  const out: number[] = [];
  for (let m = a; ; m = (m % 12) + 1) {
    out.push(m);
    if (m === b) break;
  }
  return out;
}

/** Liest Blüte- und Fruchtmonate aus einem Saison-Text */
export function leseSaison(text: string): { bluete: number[]; frucht: number[] } {
  const bluete: number[] = [];
  const frucht: number[] = [];
  for (const teil of text.split(',')) {
    const m = teil.trim().match(/^(\S+)\s+(\S+?)[\u2013-](\S+)/); // Gedankenstrich oder Bindestrich
    if (!m) continue;
    const [, wort, von, bis] = m;
    if (wort === 'Blüte') bluete.push(...bereich(von, bis));
    else if (FRUCHT_WOERTER.includes(wort)) frucht.push(...bereich(von, bis));
  }
  return { bluete, frucht };
}

export type Laub = 'austrieb' | 'gruen' | 'herbst' | 'kahl';

export type Monatszustand = {
  laub: Laub;
  bluete: boolean;
  frucht: boolean;
  /** kurzer Text für die Anzeige */
  text: string;
  /** false = Blüte-/Fruchtzeit für diese Art (noch) nicht hinterlegt */
  datenVorhanden: boolean;
};

/** Laub im Jahreslauf (für sommergrüne Arten) */
function laubImMonat(monat: number, immergruen: boolean): Laub {
  if (immergruen) return 'gruen';
  if (monat === 4) return 'austrieb';
  if (monat >= 5 && monat <= 9) return 'gruen';
  if (monat === 10) return 'herbst';
  return 'kahl';
}

const LAUB_TEXT: Record<Laub, string> = {
  austrieb: 'Die ersten frischen Blätter treiben aus',
  gruen: 'Volles grünes Laub',
  herbst: 'Herbstfärbung – bald fallen die Blätter',
  kahl: 'Winterruhe – ohne Blätter',
};

export function zustandImMonat(id: string, monat: number): Monatszustand {
  const art = artById[id];
  const baum = baumById[id];
  const saison = art ? leseSaison(art.saison) : { bluete: [], frucht: [] };
  const istGehoelz = !!baum || art?.modell.t === 'shrub' || art?.modell.t === 'tree';
  const immergruen = baum?.immergruen ?? false;
  // Kräuter und Blumen: oberirdisch nur in der Wachstumszeit (grob März–Oktober)
  const laub: Laub = istGehoelz ? laubImMonat(monat, immergruen) : monat >= 3 && monat <= 10 ? 'gruen' : 'kahl';
  const bluete = saison.bluete.includes(monat);
  const frucht = saison.frucht.includes(monat);
  const teile: string[] = [];
  if (bluete) teile.push('Blütezeit');
  if (frucht) teile.push('Früchte reifen');
  teile.push(istGehoelz ? LAUB_TEXT[laub] : laub === 'kahl' ? 'Ruht im Boden – oberirdisch nicht zu sehen' : 'Wächst');
  return {
    laub,
    bluete,
    frucht,
    text: `${MONATE_LANG[monat - 1]}: ${teile.join(' · ')}`,
    datenVorhanden: saison.bluete.length + saison.frucht.length > 0,
  };
}
