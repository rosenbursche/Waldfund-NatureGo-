import type { GeweihZustand, TierSeite } from '@/data/tierSeiten';

/**
 * Rechenteil der grafischen Tierseite: Was zeigt die Zeichnung in einem Monat bzw. zu einer Uhrzeit?
 * Dazu die Umrechnung von Fingerposition auf Uhr- bzw. Jahresrad.
 */

export type JahresZustand = {
  /** 0 = Winterfell, 1 = Sommerfell */
  fell: number;
  geweih: GeweihZustand;
  kitz: boolean;
  flecken: boolean;
  /** IDs der Ereignisse in diesem Monat (z. B. 'brunft') */
  ereignisse: string[];
};

/** monat: 1–12 */
export function jahresZustand(t: TierSeite, monat: number): JahresZustand {
  const i = (((monat - 1) % 12) + 12) % 12;
  const m = i + 1;
  return {
    fell: t.fell[i],
    geweih: t.geweih[i],
    kitz: t.kitz.sichtbar.includes(m),
    flecken: t.kitz.flecken.includes(m),
    ereignisse: t.jahr.filter((e) => e.monate.includes(m)).map((e) => e.id),
  };
}

/** 0 = ruht, 1 = kurze Fressphase, 2 = Hauptaktivität (stunde 0–24, auch mit Nachkommastellen) */
export function aktivitaetUm(t: TierSeite, stunde: number): 0 | 1 | 2 {
  const h = ((stunde % 24) + 24) % 24;
  let s: 0 | 1 | 2 = 0;
  for (const a of t.aktivitaet) if (h >= a.von && h < a.bis && a.staerke > s) s = a.staerke;
  return s;
}

/** Welche Nahrung gibt es im Monat? */
export function nahrungIm(t: TierSeite, monat: number) {
  return t.nahrung.filter((n) => n.monate.includes(monat));
}

/**
 * Winkel einer Fingerposition um den Mittelpunkt, 0 = oben (12 Uhr), im Uhrzeigersinn, 0–1.
 * (Bildschirm: y wächst nach unten.)
 */
export function anteilAmKreis(x: number, y: number, mx: number, my: number): number {
  const w = Math.atan2(x - mx, -(y - my)); // 0 oben, positiv im Uhrzeigersinn
  return (((w / (Math.PI * 2)) % 1) + 1) % 1;
}

/** Fingerposition → Stunde (0–24, auf Viertelstunden gerundet) */
export function stundeAmKreis(x: number, y: number, mx: number, my: number): number {
  return (Math.round(anteilAmKreis(x, y, mx, my) * 96) / 4) % 24;
}

/** Fingerposition → Monat (1–12), Januar beginnt oben */
export function monatAmKreis(x: number, y: number, mx: number, my: number): number {
  return (Math.floor(anteilAmKreis(x, y, mx, my) * 12) % 12) + 1;
}

/**
 * Zentimeter → Bildschirmpunkte (ungefähr): React Native rechnet mit etwa 160 Punkten pro Zoll.
 * Das schwankt je nach Handy um einige Prozent – „Originalgröße“ ist deshalb nur ungefähr.
 */
export function cmZuPunkten(cm: number): number {
  return (cm / 2.54) * 160;
}

/** Zwei Farben (#RRGGBB) mischen, t = 0 → a, t = 1 → b */
export function farbMix(a: string, b: string, t: number): string {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const k = Math.max(0, Math.min(1, t));
  const teil = (i: number) =>
    Math.round(p(a, i) + (p(b, i) - p(a, i)) * k)
      .toString(16)
      .padStart(2, '0');
  return `#${teil(0)}${teil(1)}${teil(2)}`;
}
