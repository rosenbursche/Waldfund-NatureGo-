/** Zustände, die Gesten (außerhalb) und 3D-Szene (innerhalb) gemeinsam nutzen – ohne three.js. */

export type Ziel = { typ: 'baum' | 'kategorie' | 'huette'; id?: string };

/**
 * Gemeinsamer Zustand zwischen Fingergesten (außerhalb der 3D-Szene) und Kamera (innerhalb).
 * Als eigene Klasse mit Methoden: Die Kamera liest die Werte in jedem Bild,
 * ohne dass React etwas neu zeichnen muss.
 */
export class Steuerung {
  winkel = 0.6; // Drehung um die Lichtung
  neigung = 0; // -1 (flach) bis 1 (von oben)
  private beruehrt = false;
  private tipp: { x: number; y: number } | null = null;

  ziehen(dx: number, dy: number): void {
    this.winkel -= dx * 0.008;
    this.neigung = Math.max(-1, Math.min(1, this.neigung + dy * 0.006));
  }
  fingerAuf(an: boolean): void {
    this.beruehrt = an;
  }
  tippen(x: number, y: number): void {
    this.tipp = { x, y };
  }
  /** Holt den letzten Tipp ab (danach ist er weg) */
  nimmTipp(): { x: number; y: number } | null {
    const t = this.tipp;
    this.tipp = null;
    return t;
  }
  /** Langsames Schweben um die Lichtung, solange kein Finger aufliegt */
  schweben(dt: number): void {
    if (!this.beruehrt) this.winkel += dt * 0.035;
  }
}

export type BildschirmPunkt = { id: string; x: number; y: number; sichtbar: boolean };

/**
 * Kleiner Nachrichtenkanal: Die 3D-Szene meldet Bildschirmpunkte,
 * die Beschriftungen darüber hören zu. So muss der Rest des Screens nicht neu zeichnen.
 */
export class PunkteKanal {
  private hoerer: ((p: BildschirmPunkt[]) => void) | null = null;
  abonnieren(f: (p: BildschirmPunkt[]) => void): () => void {
    this.hoerer = f;
    return () => {
      if (this.hoerer === f) this.hoerer = null;
    };
  }
  hatHoerer(): boolean {
    return this.hoerer !== null;
  }
  melden(p: BildschirmPunkt[]): void {
    this.hoerer?.(p);
  }
}

/** Drehung des Modells auf der Artenseite: dreht sich langsam, per Finger schneller oder zurück. */
export class Drehung {
  winkel = 0.5;
  private beruehrt = false;
  ziehen(dx: number): void {
    this.winkel += dx * 0.012;
  }
  fingerAuf(an: boolean): void {
    this.beruehrt = an;
  }
  weiter(dt: number, ruhig: boolean): void {
    if (!this.beruehrt && !ruhig) this.winkel += dt * 0.35;
  }
}

/** Kanal für die gemessene Bildrate (Bilder pro Sekunde) – für die Leistungsanzeige */
export class FpsKanal {
  private hoerer: ((fps: number) => void) | null = null;
  abonnieren(f: (fps: number) => void): () => void {
    this.hoerer = f;
    return () => {
      if (this.hoerer === f) this.hoerer = null;
    };
  }
  hatHoerer(): boolean {
    return this.hoerer !== null;
  }
  melden(fps: number): void {
    this.hoerer?.(fps);
  }
}
