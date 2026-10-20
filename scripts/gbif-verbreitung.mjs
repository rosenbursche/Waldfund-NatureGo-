/**
 * Echte Verbreitung aus GBIF (Global Biodiversity Information Facility).
 *
 *   node scripts/gbif-verbreitung.mjs <artId> "<wissenschaftlicher Name>" [--seit 2000] [--ohne 41-22,40-22]
 *
 * - Holt alle Nachweise der Art in Deutschland mit Koordinaten, ohne Geo-Fehler, ab dem Jahr `--seit`,
 *   und NUR aus frei nutzbaren Datensätzen (CC0 und CC BY 4.0 – keine NC-Lizenzen).
 * - Nur Beobachtungen in freier Natur (keine Zoo-/Gehegetiere = LIVING_SPECIMEN, keine Museumsbelege).
 * - `--ohne`: Rasterfelder, die der Prüf-Agent nach Abgleich mit Fachkarten ausschließt (z. B. Wildpark);
 *   die Begründung steht in `recherche/<artId>/verbreitung.md`.
 * - Ordnet jeden Nachweis einem Messtischblatt-Rasterfeld (TK25: 10′ × 6′) zu – genau das Raster
 *   der App-Karte (`src/logic/verbreitung.ts`). Genauer als ein Rasterfeld wird NICHTS gespeichert.
 * - Schreibt `src/data/nachweise/<artId>.json` und baut `src/data/nachweise/index.ts` neu.
 *
 * Hinweis: Nachweise zeigen, wo die Art gemeldet wurde – nicht jedes leere Feld heißt „kommt nicht vor“.
 * Vor einer Veröffentlichung: GBIF-Download mit DOI erzeugen und zitieren (siehe DATENQUELLEN.md).
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-; Lernprojekt)';
const API = 'https://api.gbif.org/v1';
const ZIEL = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'nachweise');

// Raster wie in src/logic/verbreitung.ts
const DX = 1 / 6;
const DY = 0.1;
const LON0 = 5.9;
const LAT0 = 47.3;

const [artId, name, ...rest] = process.argv.slice(2);
if (!artId || !name) {
  console.log('Aufruf: node scripts/gbif-verbreitung.mjs <artId> "<wissenschaftlicher Name>" [--seit 2000]');
  process.exit(1);
}
const wert = (schalter) => (rest.includes(schalter) ? rest[rest.indexOf(schalter) + 1] : undefined);
const seit = Number(wert('--seit')) || 2000;
const ohne = new Set((wert('--ohne') ?? '').split(',').filter(Boolean));
const JAHR = new Date().getFullYear();

async function holen(pfad, versuche = 8) {
  for (let v = 0; v < versuche; v++) {
    let warten = 2000 * (v + 1);
    try {
      const r = await fetch(API + pfad, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return r.json();
      // 429 = zu viele Anfragen: GBIF bremst – deutlich länger warten
      if (r.status === 429) warten = 10000 * (v + 1);
    } catch {
      // Netzwerkfehler oder Zeitüberschreitung – gleich nochmal
    }
    await new Promise((ok) => setTimeout(ok, warten));
  }
  throw new Error(`GBIF antwortet nicht: ${pfad}`);
}

const treffer = await holen(`/species/match?name=${encodeURIComponent(name)}`);
if (!treffer.usageKey || treffer.rank !== 'SPECIES') {
  console.log('Art nicht eindeutig gefunden:', treffer);
  process.exit(1);
}
const taxonKey = treffer.usageKey;

const filter = (box) =>
  `taxonKey=${taxonKey}&country=DE&hasCoordinate=true&hasGeospatialIssue=false&occurrenceStatus=PRESENT` +
  `&year=${seit},${JAHR}&license=CC0_1_0&license=CC_BY_4_0` +
  `&basisOfRecord=HUMAN_OBSERVATION&basisOfRecord=MACHINE_OBSERVATION&basisOfRecord=OBSERVATION` +
  `&decimalLongitude=${box[0]},${box[2]}&decimalLatitude=${box[1]},${box[3]}`;

const zaehlen = async (box) => (await holen(`/occurrence/search?${filter(box)}&limit=0`)).count;

/**
 * Zählt die Nachweise je Rasterfeld, ohne Einzelfunde herunterzuladen (das wäre sehr langsam):
 * Ein Bereich aus Rasterfeldern wird gezählt; ist er leer, fällt er weg, sonst wird er halbiert –
 * bis hinunter zu einem einzelnen Rasterfeld. Seltene Arten brauchen so nur wenige Anfragen.
 */
