import { zufall } from './lichtung';

/**
 * Aufbau des Zauberwalds (3D-Ansicht im Katalog), ohne three.js – damit testbar.
 *
 * Von innen nach außen:
 * - Mitte bis Radius ~11: moosige Lichtung, auf der die Arten stehen (siehe `waldPlaetze`)
 * - Ring aus uralten, knorrigen Moosbäumen (Radius 14–19), die das Bild einrahmen
 * - dahinter hohe, schlanke Stämme, die im Nebel verschwinden
 * - ein Hohlweg führt von der Lichtung nach hinten (−z) auf ein helles Licht im Nebel zu
 */

export type Streuung = { x: number; z: number; groesse: number; drehung: number; ton: number };

/** Der Hohlweg: beginnt am Rand der Lichtung und windet sich nach hinten ins Licht */
export const PFAD = { von: -10, bis: -46, breite: 1.3 } as const;

/** Mitte des Weges bei Tiefe z (leicht geschwungen) */
export function pfadX(z: number): number {
  const t = Math.max(0, -z - 10);
  return Math.sin(t * 0.11) * 2.6 + Math.sin(t * 0.045 + 1) * 1.5 - 1.2;
}

/** Wo das Licht am Ende des Weges steht */
export const LICHT_AM_ENDE = { x: pfadX(PFAD.bis), z: PFAD.bis, y: 4.5 };

/** Abstand eines Punktes zur Wegmitte – Infinity, wenn er nicht neben dem Weg liegt */
export function abstandZumPfad(x: number, z: number): number {
  if (z > PFAD.von + 1.5 || z < PFAD.bis - 4) return Infinity;
  return Math.abs(x - pfadX(z));
}

/**
 * Höhe des Bodens: Lichtung fast flach mit sanften Moospolstern,
 * außen Hügel, und der Hohlweg ist tief in den Boden eingeschnitten (Böschungen links und rechts).
 */
export function zauberBoden(x: number, z: number): number {
  const r = Math.hypot(x, z);
  const polster =
    (Math.sin(x * 1.3 + z * 0.4) * Math.sin(z * 1.1 - x * 0.5) + Math.sin(x * 0.55 - z * 0.75) * 0.6) * 0.09;
  const aussen = weich(r, 11, 26);
  let h = polster * (0.6 + aussen) + aussen * aussen * 2.4 + Math.sin(x * 0.23) * Math.cos(z * 0.19) * aussen * 0.8;
  // Hohlweg: Weg tief, Böschungen steigen steil an
  const d = abstandZumPfad(x, z);
  if (d < 6) {
    const tiefe = weich(-z, 11, 16); // am Lichtungsrand beginnt der Weg ebenerdig
    const graben = 1 - weich(d, PFAD.breite * 0.7, PFAD.breite * 2.6);
    const boeschung = weich(d, PFAD.breite * 1.6, 5.5) * (1 - weich(d, 4.5, 6));
    h += (boeschung * 1.6 - graben * (h + 0.25)) * tiefe;
  }
  return h;
}

