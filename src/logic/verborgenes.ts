import { zufall } from './lichtung';
import { straeucherPlaetze, streuen } from './lichtungDetails';
import type { Stimmung } from './tageszeit';

/**
 * Kleine, versteckte Dinge auf der Lichtung, die man erst beim genauen Hinsehen entdeckt:
 * Augenpaare im Gebüsch, die in der Dämmerung kurz aufleuchten und blinzeln, eine Maus, die
 * unter einem Baumstumpf hervorlugt, usw. Reine Zeit- und Ortslogik, damit sie testbar ist.
 *
 * Nur Stimmung, keine Spielmechanik: Nichts davon lässt sich antippen oder bringt Punkte
 * (keine Belohnung dafür, Tieren nachzustellen).
 */

const klemmen = (v: number) => Math.max(0, Math.min(1, v));

/** Wie dunkel ist es? 0 = heller Tag, 1 = Nacht. Augen leuchten nur, wenn es dämmert. */
export function dunkelheit(s: Pick<Stimmung, 'sterne' | 'lichtStaerke'>): number {
  return klemmen(Math.max(s.sterne, (0.95 - s.lichtStaerke) / 0.5));
}

export type Augenpaar = {
  x: number;
  y: number;
  z: number;
  abstand: number; // Abstand der beiden Augen
  periode: number; // Sekunden für einen Zyklus (auftauchen – schauen – verschwinden – Pause)
  phase: number; // 0–1, damit nicht alle gleichzeitig auftauchen
  ton: number; // 0–1, wählt die Farbe
};

/**
 * Augenpaare: an der Außenseite einiger Sträucher (kleine Tiere, tief)
 * und ein paar am Waldrand (größere Tiere, etwas höher und weiter auseinander).
 */
export function augenPlaetze(startwert: number): Augenpaar[] {
  const rnd = zufall(startwert + 31);
  const imGebuesch = straeucherPlaetze(startwert)
    .filter((_, i) => i % 5 === 2)
    .map((d) => {
      const r = Math.hypot(d.x, d.z);
      // an die Außenseite des Strauchs: die Kamera kreist außen um die Lichtung, die Tiere schauen also zu dir
      const vor = (r + d.groesse * 1.35 + 0.15) / r;
      return {
        x: d.x * vor,
        y: 0.3 + d.groesse * 0.6, // über dem Gras, im oberen Teil des Strauchs
        z: d.z * vor,
        abstand: 0.05,
        periode: 16 + rnd() * 14,
        phase: rnd(),
        ton: rnd(),
      };
    });
  const amWaldrand = streuen(startwert + 32, 4, 13, 16, { rand: 0.5 }).map((d) => ({
    x: d.x,
    y: 0.45 + rnd() * 0.2,
    z: d.z,
    abstand: 0.08,
    periode: 22 + rnd() * 16,
    phase: rnd(),
    ton: rnd(),
  }));
  return [...imGebuesch, ...amWaldrand];
}

/** Anteil eines Zyklus, in dem ein Augenpaar zu sehen ist */
const SICHTBAR_ANTEIL = 0.4;
const EINBLENDEN = 1.5; // Sekunden
const BLINZEL_TAKT = 3.7; // Sekunden
const BLINZEL_DAUER = 0.18; // Sekunden

/**
 * Zustand eines Augenpaares zur Zeit `t` (Sekunden):
 * `sichtbar` 0–1 (sanft auf- und abgeblendet), `offen` 0–1 (0 = Lider zu, beim Blinzeln).
 */
export function augenZustand(t: number, periode: number, phase: number): { sichtbar: number; offen: number } {
  const lokal = (((t + phase * periode) % periode) + periode) % periode;
  const dauer = periode * SICHTBAR_ANTEIL;
  if (lokal > dauer) return { sichtbar: 0, offen: 1 };
  const sichtbar = klemmen(Math.min(lokal, dauer - lokal) / EINBLENDEN);
  // Blinzeln: Lider schließen und öffnen sich in BLINZEL_DAUER
  const b = (lokal + phase * BLINZEL_TAKT) % BLINZEL_TAKT;
  const offen = b < BLINZEL_DAUER ? Math.abs(b - BLINZEL_DAUER / 2) / (BLINZEL_DAUER / 2) : 1;
  return { sichtbar, offen };
}

/** Maus am Baumstumpf: 0 = versteckt, 1 = ganz hervorgekommen. Kurz rausschauen, dann wieder weg. */
export function mausHervor(t: number, periode = 19): number {
  const lokal = ((t % periode) + periode) % periode;
  if (lokal > 5) return 0;
  // schnell raus, kurz innehalten, schnell wieder rein
  return klemmen(Math.min(lokal, 5 - lokal) / 0.6);
}

/** Eule: Kopfdrehung in Radiant. Eulen drehen den Kopf ruckartig und halten dann still. */
const EULEN_BLICKE = [0, 0.9, 0.9, -0.6, 0, 1.6, 0.3, -1.1];
export function euleKopf(t: number): number {
  const takt = 3.2;
  const i = Math.floor(t / takt);
  const n = EULEN_BLICKE.length;
  const von = EULEN_BLICKE[(((i - 1) % n) + n) % n];
  const nach = EULEN_BLICKE[((i % n) + n) % n];
  // Drehung in den ersten 0,35 s des Takts, danach Stillstand
  const f = klemmen((t - i * takt) / 0.35);
  const weich = f * f * (3 - 2 * f);
  return von + (nach - von) * weich;
}
