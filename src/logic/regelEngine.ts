import { BAUMARTEN } from '@/data/baumarten';
import type { Baumart, Naturraum, Rolle } from '@/data/typen';

/**
 * Regel-Engine: Welche Baumarten sind in einem Naturraum VON NATUR AUS heimisch?
 *
 * "Heimisch" heißt hier: Die Art käme dort ohne den Menschen vor.
 * Häufig gepflanzte Arten (z. B. Fichte im Flachland) zählen NICHT.
 *
 * Eine Art ist heimisch, wenn alles passt:
 *   1. Status "heimisch" (nicht aus anderen Kontinenten eingeführt)
 *   2. Großlandschaft passt
 *   3. Höhenstufe passt
 *   4. Boden passt (vorherrschender Boden oder ein Nebenboden)
 *   5. falls `heimisch_in` gesetzt ist: Naturraum oder Großlandschaft steht in der Liste
 */

export type HeimischerBaum = {
  baumart: Baumart;
  rolle: Rolle;
  /** Anteil in der Startszene, 0–1. Alle Anteile zusammen ergeben 1. */
  anteil: number;
  /** z. B. "an feuchten Stellen", wenn die Art nur auf einem Nebenboden wächst */
  hinweis?: string;
};

/**
 * Gewichte für die Anteile in der Szene.
 * Das ist eine Spiel-Vereinfachung, KEINE echten forstlichen Flächenanteile.
 */
const GEWICHT: Record<Rolle, number> = { haupt: 6, neben: 3, begleiter: 1 };
const ROLLEN_REIHENFOLGE: Rolle[] = ['haupt', 'neben', 'begleiter'];

const STANDORT_HINWEIS: Record<string, string> = {
  feucht: 'an feuchten Stellen',
  sandig: 'auf sandigen Stellen',
  kalkreich: 'auf Kalk',
  sauer: 'auf sauren Böden',
};

function heimischInListe(baum: Baumart, n: Naturraum): boolean {
  if (!baum.heimisch_in) return true;
  return baum.heimisch_in.includes(n.id) || baum.heimisch_in.includes(n.grosslandschaft);
}

/** Prüft Punkte 1–3 und 5. Der Boden wird getrennt geprüft. */
function passtOhneBoden(baum: Baumart, n: Naturraum): boolean {
  return (
    baum.status === 'heimisch' &&
    baum.grosslandschaften.includes(n.grosslandschaft) &&
    baum.hoehenstufen.includes(n.hoehenstufe) &&
    heimischInListe(baum, n)
  );
}

function bestimmeRolle(baum: Baumart, n: Naturraum): Rolle {
  for (const regel of baum.rollen ?? []) {
    const stufeOk = !regel.hoehenstufen || regel.hoehenstufen.includes(n.hoehenstufe);
    const bodenOk = !regel.boeden || regel.boeden.includes(n.boden);
    const raumOk = !regel.naturraeume || regel.naturraeume.includes(n.id);
    if (stufeOk && bodenOk && raumOk) return regel.rolle;
  }
  return 'begleiter';
}

/**
 * Liefert die heimischen Baumarten eines Naturraums,
 * sortiert nach Wichtigkeit (Hauptbaumart → Nebenbaumart → Begleiter).
 */
export function getHeimischeBaeume(n: Naturraum, baumarten: Baumart[] = BAUMARTEN): HeimischerBaum[] {
  const treffer: Omit<HeimischerBaum, 'anteil'>[] = [];

  for (const baum of baumarten) {
    if (!passtOhneBoden(baum, n)) continue;

    if (baum.boeden.includes(n.boden)) {
      treffer.push({ baumart: baum, rolle: bestimmeRolle(baum, n) });
    } else {
      // Wächst die Art nur auf einem Nebenboden, ist sie höchstens Begleiter.
      const nebenboden = n.nebenboeden.find((b) => baum.boeden.includes(b));
      if (nebenboden) {
        treffer.push({ baumart: baum, rolle: 'begleiter', hinweis: STANDORT_HINWEIS[nebenboden] });
      }
    }
  }

  const summe = treffer.reduce((s, t) => s + GEWICHT[t.rolle], 0);

  return treffer
    .map((t) => ({ ...t, anteil: summe > 0 ? GEWICHT[t.rolle] / summe : 0 }))
    .sort(
      (a, b) =>
        ROLLEN_REIHENFOLGE.indexOf(a.rolle) - ROLLEN_REIHENFOLGE.indexOf(b.rolle) ||
        a.baumart.name.localeCompare(b.baumart.name, 'de'),
    );
}

export function istHeimisch(baumId: string, n: Naturraum, baumarten: Baumart[] = BAUMARTEN): boolean {
  return getHeimischeBaeume(n, baumarten).some((t) => t.baumart.id === baumId);
}

/**
 * Häufig gepflanzte Arten, die in diesem Naturraum NICHT heimisch sind.
 * Damit kann die App z. B. "Fichte – hier angepflanzt, nicht heimisch" zeigen.
 */
export function getAngepflanzteBaeume(n: Naturraum, baumarten: Baumart[] = BAUMARTEN): Baumart[] {
  const heimisch = new Set(getHeimischeBaeume(n, baumarten).map((t) => t.baumart.id));
  return baumarten.filter((b) => b.forstlich_angebaut && !heimisch.has(b.id));
}

/** Kurzer Text für die Artenseite, z. B. "Fichte – hier angepflanzt, nicht heimisch". */
export function herkunftsText(baum: Baumart, n: Naturraum, baumarten: Baumart[] = BAUMARTEN): string {
  if (istHeimisch(baum.id, n, baumarten)) return `${baum.name} – hier von Natur aus heimisch`;
  if (baum.status === 'eingefuehrt') return `${baum.name} – angepflanzt, in Deutschland nicht heimisch`;
  if (baum.forstlich_angebaut) return `${baum.name} – hier angepflanzt, nicht heimisch`;
  return `${baum.name} – kommt hier von Natur aus nicht vor`;
}