const zellen = {};
let anfragen = 0;
const warteschlange = [];
let laufend = 0;
const GLEICHZEITIG = 6;
function begrenzt(aufgabe) {
  return new Promise((fertig, fehler) => {
    const los = async () => {
      laufend++;
      try {
        fertig(await aufgabe());
      } catch (e) {
        fehler(e);
      } finally {
        laufend--;
        warteschlange.shift()?.();
      }
    };
    if (laufend < GLEICHZEITIG) los();
    else warteschlange.push(los);
  });
}

async function bereich(i0, i1, j0, j1) {
  // Rasterfelder i0 … i1-1 (Länge) und j0 … j1-1 (Breite); kleiner Abstand am Rand gegen Doppelzählung
  const box = [LON0 + i0 * DX, LAT0 + j0 * DY, LON0 + i1 * DX - 1e-6, LAT0 + j1 * DY - 1e-6];
  const n = await begrenzt(() => zaehlen(box));
  anfragen++;
  if (anfragen % 50 === 0) process.stdout.write(`\r  ${anfragen} Anfragen, ${Object.keys(zellen).length} Felder`);
  if (n === 0) return;
  if (i1 - i0 === 1 && j1 - j0 === 1) {
    const k = `${i0}-${j0}`;
    if (!ohne.has(k)) zellen[k] = n;
    return;
  }
  if (i1 - i0 >= j1 - j0) {
    const m = Math.floor((i0 + i1) / 2);
    await Promise.all([bereich(i0, m, j0, j1), bereich(m, i1, j0, j1)]);
  } else {
    const m = Math.floor((j0 + j1) / 2);
    await Promise.all([bereich(i0, i1, j0, m), bereich(i0, i1, m, j1)]);
  }
}

// Deutschland: Länge 5.9 … 15.1 (56 Felder), Breite 47.3 … 55.1 (78 Felder)
const gesamt = await zaehlen([LON0, LAT0, LON0 + 56 * DX, LAT0 + 78 * DY]);
console.log(`${name} (GBIF ${taxonKey}): ${gesamt} Nachweise seit ${seit}`);
await bereich(0, 56, 0, 78);
const funde = Object.values(zellen).reduce((s, n) => s + n, 0);
console.log(`\r  ${anfragen} Anfragen`);

mkdirSync(ZIEL, { recursive: true });
const daten = {
  quelle: 'GBIF.org',
  taxonKey,
  name: treffer.scientificName,
  abgerufen: new Date().toISOString().slice(0, 10),
  seit,
  lizenzen: ['CC0 1.0', 'CC BY 4.0'],
  ausgeschlossen: [...ohne],
  funde,
  zellen,
};
writeFileSync(join(ZIEL, `${artId}.json`), JSON.stringify(daten) + '\n');
console.log(`→ src/data/nachweise/${artId}.json: ${Object.keys(zellen).length} Rasterfelder`);

// Verzeichnis aller Arten mit echten Daten neu schreiben (statische requires für Metro)
const ids = readdirSync(ZIEL)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.slice(0, -5))
  .sort();
writeFileSync(
  join(ZIEL, 'index.ts'),
  `// Erzeugt von scripts/gbif-verbreitung.mjs – nicht von Hand ändern.\n` +
    `import type { EchteVerbreitung } from './typ';\n\n` +
    `export const ECHTE_VERBREITUNG: Record<string, EchteVerbreitung> = {\n` +
    ids.map((id) => `  '${id}': require('./${id}.json'),`).join('\n') +
    `\n};\n`,
);