/** weicher Übergang 0 → 1 zwischen a und b (wie smoothstep, ohne three.js) */
function weich(v: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

type Meiden = { x: number; z: number; r: number }[];

/**
 * Verstreut Dinge zufällig (aber immer gleich) auf einem Ring zwischen `innen` und `aussen`.
 * `meiden`: Kreise, in die nichts fallen darf (Arten); `pfad`: Mindestabstand zur Wegmitte.
 */
export function streueFrei(
  startwert: number,
  anzahl: number,
  innen: number,
  aussen: number,
  opt: { meiden?: Meiden; pfad?: number; haufen?: number; groesse?: [number, number]; nurPfadNaehe?: number } = {},
): Streuung[] {
  const rnd = zufall(startwert);
  const { meiden = [], pfad = 0, haufen = 0, groesse = [0.8, 1.2], nurPfadNaehe } = opt;
  const liste: Streuung[] = [];
  let mitte = { x: 0, z: 0 };
  for (let versuch = 0; liste.length < anzahl && versuch < anzahl * 40; versuch++) {
    let x: number;
    let z: number;
    if (haufen > 0 && liste.length % 5 !== 0) {
      x = mitte.x + (rnd() - 0.5) * haufen;
      z = mitte.z + (rnd() - 0.5) * haufen;
    } else if (nurPfadNaehe !== undefined) {
      // entlang der Böschungen des Hohlwegs
      z = PFAD.von - rnd() * (PFAD.von - PFAD.bis);
      x = pfadX(z) + (rnd() < 0.5 ? -1 : 1) * (pfad + rnd() * nurPfadNaehe);
      mitte = { x, z };
    } else {
      const w = rnd() * Math.PI * 2;
      const r = Math.sqrt(innen * innen + rnd() * (aussen * aussen - innen * innen));
      x = Math.cos(w) * r;
      z = Math.sin(w) * r;
      mitte = { x, z };
    }
    const r = Math.hypot(x, z);
    if (nurPfadNaehe === undefined && (r < innen || r > aussen)) continue;
    if (pfad > 0 && abstandZumPfad(x, z) < pfad) continue;
    if (meiden.some((m) => Math.hypot(x - m.x, z - m.z) < m.r)) continue;
    liste.push({
      x,
      z,
      groesse: groesse[0] + rnd() * (groesse[1] - groesse[0]),
      drehung: rnd() * Math.PI * 2,
      ton: rnd(),
    });
  }
  return liste;
}

export type UraltBaum = { x: number; z: number; skala: number; drehung: number; variante: number };

/**
 * Ring aus uralten Moosbäumen um die Lichtung. Am Weg bleibt eine Lücke,
 * dort stehen zwei Bäume, die sich wie ein Tor über den Weg neigen.
 */
export function uraltBaeume(startwert: number): UraltBaum[] {
  const rnd = zufall(startwert);
  const liste: UraltBaum[] = [];
  const anzahl = 13;
  const wegWinkel = Math.atan2(PFAD.von, pfadX(PFAD.von)); // Richtung, in der der Weg die Lichtung verlässt
  for (let i = 0; i < anzahl; i++) {
    const w = wegWinkel + ((i + 0.5) / anzahl) * Math.PI * 2 + (rnd() - 0.5) * 0.18;
    // Lücke für den Weg
    const abstandZumWeg = Math.abs(Math.atan2(Math.sin(w - wegWinkel), Math.cos(w - wegWinkel)));
    if (abstandZumWeg < 0.32) continue;
    // weit genug hinter der Kamerabahn (Abstand 12,5), damit kein Stamm direkt vor der Linse steht
    const r = 17 + rnd() * 3;
    liste.push({
      x: Math.cos(w) * r,
      z: Math.sin(w) * r,
      skala: 1.5 + rnd() * 0.5,
      drehung: rnd() * Math.PI * 2,
      variante: i % 3,
    });
  }
  // Torbäume links und rechts des Weges, etwas weiter hinten
  for (const [s, tiefe] of [
    [-1, -27],
    [1, -31],
  ] as const) {
    liste.push({
      x: pfadX(tiefe) + s * (PFAD.breite + 4),
      z: tiefe,
      skala: 1.6 + rnd() * 0.3,
      // so gedreht, dass die Hauptäste über den Weg ragen
      drehung: s < 0 ? 0.4 : Math.PI + 0.4,
      variante: (liste.length + 1) % 3,
    });
  }
  return liste;
}

/** Hohe, schlanke Stämme im Hintergrund (wie ein Buchenwald im Nebel) – der Weg bleibt frei */
export function hoheStaemme(startwert: number): Streuung[] {
  return streueFrei(startwert, 90, 19, 46, { pfad: PFAD.breite + 3, groesse: [0.7, 1.3] });
}
