import roh from './karte.json';
import type { Geometrie } from './typen';

/**
 * Daten für die lebendige Deutschlandkarte (erzeugt mit scripts/karte-bauen.mjs):
 * Wuchsgebiete (Flächen für die Verbreitung), Großlandschaften (Untergrund), große Flüsse.
 * Dazu von Hand: bekannte Gebirge und große Waldgebiete als Kartensymbole.
 */
type LinienGeo =
  | { type: 'LineString'; coordinates: [number, number][] }
  | { type: 'MultiLineString'; coordinates: [number, number][][] };

export const KARTEN_QUELLE: string = roh.quelle;
/** Genauer Umriss Deutschlands (aus den Großlandschaften verschmolzen) */
export const UMRISS = roh.umriss as Geometrie;
export const WUCHSGEBIETE = roh.gebiete as { id: number; name: string; geo: Geometrie }[];
export const GROSSLANDSCHAFTEN = roh.landschaften as { name: string; geo: Geometrie }[];
export const FLUESSE = roh.fluesse as { name: string; geo: LinienGeo }[];

/** Bekannte Gebirge als Bergsymbole (Lage ungefähr) */
/** dx/dy: Verschiebung der Beschriftung, damit sich nichts überlappt */
export const GEBIRGE: { name: string; lon: number; lat: number; hoch?: boolean; dx?: number; dy?: number }[] = [
  { name: 'Harz', lon: 10.62, lat: 51.78, dx: -16, dy: -2 },
  { name: 'Thüringer Wald', lon: 10.75, lat: 50.65, dx: 4, dy: -26 },
  { name: 'Erzgebirge', lon: 13.0, lat: 50.55 },
  { name: 'Fichtelgebirge', lon: 11.85, lat: 50.05, dx: -26, dy: 2 },
  { name: 'Bayerischer Wald', lon: 13.3, lat: 49.0 },
  { name: 'Schwarzwald', lon: 8.15, lat: 48.1, dx: 6 },
  { name: 'Schwäbische Alb', lon: 9.4, lat: 48.4, dx: 10 },
  { name: 'Rhön', lon: 9.95, lat: 50.45, dx: -10 },
  { name: 'Eifel', lon: 6.7, lat: 50.3 },
  { name: 'Sauerland', lon: 8.2, lat: 51.2 },
  { name: 'Alpen', lon: 11.0, lat: 47.55, hoch: true },
];

/**
 * Große, waldreiche Gebiete (Wuchsgebiet-Nummern) – bekommen Baumsymbole.
 * TODO fachlich prüfen: Auswahl nach Bekanntheit, nicht nach gemessenem Waldanteil
 * (genauer ginge es später mit CORINE-Landbedeckungsdaten).
 */
export const WALDGEBIETE = [13, 24, 36, 40, 53, 56, 57, 58, 63, 64, 66, 72, 73, 79];
