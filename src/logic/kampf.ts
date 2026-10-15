import { STARK_GEGEN, type Aktivzeit, type Angriff, type Kampfwerte, type Lebensweise } from '@/data/kampfwerte';

/**
 * Kampf-Regeln (Konzept: docs/KONZEPT-SPIELSYSTEM.md, Abschnitt 3).
 *
 * Vereinfacht in Runden: Beide Seiten wählen eine Aktion, dann wird aufgelöst.
 * - Sofortangriff: wenig Schaden, lädt Kraft auf
 * - Spezialangriff: viel Schaden, kostet Kraft
 * - Tarnen: blockt in dieser Runde jeden Angriff, nur 2× pro Kampf
 * Wer mehr Tempo hat, handelt zuerst. Erschöpfte Tiere ziehen sich zurück.
 *
 * Reine Logik ohne Bildschirm, damit sie sich testen lässt.
 */

export const MAX_KRAFT = 100;
export const TARNEN_PRO_KAMPF = 2;
/** wie in Pokémon GO laut gängigen Guides – TODO im Spieltest abstimmen */
export const SEHR_EFFEKTIV = 1.6;
export const WENIG_EFFEKTIV = 0.625;
export const AKTIVZEIT_BONUS = 1.2;

export type Seite = 'spieler' | 'gegner';

export type Kaempfer = { name: string; werte: Kampfwerte; ausdauer: number; kraft: number; tarnen: number };

export type Aktion = { typ: 'schnell' } | { typ: 'spezial'; index: number } | { typ: 'tarnen' };

/** Was in einer Runde passiert ist – für Text und Animation */
export type Ereignis =
  | { typ: 'tarnen'; wer: Seite }
  | {
      typ: 'angriff';
      wer: Seite;
      art: 'schnell' | 'spezial';
      name: string;
      schaden: number;
      geblockt: boolean;
      wirkung: number;
    }
  | { typ: 'erschoepft'; wer: Seite };

export type KampfZustand = { runde: number; spieler: Kaempfer; gegner: Kaempfer; sieger: Seite | null };

export function neuerKaempfer(name: string, werte: Kampfwerte): Kaempfer {
  return { name, werte, ausdauer: werte.ausdauer, kraft: 0, tarnen: TARNEN_PRO_KAMPF };
}

export function starteKampf(spieler: Kaempfer, gegner: Kaempfer): KampfZustand {
  return { runde: 1, spieler, gegner, sieger: null };
}

/** Faktor aus den Lebensweisen: >1 stark, <1 schwach, 1 neutral */
export function effektivitaet(angreifer: Lebensweise[], verteidiger: Lebensweise[]): number {
  let f = 1;
  for (const a of angreifer) {
    for (const v of verteidiger) {
      if (STARK_GEGEN[a].includes(v)) f *= SEHR_EFFEKTIV;
      if (STARK_GEGEN[v].includes(a)) f *= WENIG_EFFEKTIV;
    }
  }
  return f;
}

/** Ist das Tier zu dieser Stunde in seiner Aktivzeit? Dämmerung: 5–8 und 18–22 Uhr (Spiel-Vereinfachung) */
export function inAktivzeit(aktiv: Aktivzeit, stunde: number): boolean {
  const daemmerung = (stunde >= 5 && stunde < 8) || (stunde >= 18 && stunde < 22);
  const nacht = stunde >= 22 || stunde < 5;
  if (aktiv === 'daemmerung') return daemmerung;
  if (aktiv === 'nacht') return nacht || daemmerung;
  return !nacht;
}

export function berechneSchaden(angreifer: Kaempfer, angriff: Angriff, verteidiger: Kaempfer, stunde: number): number {
  const bonus = inAktivzeit(angreifer.werte.aktiv, stunde) ? AKTIVZEIT_BONUS : 1;
  const eff = effektivitaet(angreifer.werte.lebensweisen, verteidiger.werte.lebensweisen);
  return Math.max(1, Math.round(angriff.schaden * (angreifer.werte.staerke / 100) * eff * bonus));
}

export function istMoeglich(k: Kaempfer, aktion: Aktion): boolean {
  if (aktion.typ === 'tarnen') return k.tarnen > 0;
  if (aktion.typ === 'spezial') {
    const a = k.werte.spezial[aktion.index];
    return !!a && k.kraft >= a.kraft;
  }
  return true;
}

