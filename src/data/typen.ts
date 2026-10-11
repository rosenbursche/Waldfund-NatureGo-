/**
 * Gemeinsame Datentypen für Naturräume und Baumarten.
 * TypeScript prüft damit, dass in den Datendateien keine Tippfehler stehen
 * (z. B. "montann" statt "montan").
 */

export type Grosslandschaft = 'tiefland' | 'mittelgebirge' | 'alpenvorland' | 'alpen';

/** Höhenstufen von unten nach oben */
export type Hoehenstufe = 'planar' | 'kollin' | 'submontan' | 'montan' | 'hochmontan';

export type Boden = 'sauer' | 'kalkreich' | 'sandig' | 'feucht';

export const GROSSLANDSCHAFT_NAME: Record<Grosslandschaft, string> = {
  tiefland: 'Norddeutsches Tiefland',
  mittelgebirge: 'Mittelgebirge',
  alpenvorland: 'Alpenvorland',
  alpen: 'Alpen',
};

export const HOEHENSTUFE_NAME: Record<Hoehenstufe, string> = {
  planar: 'planar (Tiefland)',
  kollin: 'kollin (Hügelland)',
  submontan: 'submontan (untere Berglagen)',
  montan: 'montan (Bergland)',
  hochmontan: 'hochmontan (Hochlagen)',
};

export const BODEN_NAME: Record<Boden, string> = {
  sauer: 'sauer, nährstoffarm',
  kalkreich: 'kalkreich, nährstoffreich',
  sandig: 'sandig',
  feucht: 'feucht bis moorig',
};

/** GeoJSON-Geometrie (nur die beiden Typen, die wir brauchen) */
export type Ring = [number, number][];
export type Geometrie =
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] };

export type Naturraum = {
  id: string;
  name: string;
  grosslandschaft: Grosslandschaft;
  /** typische Höhenstufe */
  hoehenstufe: Hoehenstufe;
  /** vorherrschender Boden */
  boden: Boden;
  /** Böden, die kleinflächig vorkommen, z. B. nasse Senken und Moore */
  nebenboeden: Boden[];
  /** Herkunft der Grenzen */
  quelle: string;
  /** true = Eigenschaften noch nicht fachlich geprüft */
  pruefen: boolean;
  geometrie: Geometrie;
};

export type Rolle = 'haupt' | 'neben' | 'begleiter';

/** Bedingung für eine Rolle. Leere Felder bedeuten "egal". */
export type RollenRegel = {
  hoehenstufen?: Hoehenstufe[];
  boeden?: Boden[];
  naturraeume?: string[];
  rolle: Rolle;
};

/** Parameter für den prozeduralen 3D-Baum (Phase 3) */
export type BaumModell = {
  krone: 'rund' | 'ausladend' | 'kegel' | 'kegel-flach' | 'schirm' | 'haengend' | 'oval' | 'saeule';
  /** Farbe von Laub/Nadeln */
  laub: string;
  /** Farbe der Rinde */
  rinde: string;
  /** relative Höhe, 1 = Durchschnitt */
  hoehe: number;
};

export type Baumart = {
  id: string;
  name: string;
  lat: string;
  /** heimisch = gehört zur Startliste; eingefuehrt = nicht heimisch in Deutschland */
  status: 'heimisch' | 'eingefuehrt';
  hoehenstufen: Hoehenstufe[];
  boeden: Boden[];
  grosslandschaften: Grosslandschaft[];
  /**
   * Engere Einschränkung des natürlichen Vorkommens:
   * Liste von Naturraum-IDs oder Großlandschaften.
   * Fehlt das Feld, gilt die Art überall dort als heimisch, wo
   * Großlandschaft, Höhenstufe und Boden passen.
   */
  heimisch_in?: string[];
  /** Wird in Deutschland häufig forstlich angepflanzt (auch außerhalb des natürlichen Gebiets) */
  forstlich_angebaut?: boolean;
  /** Erste passende Regel bestimmt die Rolle, sonst "begleiter" */
  rollen?: RollenRegel[];
  modell: BaumModell;
};
