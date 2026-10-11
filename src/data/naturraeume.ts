import roh from './naturraeume.json';
import type { Geometrie, Naturraum } from './typen';

/**
 * Lädt die Naturräume aus der JSON-Datei und bringt sie in unser Datenformat.
 * Die JSON-Datei wird von `scripts/naturraeume-bauen.mjs` erzeugt – nicht von Hand ändern.
 *
 * Demo-Stand: 10 Naturräume mit echten (vereinfachten) Grenzen der forstlichen
 * Wuchsbezirke. TODO fachlich prüfen: Höhenstufe und Böden (siehe Skript).
 */

/** Pflicht-Namensnennung der Geodaten – muss in der App sichtbar sein (z. B. Einstellungen/Impressum). */
export const NATURRAUM_QUELLE: string = roh.quelle;

export const NATURRAEUME: Naturraum[] = roh.features.map((f) => {
  const { id, name, grosslandschaft, hoehenstufe, boden, nebenboeden, quelle, pruefen } = f.properties;
  return {
    id,
    name,
    grosslandschaft,
    hoehenstufe,
    boden,
    nebenboeden,
    quelle,
    pruefen,
    geometrie: f.geometry as Geometrie,
  } as Naturraum;
});

export const naturraumById: Record<string, Naturraum> = Object.fromEntries(NATURRAEUME.map((n) => [n.id, n]));
