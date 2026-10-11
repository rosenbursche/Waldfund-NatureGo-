import type { KategorieId } from '@/data/artTypen';

/**
 * Bilderkennung: Zeigt das Foto wirklich die erwartete Art?
 *
 * Eine Schnittstelle, zwei Umsetzungen:
 * - "demo": simuliert die Erkennung (wie im Prototyp) – zum Testen ohne Internet
 * - "echt": kommt in Phase 8 (Pl@ntNet / iNaturalist über einen eigenen Server,
 *   damit kein API-Schlüssel in der App steckt)
 *
 * Ein Fund zählt nur, wenn die erkannte Art passt UND die Sicherheit hoch genug ist.
 */

export type PruefModus = 'demo' | 'echt';

/** Ab dieser Sicherheit zählt ein Treffer. TODO fachlich prüfen: in Phase 8 mit echten Fotos abstimmen. */
export const MIN_SICHERHEIT = 0.6;

export type ErwarteteArt = { id: string; name: string; lat: string; kategorie: KategorieId };

/** Was eine Erkennung liefert: Kandidaten mit Sicherheit 0–1 */
export type Erkennung = { lat: string; name?: string; sicherheit: number };

export type Pruefergebnis =
  | { status: 'treffer'; sicherheit: number }
  | { status: 'unsicher'; sicherheit: number; tipps: string[] }
  | { status: 'andereArt'; erkannt: Erkennung; tipps: string[] };

/** Lateinische Namen vergleichen, ohne auf Groß-/Kleinschreibung und Autorenkürzel zu achten */
function gleicheArt(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().trim().split(/\s+/).slice(0, 2).join(' ');
  return norm(a) === norm(b);
}

/**
 * Bewertet die Kandidaten einer Erkennung. Wird von beiden Modi benutzt.
 * - bester Kandidat = erwartete Art und sicher genug → Treffer
 * - erwartete Art dabei, aber zu unsicher → freundlich um ein besseres Foto bitten
 * - etwas anderes erkannt → sagen, was es vermutlich ist
 */
export function bewerte(kandidaten: Erkennung[], erwartet: ErwarteteArt): Pruefergebnis {
  const sortiert = [...kandidaten].sort((a, b) => b.sicherheit - a.sicherheit);
  const tipps = fototipps(erwartet.kategorie);
  const passend = sortiert.find((k) => gleicheArt(k.lat, erwartet.lat));
  if (passend && passend === sortiert[0] && passend.sicherheit >= MIN_SICHERHEIT) {
    return { status: 'treffer', sicherheit: passend.sicherheit };
  }
  if (passend || sortiert.length === 0) {
    return { status: 'unsicher', sicherheit: passend?.sicherheit ?? 0, tipps };
  }
  return { status: 'andereArt', erkannt: sortiert[0], tipps };
}

/** Tipps für ein besseres Foto – je nach Kategorie. Immer mit Rücksicht auf Tier und Pflanze. */
export function fototipps(kategorie: KategorieId): string[] {
  const allgemein = [
    'Sorge für gutes Licht und fotografiere nicht gegen die Sonne.',
    'Achte darauf, dass nur diese eine Art im Bild ist.',
  ];
  const speziell: Record<KategorieId, string[]> = {
    pflanzen: [
      'Geh nah heran: Blüte oder Blatt scharf und bildfüllend.',
      'Nicht pflücken – fotografiere die Pflanze dort, wo sie wächst.',
    ],
    pilze: [
      'Zeig Hut und Stiel von der Seite, ein zweites Foto von unten hilft.',
      'Den Pilz stehen lassen – nicht ausreißen.',
    ],
    voegel: ['Halte Abstand und nutze lieber den Zoom.', 'Warte, bis der Vogel still sitzt – nicht hinterhergehen.'],
    saeuger: [
      'Nie hinterherlaufen oder anlocken – Abstand halten, Zoom benutzen.',
      'Auch Spuren und Fraßspuren kannst du später fotografieren.',
    ],
  };
  return [...speziell[kategorie], ...allgemein];
}

export type DemoOptionen = {
  /** Anteil der Fotos, die "nicht erkannt" werden (0 = immer Treffer) */
  fehlschlagQuote: number;
  /** Zufallsquelle – im Test austauschbar */
  zufall?: () => number;
};

/** Demo-Modus: tut so, als würde erkannt. Kein Netz, kein Server. */
export function demoErkennung(erwartet: ErwarteteArt, o: DemoOptionen): Erkennung[] {
  const r = (o.zufall ?? Math.random)();
  if (r < o.fehlschlagQuote) {
    // simuliertes unscharfes Foto: richtige Art, aber zu unsicher
    return [{ lat: erwartet.lat, name: erwartet.name, sicherheit: 0.35 + r * 0.2 }];
  }
  return [{ lat: erwartet.lat, name: erwartet.name, sicherheit: 0.86 + r * 0.1 }];
}

/** Die eine Schnittstelle für die App. */
export async function validatePhoto(
  foto: { uri: string },
  erwarteteArt: ErwarteteArt,
  optionen: { modus: PruefModus; demo: DemoOptionen },
): Promise<Pruefergebnis> {
  if (optionen.modus === 'echt') {
    // Phase 8: Foto an den eigenen Server schicken, der Pl@ntNet bzw. iNaturalist fragt.
    throw new Error('Die echte Bilderkennung ist noch nicht eingerichtet (Phase 8).');
  }
  void foto; // im Demo-Modus wird das Foto nicht ausgewertet
  return bewerte(demoErkennung(erwarteteArt, optionen.demo), erwarteteArt);
}
