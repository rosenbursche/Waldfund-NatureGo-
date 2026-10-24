/**
 * Stufe A der Arten-Datenbank: alle Arten in Deutschland automatisch laden (docs/DATENBANK-ARTEN.md, Abschnitt 6).
 *
 *   node scripts/db-stufe-a.mjs        (nach scripts/db-bauen.mjs; `npm run db` macht beides)
 *
 * Quellen (alle kommerziell nutzbar mit Namensnennung, siehe reports/Offene Artendatenbanken für Wildfund.md):
 * 1. GBIF: welche Arten in Deutschland seit 2000 nachgewiesen sind, mit Anzahl. Nur Nachweise unter CC0 oder CC BY 4.0,
 *    nur Beobachtungen (keine Zoo-, Museums- oder Fossilbelege). Arten-Nummern nach Catalogue of Life (COL XR).
 * 2. Catalogue of Life (ChecklistBank, CC BY 4.0): wissenschaftlicher Name, Autor, Klasse, Ordnung, Familie, Volksnamen.
 * 3. Wikidata (CC0): deutscher und englischer Hauptname (Bezeichnung), Wikidata-Nummer.
 *
 * Antworten werden in db/cache/ zwischengespeichert, damit ein zweiter Lauf nicht alles neu abfragt.
 * Vor einer Veröffentlichung: statt der Such-Schnittstelle einen GBIF-Download mit DOI erzeugen und zitieren.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(WURZEL, 'db', 'cache');
mkdirSync(CACHE, { recursive: true });
const UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-)';

/** COL-XR-Ausgabe, die GBIF zum Einordnen nutzt (GBIF-Checkliste und ChecklistBank-Datensatz) */
const COL_GBIF = '7ddf754f-d193-4cc9-b351-99906754a03b';
const COL_CLB = 315557;

/** Gruppen der App → Taxon im Catalogue of Life */
const GRUPPEN = [
  { gruppe: 'saeuger', taxon: '6224G', name: 'Säugetiere (Mammalia)' },
  { gruppe: 'voegel', taxon: 'V2', name: 'Vögel (Aves)' },
  { gruppe: 'pflanzen', taxon: 'TP', name: 'Gefäßpflanzen inkl. Bäume (Tracheophyta)' },
  { gruppe: 'pilze', taxon: '7C', name: 'Ständerpilze mit Fruchtkörpern (Agaricomycetes)' },
];

const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function holen(url, { json = true, kopf = {} } = {}) {
  for (let v = 0; v < 6; v++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, ...kopf }, signal: AbortSignal.timeout(60000) });
      if (r.ok) return json ? r.json() : r.text();
      if (r.status !== 429 && r.status < 500) throw new Error(`${r.status} bei ${url}`);
    } catch (e) {
      if (String(e.message).includes(' bei ')) throw e;
    }
    await warte(3000 * (v + 1));
  }
  throw new Error(`keine Antwort: ${url}`);
}

/** Abfrage mit Zwischenspeicher */
async function gemerkt(name, abfrage) {
  const datei = join(CACHE, `${name}.json`);
  if (existsSync(datei)) return JSON.parse(readFileSync(datei, 'utf8'));
  const daten = await abfrage();
  writeFileSync(datei, JSON.stringify(daten));
  return daten;
}

// ---------- 1. Arten in Deutschland (GBIF) ----------
const FILTER = [
  'country=DE',
  `checklistKey=${COL_GBIF}`,
  'license=CC0_1_0',
  'license=CC_BY_4_0',
  'occurrenceStatus=PRESENT',
  'year=2000,2026',
  'basisOfRecord=HUMAN_OBSERVATION',
  'basisOfRecord=OBSERVATION',
  'basisOfRecord=MACHINE_OBSERVATION',
].join('&');

const arten = new Map(); // col_id → { gruppe, nachweise }
for (const g of GRUPPEN) {
  const facette = await gemerkt(`gbif-de-${g.gruppe}`, () =>
    holen(
      `https://api.gbif.org/v1/occurrence/search?${FILTER}&taxonKey=${g.taxon}&limit=0&facet=speciesKey&facetLimit=100000`,
    ),
  );
  const zaehler = facette.facets?.[0]?.counts ?? [];
  for (const { name, count } of zaehler) arten.set(name, { gruppe: g.gruppe, nachweise: count });
  console.log(`${g.name}: ${zaehler.length} Arten, ${facette.count} Nachweise`);
}

