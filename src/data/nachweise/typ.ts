/**
 * Echte Verbreitung einer Art, erzeugt von `scripts/gbif-verbreitung.mjs`.
 * `zellen`: Rasterfeld "i-j" (TK25, wie in src/logic/verbreitung.ts) → Anzahl Nachweise.
 * Genauer als ein Rasterfeld wird nichts gespeichert (Schutz seltener Arten).
 */
export type EchteVerbreitung = {
  quelle: string;
  taxonKey: number;
  name: string;
  abgerufen: string;
  seit: number;
  lizenzen: string[];
  /** vom Prüf-Agenten ausgeschlossene Rasterfelder (Begründung in recherche/<artId>/verbreitung.md) */
  ausgeschlossen?: string[];
  funde: number;
  zellen: Record<string, number>;
};
