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
const zelle = (lon, lat) => `${Math.floor((lon - LON0) / DX)}-${Math.floor((lat - LAT0) / DY)}`;

const [artId, name, ...rest] = process.argv.slice(2);
if (!artId || !name) {
  console.log('Aufruf: node scripts/gbif-verbreitung.mjs <artId> "<wissenschaftlicher Name>" [--seit 2000]');
  process.exit(1);
}
const wert = (schalter) => (rest.includes(schalter) ? rest[rest.indexOf(schalter) + 1] : undefined);
const seit = Number(wert('--seit')) || 2000;
const ohne = new Set((wert('--ohne') ?? '').split(',').filter(Boolean));
const JAHR = new Date().getFullYear();

async function holen(pfad, versuche = 5) {
  for (let v = 0; v < versuche; v++) {
    try {
      const r = await fetch(API + pfad, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return r.json();
    } catch {
      // Netzwerkfehler – gleich nochmal
    }
    await new Promise((ok) => setTimeout(ok, 2000 * (v + 1)));
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

/** GBIF liefert höchstens 100 000 Treffer pro Suche – große Gebiete werden deshalb geviertelt */
async function boxen(box) {
  const n = await zaehlen(box);
  if (n === 0) return [];
  if (n <= 90000) return [{ box, n }];
  const mx = (box[0] + box[2]) / 2;
  const my = (box[1] + box[3]) / 2;
  const teile = [
    [box[0], box[1], mx, my],
    [mx, box[1], box[2], my],
    [box[0], my, mx, box[3]],
    [mx, my, box[2], box[3]],
  ];
  return (await Promise.all(teile.map(boxen))).flat();
}

const zellen = {};
let funde = 0;
const gebiete = await boxen([5.8, 47.2, 15.1, 55.1]);
console.log(`${name} (GBIF ${taxonKey}): ${gebiete.reduce((s, g) => s + g.n, 0)} Nachweise seit ${seit}`);

for (const { box, n } of gebiete) {
  const seiten = Math.ceil(n / 300);
  for (let start = 0; start < seiten; start += 4) {
    const runde = [];
    for (let s = start; s < Math.min(seiten, start + 4); s++) {
      runde.push(holen(`/occurrence/search?${filter(box)}&limit=300&offset=${s * 300}`));
    }
    for (const seite of await Promise.all(runde)) {
      for (const f of seite.results) {
        if (typeof f.decimalLongitude !== 'number') continue;
        const k = zelle(f.decimalLongitude, f.decimalLatitude);
        if (ohne.has(k)) continue;
        zellen[k] = (zellen[k] ?? 0) + 1;
        funde++;
      }
    }
    process.stdout.write(`\r  ${Math.min(funde, n)} / ${n}`);
  }
}
console.log();

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