// ---------- 2. Namen und Systematik (Catalogue of Life) ----------
const ids = [...arten.keys()];
const PAKET = 100;
for (let i = 0; i < ids.length; i += PAKET) {
  const teil = ids.slice(i, i + PAKET);
  const antwort = await gemerkt(`col-${COL_CLB}-${i}`, async () => {
    await warte(200);
    const q = teil.map((id) => `USAGE_ID=${encodeURIComponent(id)}`).join('&');
    return holen(`https://api.checklistbank.org/dataset/${COL_CLB}/nameusage/search?${q}&limit=${PAKET}`);
  });
  for (const r of antwort.result ?? []) {
    const a = arten.get(r.id);
    if (!a) continue;
    const rang = (rank) => r.classification?.find((c) => c.rank === rank)?.name;
    // Artname ohne Untergattung: „Sciurus (Sciurus) vulgaris“ → „Sciurus vulgaris“
    const n = r.usage?.name ?? {};
    a.wiss_name = n.genus && n.specificEpithet ? `${n.genus} ${n.specificEpithet}` : n.scientificName;
    a.autor = r.usage?.name?.authorship;
    a.status = r.usage?.status;
    a.klasse = rang('class');
    a.ordnung = rang('order');
    a.familie = rang('family');
    a.volksnamen = (r.vernacularNames ?? []).filter((v) => ['deu', 'eng'].includes(v.language));
  }
  if ((i / PAKET) % 20 === 0) console.log(`Catalogue of Life: ${i}/${ids.length}`);
}
console.log();

// ---------- 3. Hauptnamen (Wikidata) ----------
const WD_PAKET = 300;
for (let i = 0; i < ids.length; i += WD_PAKET) {
  const teil = ids.slice(i, i + WD_PAKET);
  const antwort = await gemerkt(`wikidata2-${i}`, async () => {
    await warte(1000);
    const werte = teil.map((id) => JSON.stringify(id)).join(' ');
    const q = `SELECT ?col ?item ?wiki ?de ?en WHERE { VALUES ?col { ${werte} } ?item wdt:P10585 ?col .
      OPTIONAL { ?artikel schema:about ?item ; schema:isPartOf <https://de.wikipedia.org/> ; schema:name ?wiki }
      OPTIONAL { ?item rdfs:label ?de FILTER(LANG(?de) = "de") }
      OPTIONAL { ?item rdfs:label ?en FILTER(LANG(?en) = "en") } }`;
    return holen(`https://query.wikidata.org/sparql?query=${encodeURIComponent(q)}`, {
      kopf: { Accept: 'application/sparql-results+json' },
    });
  });
  for (const b of antwort.results.bindings) {
    const a = arten.get(b.col.value);
    if (!a || a.wikidata_id) continue;
    a.wikidata_id = b.item.value.split('/').pop();
    a.de = b.de?.value;
    a.wiki = b.wiki?.value;
    a.en = b.en?.value;
  }
}
console.log();

