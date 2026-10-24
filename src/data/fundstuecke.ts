import type { ArtFundstuecke } from './fundstueckTypen';
import roh from './fundstuecke.json';

/**
 * Fundstücke je Art, erzeugt aus der Recherche (`node scripts/fundstuecke-bauen.mjs`).
 * Quellen je Fundstück stehen in den Daten, Notizen in `recherche/fundstuecke/*.md`.
 * TODO fachlich prüfen: Findbarkeit ist eine Einschätzung, manche Monate sind abgeleitet.
 */
// Der Aufbau wird in src/logic/__tests__/fundstueckDaten.test.ts geprüft
export const FUNDSTUECKE = roh as unknown as ArtFundstuecke[];

export const fundstueckeById: Record<string, ArtFundstuecke> = Object.fromEntries(FUNDSTUECKE.map((a) => [a.artId, a]));
