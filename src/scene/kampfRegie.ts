import type { Ereignis, Seite } from '@/logic/kampf';

/**
 * Regie für die Kampf-Arena: macht aus den Ereignissen einer Runde einen Ablauf
 * von Bewegungen (Angriff, Zurückzucken, Ausweichen, Hinlegen, Freuen).
 *
 * Als Klasse mit Methoden, damit die 3D-Szene die Werte in jedem Bild abfragen kann,
 * ohne React neu zu zeichnen (siehe Code-Regeln in CLAUDE.md).
 *
 * Das Test-Modell hat kein Skelett. Die Bewegungen sind deshalb Verschieben und Kippen
 * des ganzen Tiers. Mit echten Animationen (docs/KONZEPT-SPIELSYSTEM.md, 5.1) werden
 * sie später durch `angriff_schnell`, `angriff_spezial` usw. ersetzt.
 */

export type Bewegung = 'schnell' | 'spezial' | 'getroffen' | 'tarnen' | 'erschoepft' | 'sieg';

/** Dauer jeder Bewegung in Sekunden */
const DAUER: Record<Bewegung, number> = {
  schnell: 0.7,
  spezial: 1.4,
  getroffen: 0.5,
  tarnen: 0.9,
  erschoepft: 1.2,
  sieg: 1.4,
};
/** Zeitpunkt des Treffers innerhalb des Angriffs */
const AUFPRALL = { schnell: 0.3, spezial: 0.85 } as const;

/** Lage des Tiers relativ zur Grundstellung. „vor“ zeigt immer zum Gegner. */
export type Pose = { vor: number; hoch: number; seit: number; nick: number; kipp: number };

type Auftrag = { seite: Seite; bewegung: Bewegung; ab: number; start?: number };
type Treffer = { seite: Seite; spezial: boolean; ab: number; start?: number };