// ---------- 4. In die Datenbank ----------
const db = new DatabaseSync(join(WURZEL, 'db', 'wildfund.sqlite'));
db.exec('PRAGMA foreign_keys = ON');
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const vorhanden = new Map(
  db
    .prepare('SELECT id, wiss_name FROM art')
    .all()
    .map((r) => [r.wiss_name, r.id]),
);
const vergeben = new Set(vorhanden.values());
const artNeu = db.prepare(
  `INSERT INTO art (id, gruppe, wiss_name, autor, col_id, klasse, ordnung, familie, wikidata_id)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
const artErgaenzen = db.prepare(
  'UPDATE art SET autor = ?, col_id = ?, klasse = ?, ordnung = ?, familie = ?, wikidata_id = ? WHERE id = ?',
);
const nameNeu = db.prepare('INSERT OR IGNORE INTO name (art_id, sprache, name, haupt) VALUES (?, ?, ?, ?)');
const vorkommenNeu = db.prepare(
  "INSERT INTO vorkommen (art_id, gebiet, status, nachweise) VALUES (?, 'DE', 'nachgewiesen', ?) " +
    'ON CONFLICT (art_id, gebiet) DO UPDATE SET nachweise = excluded.nachweise',
);

let neu = 0;
let ohneName = 0;
db.exec('BEGIN');
for (const [colId, a] of arten) {
  if (!a.wiss_name || a.status !== 'accepted') continue;
  let id = vorhanden.get(a.wiss_name);
  if (id) {
    artErgaenzen.run(
      a.autor ?? null,
      colId,
      a.klasse ?? null,
      a.ordnung ?? null,
      a.familie ?? null,
      a.wikidata_id ?? null,
      id,
    );
  } else {
    id = slug(a.wiss_name);
    // gleicher Kurzname bei zwei Arten (z. B. gleich geschriebene Namen in Tier- und Pflanzenreich): Nummer anhängen
    if (vergeben.has(id)) id = `${id}-${colId.toLowerCase()}`;
    vergeben.add(id);
    artNeu.run(
      id,
      a.gruppe,
      a.wiss_name,
      a.autor ?? null,
      colId,
      a.klasse ?? null,
      a.ordnung ?? null,
      a.familie ?? null,
      a.wikidata_id ?? null,
    );
    neu++;
  }
  // Deutscher Hauptname: Titel des deutschen Wikipedia-Artikels, sonst Wikidata-Bezeichnung, sonst ein Volksname
  // aus dem Catalogue of Life. Ist ein Kandidat nur der wissenschaftliche Name, zählt er nicht.
  const deutsch = (t) =>
    t && !t.startsWith(a.wiss_name) && !t.startsWith(a.wiss_name.split(' ')[0] + ' ')
      ? t.replace(/ \(.*\)$/, '')
      : undefined;
  const hauptDe = deutsch(a.wiki) ?? deutsch(a.de) ?? deutsch(a.volksnamen?.find((v) => v.language === 'deu')?.name);
  if (hauptDe && !vorhanden.has(a.wiss_name)) nameNeu.run(id, 'de', hauptDe, 1);
  else if (!hauptDe) ohneName++;
  if (a.en && a.en !== a.wiss_name) nameNeu.run(id, 'en', a.en, 1);
  for (const v of a.volksnamen ?? []) nameNeu.run(id, v.language === 'deu' ? 'de' : 'en', v.name, 0);
  vorkommenNeu.run(id, a.nachweise);
}
db.exec('COMMIT');

// Quelle für Stufe A eintragen (Namensnennung)
const quelleNeu = db.prepare('INSERT OR REPLACE INTO quelle (id, titel, url, abgerufen) VALUES (?, ?, ?, ?)');
const heute = new Date().toISOString().slice(0, 10);
quelleNeu.run('gbif-de', 'GBIF.org – Nachweise Deutschland seit 2000 (CC0, CC BY 4.0)', 'https://www.gbif.org', heute);
quelleNeu.run(
  'col-xr',
  'Catalogue of Life eXtended Release (CC BY 4.0)',
  'https://www.checklistbank.org/dataset/315557',
  heute,
);
quelleNeu.run('wikidata', 'Wikidata (CC0)', 'https://www.wikidata.org', heute);

// Übersicht zum Ansehen (GitHub zeigt CSV als Tabelle), nach Anzahl Nachweisen sortiert
const liste = db
  .prepare(
    `SELECT a.gruppe, a.wiss_name, de.name AS deutsch, en.name AS englisch, a.familie, v.nachweise, a.col_id, a.in_app
     FROM art a JOIN vorkommen v ON v.art_id = a.id AND v.gebiet = 'DE'
     LEFT JOIN name de ON de.art_id = a.id AND de.sprache = 'de' AND de.haupt = 1
     LEFT JOIN name en ON en.art_id = a.id AND en.sprache = 'en' AND en.haupt = 1
     ORDER BY a.gruppe, v.nachweise DESC`,
  )
  .all();
const feld = (w) => (w === null || w === undefined ? '' : `"${String(w).replace(/"/g, '""')}"`);
writeFileSync(
  join(WURZEL, 'db', 'export', 'stufe-a-deutschland.csv'),
  [Object.keys(liste[0]).join(','), ...liste.map((z) => Object.values(z).map(feld).join(','))].join('\n') + '\n',
);

const zahl = (sql) => db.prepare(sql).get().n;
console.log(`Neu: ${neu} Arten · ohne deutschen Namen: ${ohneName}`);
console.table(
  db
    .prepare(
      `SELECT gruppe, count(*) AS arten,
         sum(EXISTS (SELECT 1 FROM name n WHERE n.art_id = art.id AND n.sprache = 'de' AND n.haupt = 1)) AS mit_deutschem_namen,
         sum((SELECT nachweise FROM vorkommen v WHERE v.art_id = art.id AND v.gebiet = 'DE') >= 10) AS ab_10_nachweisen
       FROM art GROUP BY gruppe`,
    )
    .all(),
);
console.log(`Arten gesamt: ${zahl('SELECT count(*) n FROM art')}`);
db.close();