/** Einfacher Computergegner. `zufall` ist im Test austauschbar. */
export function computerWahl(zustand: KampfZustand, zufall: () => number = Math.random): Aktion {
  const ich = zustand.gegner;
  const du = zustand.spieler;
  // Droht ein Spezialangriff des Spielers? Dann manchmal tarnen.
  const drohung = du.werte.spezial.some((a) => du.kraft >= a.kraft);
  if (drohung && ich.tarnen > 0 && zufall() < 0.4) return { typ: 'tarnen' };
  // stärksten bezahlbaren Spezialangriff meistens nutzen
  const moeglich = ich.werte.spezial
    .map((a, index) => ({ a, index }))
    .filter(({ a }) => ich.kraft >= a.kraft)
    .sort((x, y) => y.a.schaden - x.a.schaden);
  if (moeglich.length > 0 && zufall() < 0.75) return { typ: 'spezial', index: moeglich[0].index };
  return { typ: 'schnell' };
}

/**
 * Löst eine Runde auf. Verändert nichts, sondern gibt einen neuen Zustand zurück.
 * `stunde` = aktuelle Uhrzeit (für den Aktivzeit-Bonus), `zufall` im Test austauschbar.
 */
export function spieleRunde(
  zustand: KampfZustand,
  spielerAktion: Aktion,
  gegnerAktion: Aktion,
  stunde: number,
  zufall: () => number = Math.random,
): { zustand: KampfZustand; ereignisse: Ereignis[] } {
  if (zustand.sieger) return { zustand, ereignisse: [] };
  const k: Record<Seite, Kaempfer> = { spieler: { ...zustand.spieler }, gegner: { ...zustand.gegner } };
  const wahl: Record<Seite, Aktion> = {
    spieler: istMoeglich(k.spieler, spielerAktion) ? spielerAktion : { typ: 'schnell' },
    gegner: istMoeglich(k.gegner, gegnerAktion) ? gegnerAktion : { typ: 'schnell' },
  };
  const ereignisse: Ereignis[] = [];
  const getarnt: Record<Seite, boolean> = { spieler: false, gegner: false };

  // 1. Tarnen gilt sofort für die ganze Runde
  for (const s of ['spieler', 'gegner'] as const) {
    if (wahl[s].typ === 'tarnen') {
      k[s].tarnen -= 1;
      getarnt[s] = true;
      ereignisse.push({ typ: 'tarnen', wer: s });
    }
  }

  // 2. Angriffe in Tempo-Reihenfolge (bei Gleichstand entscheidet der Zufall, sonst wäre der Spieler im Vorteil)
  const tempoUnterschied = k.spieler.werte.tempo - k.gegner.werte.tempo;
  const spielerZuerst = tempoUnterschied > 0 || (tempoUnterschied === 0 && zufall() < 0.5);
  const reihenfolge: Seite[] = spielerZuerst ? ['spieler', 'gegner'] : ['gegner', 'spieler'];
  for (const s of reihenfolge) {
    const a = wahl[s];
    if (a.typ === 'tarnen') continue;
    const ziel: Seite = s === 'spieler' ? 'gegner' : 'spieler';
    const ich = k[s];
    const du = k[ziel];
    if (ich.ausdauer <= 0 || du.ausdauer <= 0) continue;

    const angriff = a.typ === 'schnell' ? ich.werte.schnell : ich.werte.spezial[a.index];
    if (a.typ === 'schnell') ich.kraft = Math.min(MAX_KRAFT, ich.kraft + angriff.kraft);
    else ich.kraft -= angriff.kraft;

    const geblockt = getarnt[ziel];
    const schaden = geblockt ? 0 : berechneSchaden(ich, angriff, du, stunde);
    const wirkung = geblockt ? 0 : Math.min(du.kraft, angriff.kraftRaub ?? 0);
    du.ausdauer = Math.max(0, du.ausdauer - schaden);
    du.kraft -= wirkung;
    ereignisse.push({ typ: 'angriff', wer: s, art: a.typ, name: angriff.name, schaden, geblockt, wirkung });
    if (du.ausdauer === 0) ereignisse.push({ typ: 'erschoepft', wer: ziel });
  }

  const sieger: Seite | null = k.gegner.ausdauer === 0 ? 'spieler' : k.spieler.ausdauer === 0 ? 'gegner' : null;
  return { zustand: { runde: zustand.runde + 1, spieler: k.spieler, gegner: k.gegner, sieger }, ereignisse };
}

/** Ein Ereignis als kurzer Satz für das Kampf-Protokoll */
export function beschreibe(e: Ereignis, z: KampfZustand): string {
  const name = z[e.wer].name;
  if (e.typ === 'tarnen') return `${name} tarnt sich.`;
  if (e.typ === 'erschoepft') return `${name} ist erschöpft und zieht sich zurück.`;
  if (e.geblockt) return `${name}: ${e.name} – verfehlt, der Gegner ist getarnt!`;
  const raub = e.wirkung > 0 ? `, ${e.wirkung} Kraft weg` : '';
  return `${name}: ${e.name} – ${e.schaden} Schaden${raub}.`;
}
