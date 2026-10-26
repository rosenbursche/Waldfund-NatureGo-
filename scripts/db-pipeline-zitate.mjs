/**
 * Pipeline-Test C3, Schritt 3: Zitatprüfung ohne KI.
 *
 *   node scripts/db-pipeline-zitate.mjs            (prüft alle Dateien in recherche/pipeline-test/ergebnis/)
 *
 * Jeder Eintrag muss mindestens ein wörtliches Zitat aus einer gespeicherten Quelle haben
 * (Feld `zitate: [{ quelle: 'wiki-de', text: '…' }]`, höchstens 300 Zeichen). Das Skript sucht jedes Zitat
 * Zeichen für Zeichen im Quelltext (Leerraum und typografische Anführungszeichen vereinheitlicht).
 * Zusätzlich laufen die Prüfregeln aus db/felder/sonderwissen.mjs.
 * Ergebnis: Konsole und recherche/pipeline-test/zitatpruefung.json.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { pruefeSonderwissen } from '../db/felder/sonderwissen.mjs';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = join(WURZEL, 'recherche', 'pipeline-test');
const MAX_ZITAT = 300;

// Vereinheitlicht Leerraum, Bindestriche und Anführungszeichen, damit nur echte Abweichungen auffallen
const norm = (s) =>
  s
    .replace(/[­]/g, '')
    .replace(/[„“”"«»‚‘’']/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const dateien = readdirSync(join(ORDNER, 'ergebnis')).filter((d) => d.endsWith('.json'));
const bericht = [];
let summe = { eintraege: 0, zitate: 0, gefunden: 0, ohneZitat: 0, zuLang: 0, regelfehler: 0 };

for (const datei of dateien) {
  const d = JSON.parse(readFileSync(join(ORDNER, 'ergebnis', datei), 'utf8'));
  const quellen = {};
  for (const q of ['wiki-de', 'wiki-en']) {
    const pfad = join(ORDNER, 'quellen', d.artId, `${q}.txt`);
    if (existsSync(pfad)) quellen[q] = norm(readFileSync(pfad, 'utf8'));
  }
  const regel = pruefeSonderwissen(d);
  summe.regelfehler += regel.length;
  const art = { artId: d.artId, eintraege: [], regelfehler: regel };
  for (const e of d.eintraege) {
    summe.eintraege++;
    const zitate = e.zitate ?? [];
    if (zitate.length === 0) summe.ohneZitat++;
    const pruefung = zitate.map((z) => {
      summe.zitate++;
      const zuLang = z.text.length > MAX_ZITAT;
      if (zuLang) summe.zuLang++;
      const gefunden = Boolean(quellen[z.quelle]?.includes(norm(z.text)));
      if (gefunden) summe.gefunden++;
      return { quelle: z.quelle, gefunden, zuLang, text: z.text };
    });
    art.eintraege.push({ id: e.id, wow: e.wow, zitate: pruefung });
  }
  bericht.push(art);
  const ok = art.eintraege.flatMap((e) => e.zitate).filter((z) => z.gefunden).length;
  const alle = art.eintraege.flatMap((e) => e.zitate).length;
  console.log(
    `${d.artId.padEnd(26)} ${String(d.eintraege.length).padStart(2)} Einträge  Zitate gefunden ${ok}/${alle}  Regelfehler ${regel.length}`,
  );
  for (const e of art.eintraege)
    for (const z of e.zitate)
      if (!z.gefunden) console.log(`   NICHT GEFUNDEN  ${e.id} (${z.quelle}): ${z.text.slice(0, 90)}…`);
  for (const f of regel) console.log(`   REGEL  ${f}`);
}

const quote = summe.zitate ? ((100 * (summe.zitate - summe.gefunden)) / summe.zitate).toFixed(1) : '0';
console.log(
  `\n${dateien.length} Arten, ${summe.eintraege} Einträge, ${summe.zitate} Zitate, davon ${summe.gefunden} gefunden (Fehlerquote ${quote} %)`,
);
console.log(`Ohne Zitat: ${summe.ohneZitat}, Zitat zu lang: ${summe.zuLang}, Regelfehler: ${summe.regelfehler}`);
writeFileSync(join(ORDNER, 'zitatpruefung.json'), JSON.stringify({ summe, bericht }, null, 2) + '\n');