const glocke = (p: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
const sanft = (p: number) => {
  const x = Math.min(1, Math.max(0, p));
  return x * x * (3 - 2 * x);
};

export class KampfRegie {
  private auftraege: Auftrag[] = [];
  private treffer: Treffer[] = [];
  private liegt: Record<Seite, boolean> = { spieler: false, gegner: false };

  /** Plant die Bewegungen einer Runde. Gibt zurück, wie lange der Ablauf dauert (Sekunden). */
  abspielen(ereignisse: Ereignis[]): number {
    let t = 0;
    let tarnDauer = 0;
    for (const e of ereignisse) {
      const ziel: Seite = e.wer === 'spieler' ? 'gegner' : 'spieler';
      if (e.typ === 'tarnen') {
        // Tarnen passiert gleich zu Beginn, für beide gleichzeitig
        this.auftraege.push({ seite: e.wer, bewegung: 'tarnen', ab: 0 });
        tarnDauer = DAUER.tarnen * 0.5;
      } else if (e.typ === 'angriff') {
        t = Math.max(t, tarnDauer);
        this.auftraege.push({ seite: e.wer, bewegung: e.art, ab: t });
        if (!e.geblockt) {
          this.auftraege.push({ seite: ziel, bewegung: 'getroffen', ab: t + AUFPRALL[e.art] });
          this.treffer.push({ seite: ziel, spezial: e.art === 'spezial', ab: t + AUFPRALL[e.art] });
        }
        t += DAUER[e.art] + 0.15;
      } else {
        // erschöpft: legt sich hin, der andere freut sich
        this.auftraege.push({ seite: e.wer, bewegung: 'erschoepft', ab: t });
        this.auftraege.push({ seite: e.wer === 'spieler' ? 'gegner' : 'spieler', bewegung: 'sieg', ab: t + 0.6 });
        this.liegt[e.wer] = true;
        t += DAUER.erschoepft;
      }
    }
    return Math.max(t, tarnDauer * 2);
  }

  /** Neuer Kampf: alle stehen wieder */
  zuruecksetzen() {
    this.auftraege = [];
    this.treffer = [];
    this.liegt = { spieler: false, gegner: false };
  }

  /** Einmal pro Bild aufrufen: neue Aufträge bekommen ihre Startzeit */
  takt(zeit: number) {
    for (const a of this.auftraege) if (a.start === undefined) a.start = zeit + a.ab;
    for (const tr of this.treffer) if (tr.start === undefined) tr.start = zeit + tr.ab;
    // Fertige Bewegungen aufräumen (Hinlegen bleibt als Endstellung über `liegt` erhalten)
    this.auftraege = this.auftraege.filter((a) => zeit < (a.start ?? zeit) + DAUER[a.bewegung]);
    this.treffer = this.treffer.filter((tr) => zeit < (tr.start ?? zeit) + 0.6);
  }

  /** Lage eines Tiers zur Zeit `zeit`. Bei „Bewegung reduzieren“ nur die Endstellung. */
  pose(seite: Seite, zeit: number, ruhig: boolean): Pose {
    const p: Pose = { vor: 0, hoch: 0, seit: 0, nick: 0, kipp: 0 };
    const laeuftHinlegen = this.auftraege.some((a) => a.seite === seite && a.bewegung === 'erschoepft');
    if (this.liegt[seite] && (ruhig || !laeuftHinlegen)) liegen(p, 1);
    if (ruhig) return p;
    for (const a of this.auftraege) {
      if (a.seite !== seite || a.start === undefined || zeit < a.start) continue;
      bewege(p, a.bewegung, (zeit - a.start) / DAUER[a.bewegung]);
    }
    return p;
  }

  /** Leuchtring beim Treffer: 0 = aus, sonst Fortschritt 0–1 */
  trefferRing(seite: Seite, zeit: number): { fortschritt: number; spezial: boolean } | null {
    const tr = this.treffer.find((x) => x.seite === seite && x.start !== undefined && zeit >= x.start);
    if (!tr || tr.start === undefined) return null;
    return { fortschritt: (zeit - tr.start) / 0.6, spezial: tr.spezial };
  }

  /** Tarnschleier: Sichtbarkeit 0–1 */
  tarnung(seite: Seite, zeit: number): number {
    const a = this.auftraege.find((x) => x.seite === seite && x.bewegung === 'tarnen' && x.start !== undefined);
    if (!a || a.start === undefined || zeit < a.start) return 0;
    return glocke((zeit - a.start) / DAUER.tarnen);
  }
}

function liegen(p: Pose, f: number) {
  // Das Tier legt sich hin: sinkt etwas ein und kippt leicht zur Seite
  p.hoch -= 0.22 * f;
  p.kipp += 0.3 * f;
  p.nick += 0.12 * f;
}

function bewege(p: Pose, b: Bewegung, f: number) {
  switch (b) {
    case 'schnell': // kurzer Satz nach vorn, Kopf runter
      p.vor += glocke(f) * 0.55;
      p.hoch += glocke(f) * 0.08;
      p.nick += glocke(f) * 0.15;
      break;
    case 'spezial': {
      // aufbäumen, dann mit gesenktem Kopf nach vorn stoßen, zurück
      const auf = f < 0.35 ? glocke(f / 0.7) : f < 0.5 ? 1 - (f - 0.35) / 0.15 : 0;
      p.nick -= auf * 0.4;
      p.hoch += auf * 0.15;
      const stoss = f < 0.4 ? 0 : glocke((f - 0.4) / 0.6);
      p.vor += stoss * 1.0;
      p.nick += stoss * 0.28;
      break;
    }
    case 'getroffen': // zurückzucken und schütteln
      p.vor -= glocke(f) * 0.35;
      p.kipp += Math.sin(f * 28) * 0.06 * (1 - f);
      break;
    case 'tarnen': // Satz zur Seite (wie ein flüchtendes Reh)
      p.seit += glocke(f) * 0.6;
      p.hoch += glocke(f) * 0.35;
      break;
    case 'erschoepft':
      liegen(p, sanft(f));
      break;
    case 'sieg': // zwei kleine Sprünge, Kopf hoch
      p.hoch += Math.abs(Math.sin(f * Math.PI * 2)) * 0.22;
      p.nick -= glocke(f) * 0.15;
      break;
  }
}
