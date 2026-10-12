import { LICHTUNG, zufall } from './lichtung';

/**
 * Wo liegen die kleinen Details der 3D-Lichtung (Gras, Farne, Moos, Blumen, Steine, Pilze …)?
 * Reine Rechenlogik ohne 3D, damit sie testbar ist. Für jeden Naturraum immer gleich (Startwert).
 *
 * Freizuhalten: Hütte, Weg, Tümpel und die Runensteine – dort soll nichts hineinwachsen.
 */

export type Detail = { x: number; z: number; groesse: number; drehung: number; neigung: number; ton: number };

/** Weg von der Hüttentür (vorne, +z) nach außen, leicht geschwungen */
export function wegX(z: number): number {
  return -0.45 + Math.sin((z - 1) * 0.3) * 0.6;
}
export const WEG = { von: 1.05, bis: 14, breite: 0.55 };

/** Tümpel rechts neben der Hütte (Mitte, Halbachsen) */
export const TUEMPEL = { x: 4.3, z: 0.4, rx: 1.15, rz: 0.8 };

/** Runensteine – gleiche Positionen wie in Lichtung.tsx (dort die Quelle) */
const RUNEN: [number, number][] = [
  [3.6, 3.2],
  [-3.6, 3.2],
  [-3.8, -2.9],
  [3.8, -2.9],
];

/**
 * Feste Dinge rund um die Hütte: Holzstapel, Hackklotz, Laterne und Wegweiser am Weg, Bank und Regentonne
 * an der Hütte, Zaun dahinter, umgestürzter Stamm, Baumstümpfe und ein Hexenring aus Pilzen
 * (Pilze, die im Kreis aus einem unterirdischen Pilzgeflecht wachsen).
 */
export const AUSSTATTUNG = {
  holzstapel: { x: 2.5, z: -1.6, drehung: 0.3 },
  hackklotz: { x: 2.0, z: -0.6 },
  laterne: { x: wegX(4.2) + 0.85, z: 4.2 },
  wegweiser: { x: wegX(9) - 0.95, z: 9 },
  bank: { x: 0.75, z: 1.55 },
  regentonne: { x: -1.6, z: 1.2 },
  zaun: { von: -2.4, bis: 2.4, z: -3.4 },
  hexenring: { x: -6.6, z: 4.6, r: 0.85 },
  stamm: { x: -6.0, z: -0.8, drehung: 0.6 },
  stuempfe: [
    { x: -2.6, z: -4.1 },
    { x: 5.8, z: -3.2 },
    { x: 1.6, z: 6.4 },
  ],
};

/** Liegt der Punkt auf einer Fläche, die frei bleiben soll? `rand` = zusätzlicher Abstand */
export function istFrei(x: number, z: number, rand = 0): boolean {
  // Hütte (inkl. größerer Ausbaustufen mit Anbau und Turm)
  if (x > -2.9 - rand && x < 2.9 + rand && z > -2.3 - rand && z < 1.8 + rand) return false;
  // Weg
  if (z > WEG.von - rand && z < WEG.bis && Math.abs(x - wegX(z)) < WEG.breite + rand) return false;
  // Tümpel
  const tx = (x - TUEMPEL.x) / (TUEMPEL.rx + rand);
  const tz = (z - TUEMPEL.z) / (TUEMPEL.rz + rand);
  if (tx * tx + tz * tz < 1.15) return false;
  // Runensteine
  for (const [rx, rz] of RUNEN) if (Math.hypot(x - rx, z - rz) < 1.0 + rand) return false;
  // Ausstattung
  const a = AUSSTATTUNG;
  if (Math.hypot(x - a.laterne.x, z - a.laterne.z) < 0.4 + rand) return false;
  if (Math.hypot(x - a.wegweiser.x, z - a.wegweiser.z) < 0.4 + rand) return false;
  if (Math.hypot(x - a.hexenring.x, z - a.hexenring.z) < a.hexenring.r + 0.3 + rand) return false;
  if (Math.abs(z - a.zaun.z) < 0.3 + rand && x > a.zaun.von - rand && x < a.zaun.bis + rand) return false;
  if (Math.hypot(x - a.stamm.x, z - a.stamm.z) < 1.4 + rand) return false;
  for (const s of a.stuempfe) if (Math.hypot(x - s.x, z - s.z) < 0.5 + rand) return false;
  return true;
}

