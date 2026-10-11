/**
 * Reine Logik des Erkennungs-Servers – ohne Netzwerk, damit sie sich testen lässt.
 * Wird von server/src/index.ts (Cloudflare Worker) benutzt.
 */

/** Ein Kandidat, so wie die App ihn erwartet (siehe src/logic/validierung.ts) */
export type Kandidat = { lat: string; name?: string; sicherheit: number };

/** Antwort von Pl@ntNet (nur die Felder, die wir brauchen) */
export type PlantnetAntwort = {
  results?: { score: number; species?: { scientificNameWithoutAuthor?: string; commonNames?: string[] } }[];
  remainingIdentificationRequests?: number;
};

/** Pl@ntNet-Ergebnis → Kandidatenliste für die App (höchstens 5, nach Sicherheit sortiert) */
export function zuKandidaten(antwort: PlantnetAntwort): Kandidat[] {
  return (antwort.results ?? [])
    .filter((r) => r.species?.scientificNameWithoutAuthor)
    .map((r) => ({
      lat: r.species!.scientificNameWithoutAuthor!,
      name: r.species!.commonNames?.[0],
      sicherheit: Math.max(0, Math.min(1, r.score)),
    }))
    .sort((a, b) => b.sicherheit - a.sicherheit)
    .slice(0, 5);
}

/**
 * Kontingent-Regeln:
 * - pro Gerät höchstens GERAET_PRO_TAG Anfragen am Tag
 * - insgesamt höchstens GESAMT_PRO_TAG (Pl@ntNet erlaubt kostenlos 500 pro Tag)
 */
export const GERAET_PRO_TAG = 20;
export const GESAMT_PRO_TAG = 450;

export function kontingentOk(geraetHeute: number, gesamtHeute: number): { ok: true } | { ok: false; grund: string } {
  if (gesamtHeute >= GESAMT_PRO_TAG)
    return { ok: false, grund: 'Für heute sind alle Erkennungen verbraucht. Morgen geht es weiter!' };
  if (geraetHeute >= GERAET_PRO_TAG)
    return { ok: false, grund: `Du hast heute schon ${GERAET_PRO_TAG} Fotos prüfen lassen. Morgen geht es weiter!` };
  return { ok: true };
}

/** Geräte-ID prüfen: nur eine zufällige ID aus der App, keine persönlichen Daten */
export function geraetIdGueltig(id: string | null): id is string {
  return !!id && /^[a-z0-9-]{16,64}$/i.test(id);
}

/** Tages-Schlüssel in UTC (so zählt auch Pl@ntNet) */
export function utcTag(jetzt: Date): string {
  return jetzt.toISOString().slice(0, 10);
}
