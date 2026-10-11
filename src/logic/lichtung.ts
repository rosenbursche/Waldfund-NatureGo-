import type { HeimischerBaum } from './regelEngine';

/**
 * Wo stehen die Bäume auf der Lichtung?
 * Die Bäume bilden einen Ring um die Hütte. Die Hauptbaumart kommt am häufigsten vor.
 * Die Verteilung ist "zufällig", aber für jeden Naturraum immer gleich
 * (gleicher Startwert = gleiche Zufallszahlen).
 */

export type Platz = {
  baumId: string;
  x: number;
  z: number;
  /** Größenfaktor, damit nicht alle Bäume gleich aussehen */
  skala: number;
  /** Drehung um die eigene Achse (Bogenmaß) */
  drehung: number;
};

/** Kleiner, schneller Zufallsgenerator mit Startwert (mulberry32). */
export function zufall(startwert: number): () => number {
  let a = startwert >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function startwertAus(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Wie viele Bäume jeder Art? Jede Art mindestens einmal, Rest nach Anteil. */
export function anzahlJeArt(baeume: HeimischerBaum[], gesamt: number): Map<string, number> {
  const anzahl = new Map<string, number>();
  if (baeume.length === 0) return anzahl;
  const rest = Math.max(0, gesamt - baeume.length);
  for (const b of baeume) anzahl.set(b.baumart.id, 1 + Math.round(b.anteil * rest));
  return anzahl;
}

export const LICHTUNG = {
  innen: 5.2, // freier Platz um die Hütte
  aussen: 13, // äußerster Baumring
};

export function platziereBaeume(baeume: HeimischerBaum[], gesamt: number, startwert: number): Platz[] {
  const rnd = zufall(startwert);
  const liste: string[] = [];
  for (const [id, n] of anzahlJeArt(baeume, gesamt)) for (let i = 0; i < n; i++) liste.push(id);

  // Mischen (Fisher-Yates), damit gleiche Arten nicht alle nebeneinander stehen
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }

  return liste.map((baumId, i) => {
    // Gleichmäßig um den Kreis, mit etwas Unordnung
    const winkel = (i / liste.length) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
    const radius = LICHTUNG.innen + 0.8 + rnd() * (LICHTUNG.aussen - LICHTUNG.innen - 0.8);
    return {
      baumId,
      x: Math.cos(winkel) * radius,
      z: Math.sin(winkel) * radius,
      skala: 0.8 + rnd() * 0.45,
      drehung: rnd() * Math.PI * 2,
    };
  });
}
