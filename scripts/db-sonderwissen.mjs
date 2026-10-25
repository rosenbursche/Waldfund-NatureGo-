/**
 * Lädt das Sonderwissen je Art aus recherche/sonderwissen/*.json in die Datenbank (docs/KONZEPT-GESAMT.md Abschnitt 11).
 *
 *   node scripts/db-sonderwissen.mjs   (nach db-bauen und db-stufe-a; `npm run db` macht alles)
 *
 * Die Art wird über die Catalogue-of-Life-Nummer (colId) gefunden, nicht über den Kurznamen.
 * Jede Datei wird vorher geprüft (db/felder/sonderwissen.mjs). Bei Fehlern bricht das Skript ab.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import { pruefeSonderwissen } from '../db/felder/sonderwissen.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = join(WURZEL, 'recherche', 'sonderwissen');
const db = new DatabaseSync(join(WURZEL, 'db', 'wildfund.sqlite'));
db.exec('PRAGMA foreign_keys = ON; DELETE FROM sonderwissen;');

const dateien = readdirSync(ORDNER)
  .filter((d) => d.endsWith('.json'))
  .map((d) => JSON.parse(readFileSync(join(ORDNER, d), 'utf8')));

const fehler = dateien.flatMap(pruefeSonderwissen);
const artNachCol = db.prepare('SELECT id FROM art WHERE col_id = ?');
for (const d of dateien) if (!artNachCol.get(d.colId)) fehler.push(`${d.artId}: COL-ID ${d.colId} nicht in der Datenbank`);
if (fehler.length) {
  console.error(fehler.join('\n'));
  process.exit(1);
}

const quelleNeu = db.prepare('INSERT OR REPLACE INTO quelle (id, titel, url, abgerufen) VALUES (?, ?, ?, ?)');
const eintragNeu = db.prepare(
  `INSERT INTO sonderwissen (art_id, id, reihenfolge, thema, titel, text, details, monate, meldung, sicherheit, wow, quelle_ids, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
const json = (w) => (w == null ? null : JSON.stringify(w));

for (const d of dateien) {
  const artId = artNachCol.get(d.colId).id;
  for (const [qid, q] of Object.entries(d.quellen)) quelleNeu.run(`${artId}:${qid}`, q.titel, q.url, q.abgerufen ?? null);
  d.eintraege.forEach((e, i) =>
    eintragNeu.run(
      artId,
      e.id,
      i,
      e.thema,
      e.titel,
      e.text,
      json(e.details),
      json(e.monate),
      e.meldung ?? null,
      e.sicherheit ?? null,
      e.wow,
      json(e.quellen.map((q) => `${artId}:${q}`)),
      e.geprueft ? 'geprueft' : 'belegt',
    ),
  );
}

const zeilen = db
  .prepare(
    `SELECT s.art_id, n.name AS art, s.thema, s.wow, s.titel, s.text, s.monate, s.meldung, s.sicherheit
     FROM sonderwissen s LEFT JOIN name n ON n.art_id = s.art_id AND n.sprache = 'de' AND n.haupt = 1
     ORDER BY s.art_id, s.reihenfolge`,
  )
  .all();
const zelle = (w) => (w == null ? '' : `"${String(w).replace(/"/g, '""')}"`);
mkdirSync(join(WURZEL, 'db', 'export'), { recursive: true });
if (zeilen.length) {
  writeFileSync(
    join(WURZEL, 'db', 'export', 'sonderwissen.csv'),
    [Object.keys(zeilen[0]).join(','), ...zeilen.map((z) => Object.values(z).map(zelle).join(','))].join('\n') + '\n',
  );
}
console.log(`Sonderwissen: ${zeilen.length} Einträge für ${dateien.length} Arten`);
console.table(db.prepare('SELECT art_id, count(*) AS eintraege, sum(wow = 3) AS wow3 FROM sonderwissen GROUP BY art_id').all());
db.close();
