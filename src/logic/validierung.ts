import type { KategorieId } from '@/data/artTypen';

/**
 * Bilderkennung: Zeigt das Foto wirklich die erwartete Art?
 *
 * Eine Schnittstelle, zwei Umsetzungen:
 * - "demo": simuliert die Erkennung (wie im Prototyp) – zum Testen ohne Internet
 * - "echt": Pflanzen über Pl@ntNet – aber nie direkt, sondern über einen eigenen
 *   Server (server/), damit kein API-Schlüssel in der App steckt
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
/** Woher das Ergebnis stammt – damit die App ehrlich anzeigen kann, ob wirklich geprüft wurde */
export type Quelle = 'demo' | 'plantnet';

export type ServerOptionen = {
  /** Adresse des eigenen Erkennungsservers, z. B. https://wildfund-erkennung.<name>.workers.dev */
  url: string;
  /** zufällige Geräte-ID (nur für das Tageskontingent, keine persönlichen Daten) */
  geraetId: string;
  /** im Test austauschbar */
  senden?: typeof fetch;
};

/** Fehler mit einem Text, den man Jugendlichen direkt zeigen kann */
export class ErkennungsFehler extends Error {}

/** Echter Modus: Foto an den eigenen Server schicken, der Pl@ntNet fragt. */
export async function serverErkennung(fotoUri: string, o: ServerOptionen): Promise<Erkennung[]> {
  const form = new FormData();
  // React Native erwartet beim Hochladen von Dateien dieses Objekt (uri, name, type)
  form.append('foto', { uri: fotoUri, name: 'foto.jpg', type: 'image/jpeg' } as unknown as Blob);
  let antwort: Response;
  try {
    antwort = await (o.senden ?? fetch)(`${o.url.replace(/\/$/, '')}/erkennen`, {
      method: 'POST',
      headers: { 'x-wildfund-geraet': o.geraetId },
      body: form,
    });
  } catch {
    throw new ErkennungsFehler(
      'Keine Verbindung zur Bilderkennung. Bist du online? Du kannst es später noch einmal versuchen.',
    );
  }
  const daten = (await antwort.json().catch(() => ({}))) as { kandidaten?: Erkennung[]; fehler?: string };
  if (!antwort.ok) throw new ErkennungsFehler(daten.fehler ?? 'Die Bilderkennung ist gerade nicht erreichbar.');
  return daten.kandidaten ?? [];
}

/**
 * Die eine Schnittstelle für die App.
 * Echter Modus gilt nur für Pflanzen (Pl@ntNet). Pilze, Vögel und Säugetiere
 * werden weiter im Demo-Modus geprüft – das Ergebnis sagt das über `quelle`.
 */
export async function validatePhoto(
  foto: { uri: string },
  erwarteteArt: ErwarteteArt,
  optionen: { modus: PruefModus; demo: DemoOptionen; server?: ServerOptionen },
): Promise<Pruefergebnis & { quelle: Quelle }> {
  const echt = optionen.modus === 'echt' && erwarteteArt.kategorie === 'pflanzen';
  if (echt) {
    if (!optionen.server?.url) throw new ErkennungsFehler('Die echte Bilderkennung ist noch nicht eingerichtet.');
    const kandidaten = await serverErkennung(foto.uri, optionen.server);
    return { ...bewerte(kandidaten, erwarteteArt), quelle: 'plantnet' };
  }
  return { ...bewerte(demoErkennung(erwarteteArt, optionen.demo), erwarteteArt), quelle: 'demo' };
}

/** Kann die echte Erkennung diese Kategorie prüfen? */
export function echtPruefbar(kategorie: KategorieId): boolean {
  return kategorie === 'pflanzen';
}