/**
 * Streut `anzahl` Details in einen Ring (innen … aussen) um die Hütte.
 * `haufen` > 0: Details bilden Grüppchen (wie echte Farn- oder Graspolster).
 */
export function streuen(
  startwert: number,
  anzahl: number,
  innen: number,
  aussen: number,
  opt: { rand?: number; haufen?: number; groesse?: [number, number] } = {},
): Detail[] {
  const rnd = zufall(startwert);
  const { rand = 0, haufen = 0, groesse = [0.8, 1.2] } = opt;
  const liste: Detail[] = [];
  let mitte = { x: 0, z: 0 };
  let versuche = 0;
  while (liste.length < anzahl && versuche < anzahl * 30) {
    versuche++;
    let x: number;
    let z: number;
    if (haufen > 0 && liste.length % 6 !== 0) {
      // in der Nähe der letzten Gruppenmitte
      x = mitte.x + (rnd() - 0.5) * haufen;
      z = mitte.z + (rnd() - 0.5) * haufen;
    } else {
      // gleichmäßig über die Ringfläche (Wurzel → keine Häufung in der Mitte)
      const w = rnd() * Math.PI * 2;
      const r = Math.sqrt(innen * innen + rnd() * (aussen * aussen - innen * innen));
      x = Math.cos(w) * r;
      z = Math.sin(w) * r;
      mitte = { x, z };
    }
    const r = Math.hypot(x, z);
    if (r < innen || r > aussen || !istFrei(x, z, rand)) continue;
    liste.push({
      x,
      z,
      groesse: groesse[0] + rnd() * (groesse[1] - groesse[0]),
      drehung: rnd() * Math.PI * 2,
      neigung: (rnd() - 0.5) * 0.5,
      ton: rnd(),
    });
  }
  return liste;
}

/** Trittsteine entlang des Weges */
export function trittsteine(startwert: number): Detail[] {
  const rnd = zufall(startwert);
  const liste: Detail[] = [];
  for (let z = WEG.von + 0.5; z < LICHTUNG.innen + 2.5; z += 0.62 + rnd() * 0.2) {
    liste.push({
      x: wegX(z) + (rnd() - 0.5) * 0.25,
      z,
      groesse: 0.2 + rnd() * 0.08,
      drehung: rnd() * Math.PI,
      neigung: 0,
      ton: rnd(),
    });
  }
  return liste;
}

/**
 * Bäume, die auf dem Weg, im Tümpel oder auf einem Runenstein stünden, ein Stück zur Seite rücken
 * (auf dem gleichen Kreis um die Hütte) – so bleibt der Blick den Weg entlang zur Hütte frei.
 */
export function baeumeFreiRuecken<T extends { x: number; z: number }>(plaetze: T[], abstand = 0.7): T[] {
  // Sichtachse: vor der Hütte bleibt ein breiter Streifen entlang des Weges frei (Baumkronen sind breit)
  const ok = (x: number, z: number) => istFrei(x, z, abstand) && !(z > 2 && Math.abs(x - wegX(z)) < 3.4);
  return plaetze.map((p) => {
    if (ok(p.x, p.z)) return p;
    const r = Math.hypot(p.x, p.z);
    const w = Math.atan2(p.z, p.x);
    for (let k = 1; k <= 30; k++) {
      // abwechselnd links und rechts suchen, immer etwas weiter
      const neu = w + (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2) * 0.08;
      const x = Math.cos(neu) * r;
      const z = Math.sin(neu) * r;
      if (ok(x, z)) return { ...p, x, z };
    }
    return p;
  });
}
