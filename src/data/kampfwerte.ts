/**
 * Kampfwerte der Tiere (Konzept: docs/KONZEPT-SPIELSYSTEM.md, Abschnitt 3).
 *
 * Alles hier ist eine Spiel-Vereinfachung. Die Werte leiten sich grob aus echten
 * Eigenschaften ab (Größe → Ausdauer, Schnelligkeit → Tempo), sind aber keine Messwerte.
 * TODO fachlich prüfen: Werte und Vorbilder je Art, Balance im Spieltest.
 */

/** Lebensweisen statt Pokémon-Typen */
export type Lebensweise = 'jaeger' | 'sammler' | 'graeber' | 'panzer' | 'flieger' | 'wasser';

export const LEBENSWEISE_NAME: Record<Lebensweise, string> = {
  jaeger: 'Jäger',
  sammler: 'Sammler',
  graeber: 'Gräber',
  panzer: 'Panzer',
  flieger: 'Flieger',
  wasser: 'Wasser',
};

/**
 * Wer ist stark gegen wen? Kern ist ein Kreis: Jäger → Sammler → Gräber → Panzer → Jäger.
 * Flieger und Wasser kommen dazu.
 */
export const STARK_GEGEN: Record<Lebensweise, Lebensweise[]> = {
  jaeger: ['sammler'],
  sammler: ['graeber'],
  graeber: ['panzer'],
  panzer: ['jaeger', 'flieger'],
  flieger: ['wasser'],
  wasser: ['jaeger'],
};

/** Wann ein Tier aktiv ist – zu dieser Tageszeit kämpft es stärker */
export type Aktivzeit = 'tag' | 'nacht' | 'daemmerung';

export type Angriff = {
  name: string;
  /** Grundschaden, bevor Stärke, Lebensweise und Tageszeit eingerechnet werden */
  schaden: number;
  /** Sofortangriff: so viel Kraft lädt er auf · Spezialangriff: so viel Kraft kostet er */
  kraft: number;
  /** Zusatzwirkung: dem Gegner Kraft abziehen */
  kraftRaub?: number;
  /** Das echte Verhalten, aus dem der Angriff stammt */
  vorbild: string;
};

export type Kampfwerte = {
  artId: string;
  lebensweisen: Lebensweise[];
  aktiv: Aktivzeit;
  /** Ausdauer statt Lebenspunkte. Ist sie leer, ist das Tier erschöpft und zieht sich zurück. */
  ausdauer: number;
  /** 100 = normal */
  staerke: number;
  /** Wer schneller ist, handelt in einer Runde zuerst */
  tempo: number;
  schnell: Angriff;
  spezial: Angriff[];
};

export const KAMPFWERTE: Record<string, Kampfwerte> = {
  // TODO fachlich prüfen
  reh: {
    artId: 'reh',
    lebensweisen: ['sammler'],
    aktiv: 'daemmerung',
    ausdauer: 100,
    staerke: 90,
    tempo: 130,
    schnell: {
      name: 'Vorderlauf-Schlag',
      schaden: 9,
      kraft: 15,
      vorbild: 'Rehe schlagen mit den Vorderläufen, zum Beispiel um ihr Kitz zu verteidigen.',
    },
    spezial: [
      {
        name: 'Geweihstoß',
        schaden: 38,
        kraft: 50,
        vorbild: 'Rehböcke messen sich im Sommer in der Paarungszeit mit dem Geweih.',
      },
      {
        name: 'Schrecken',
        schaden: 10,
        kraft: 30,
        kraftRaub: 25,
        vorbild: 'Bei Gefahr bellen Rehe laut – das nennt man „Schrecken“.',
      },
    ],
  },
};
