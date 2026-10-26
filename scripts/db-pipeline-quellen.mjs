/**
 * Pipeline-Test C3, Schritt 1: Quellen laden (ohne KI, kostenlos).
 *
 *   node scripts/db-pipeline-quellen.mjs            (wählt 50 Arten und lädt ihre Quellen)
 *
 * Wählt je Gruppe die Arten mit den meisten GBIF-Nachweisen in Deutschland, die noch kein Sonderwissen haben,
 * und speichert für jede Art den Volltext der deutschen und englischen Wikipedia sowie die Wikidata-Sitelinks.
 * Ergebnis: recherche/pipeline-test/arten.json und recherche/pipeline-test/quellen/<artId>/*.
 *
 * Lizenz: Wikipedia-Text ist CC BY-SA 4.0. Er dient nur als Faktenquelle und wird nie wörtlich in die App
 * übernommen (Zitate bleiben in der Recherche als Beleg). Wikidata ist CC0.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = join(WURZEL, 'recherche', 'pipeline-test');
const UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-)';
// Anzahl je Gruppe (zusammen 50)
const JE_GRUPPE = { pflanzen: 15, pilze: 10, voegel: 13, saeuger: 12 };
// Haustiere gehören nicht in den Test
const AUSSCHLUSS = new Set(['Felis catus']);

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

async function holeJson(url) {
  for (let versuch = 0; versuch < 3; versuch++) {
    const antwort = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (antwort.ok) return antwort.json();
    await warte(2000 * (versuch + 1));
  }
  throw new Error(`Abruf fehlgeschlagen: ${url}`);
}

/** Artenauswahl: meiste Nachweise je Gruppe, mit Wikidata-ID, ohne vorhandenes Sonderwissen. */
function waehleArten() {
  const db = new DatabaseSync(join(WURZEL, 'db', 'wildfund.sqlite'));
  const mitSonderwissen = new Set(
    readdirSync(join(WURZEL, 'recherche', 'sonderwissen'))
      .filter((d) => d.endsWith('.json'))
      .map((d) => JSON.parse(readFileSync(join(WURZEL, 'recherche', 'sonderwissen', d), 'utf8')).colId),
  );
  const abfrage = db.prepare(`
    SELECT a.id, a.gruppe, a.wiss_name, a.col_id, a.wikidata_id, v.nachweise,
           (SELECT n.name FROM name n WHERE n.art_id = a.id AND n.sprache = 'de' AND n.haupt = 1) AS name_de
    FROM art a JOIN vorkommen v ON v.art_id = a.id AND v.gebiet = 'DE'
    WHERE a.gruppe = ? AND a.wikidata_id IS NOT NULL
    ORDER BY v.nachweise DESC LIMIT 60`);
  const arten = [];
  for (const [gruppe, anzahl] of Object.entries(JE_GRUPPE)) {
    const kandidaten = abfrage
      .all(gruppe)
      .filter((a) => !mitSonderwissen.has(a.col_id) && !AUSSCHLUSS.has(a.wiss_name));
    arten.push(...kandidaten.slice(0, anzahl));
  }
  return arten;
}

/** Volltext einer Wikipedia-Seite als reiner Text, mit Revisions-ID für die Nachprüfbarkeit. */
async function wikipediaText(sprache, titel) {
  const url =
    `https://${sprache}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1` +
    `&prop=extracts|revisions&explaintext=1&rvprop=ids&titles=${encodeURIComponent(titel)}`;
  const seite = (await holeJson(url)).query?.pages?.[0];
  if (!seite || seite.missing || !seite.extract) return null;
  return {
    titel: seite.title,
    url: `https://${sprache}.wikipedia.org/wiki/${encodeURIComponent(seite.title.replace(/ /g, '_'))}`,
    revision: seite.revisions?.[0]?.revid ?? null,
    lizenz: 'CC BY-SA 4.0',
    text: seite.extract,
  };
}

const arten = waehleArten();
mkdirSync(ZIEL, { recursive: true });
const heute = new Date().toISOString().slice(0, 10);
const uebersicht = [];

for (const art of arten) {
  const ordner = join(ZIEL, 'quellen', art.id);
  mkdirSync(ordner, { recursive: true });
  const meta = {
    artId: art.id,
    wissName: art.wiss_name,
    colId: art.col_id,
    wikidata: art.wikidata_id,
    abgerufen: heute,
    quellen: [],
  };
  if (!existsSync(join(ordner, 'meta.json'))) {
    const wd = await holeJson(`https://www.wikidata.org/wiki/Special:EntityData/${art.wikidata_id}.json`);
    const links = wd.entities?.[art.wikidata_id]?.sitelinks ?? {};
    for (const sprache of ['de', 'en']) {
      const titel = links[`${sprache}wiki`]?.title;
      if (!titel) continue;
      const seite = await wikipediaText(sprache, titel);
      if (!seite) continue;
      writeFileSync(join(ordner, `wiki-${sprache}.txt`), seite.text);
      meta.quellen.push({
        id: `wiki-${sprache}`,
        titel: `Wikipedia (${sprache}): ${seite.titel}`,
        url: seite.url,
        revision: seite.revision,
        lizenz: seite.lizenz,
        zeichen: seite.text.length,
      });
      await warte(300);
    }
    writeFileSync(join(ordner, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
    await warte(300);
  }
  const gespeichert = JSON.parse(readFileSync(join(ordner, 'meta.json'), 'utf8'));
  const zeichen = gespeichert.quellen.reduce((s, q) => s + q.zeichen, 0);
  uebersicht.push({
    artId: art.id,
    gruppe: art.gruppe,
    name: art.name_de,
    wissName: art.wiss_name,
    colId: art.col_id,
    nachweise: art.nachweise,
    quellen: gespeichert.quellen.map((q) => q.id),
    zeichen,
  });
  console.log(
    `${art.gruppe.padEnd(9)} ${String(art.name_de ?? art.wiss_name).padEnd(28)} ${String(zeichen).padStart(7)} Zeichen`,
  );
}

writeFileSync(join(ZIEL, 'arten.json'), JSON.stringify(uebersicht, null, 2) + '\n');
const summe = uebersicht.reduce((s, a) => s + a.zeichen, 0);
console.log(
  `\n${uebersicht.length} Arten, zusammen ${summe} Zeichen Quelltext (Schnitt ${Math.round(summe / uebersicht.length)} je Art)`,
);
