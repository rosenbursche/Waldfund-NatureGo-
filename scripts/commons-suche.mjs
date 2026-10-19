/**
 * Fotos auf Wikimedia Commons suchen – nur mit freier Lizenz – und Vorschaubilder ablegen,
 * damit der Bilder-Agent sie ansehen und prüfen kann (richtige Art, Jahreszeit, Region, Motiv).
 *
 *   node scripts/commons-suche.mjs <ordner> "<Suchbegriff>" [--kategorie "<Kategorie>"] [--quer] [--n 24]
 *
 * - <ordner>: z. B. recherche/wildschwein/bilder/frischling – dort landen kandidaten.json und 1.jpg, 2.jpg …
 * - Suchbegriff: Volltextsuche (z. B. "Sus scrofa piglet"), oder mit --kategorie die Dateien einer Kategorie
 *   (z. B. "Sus scrofa scrofa in Germany").
 * - --quer: nur Querformat (Breite ≥ 1,4 × Höhe), z. B. für Panoramen und Jahreszeiten-Seiten.
 * - Lizenzen: erlaubt sind CC0, gemeinfrei (PD/Public domain), CC BY, CC BY-SA.
 *   Nicht erlaubt: NC (nicht kommerziell), ND (keine Bearbeitung), nur-GFDL, unklare Lizenzen.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-; Lernprojekt)';
const API = 'https://commons.wikimedia.org/w/api.php';

const [ordner, suche, ...rest] = process.argv.slice(2);
if (!ordner || suche === undefined) {
  console.log(
    'Aufruf: node scripts/commons-suche.mjs <ordner> "<Suchbegriff>" [--kategorie "<Kategorie>"] [--quer] [--n 24]',
  );
  process.exit(1);
}
const wert = (s) => (rest.includes(s) ? rest[rest.indexOf(s) + 1] : undefined);
const kategorie = wert('--kategorie');
const quer = rest.includes('--quer');
const anzahl = Number(wert('--n')) || 24;

/** Freie Lizenz? Nur diese Kurznamen von Commons sind erlaubt */
export function lizenzErlaubt(kurz) {
  const l = kurz.trim();
  if (/\bNC\b|\bND\b|non-?commercial|no-?deriv/i.test(l)) return false;
  return /^(CC0|Public domain|PD\b|PDM|CC BY(-SA)? \d(\.\d)?)/i.test(l);
}

async function api(params) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json' })}`;
  for (let v = 0; v < 5; v++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return r.json();
    } catch {
      // gleich nochmal
    }
    await new Promise((ok) => setTimeout(ok, 3000 * (v + 1)));
  }
  throw new Error('Commons antwortet nicht');
}

const ohneHtml = (t = '') =>
  t
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const quelle = kategorie
  ? { generator: 'categorymembers', gcmtitle: `Category:${kategorie}`, gcmtype: 'file', gcmlimit: '100' }
  : { generator: 'search', gsrsearch: `${suche} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '60' };
const d = await api({
  action: 'query',
  ...quelle,
  prop: 'imageinfo',
  iiprop: 'url|size|extmetadata',
  iiurlwidth: '500',
});

const kandidaten = [];
for (const p of Object.values(d.query?.pages ?? {})) {
  const ii = p.imageinfo?.[0];
  if (!ii) continue;
  const m = ii.extmetadata ?? {};
  const lizenz = ohneHtml(m.LicenseShortName?.value);
  if (!lizenzErlaubt(lizenz)) continue;
  if (ii.width < 1000) continue;
  if (quer && ii.width < ii.height * 1.4) continue;
  kandidaten.push({
    titel: p.title.replace(/^File:/, ''),
    lizenz,
    lizenzUrl: ohneHtml(m.LicenseUrl?.value),
    autor: ohneHtml(m.Artist?.value),
    beschreibung: ohneHtml(m.ImageDescription?.value).slice(0, 300),
    datum: ohneHtml(m.DateTimeOriginal?.value).slice(0, 20),
    breite: ii.width,
    hoehe: ii.height,
    seite: ii.descriptionurl,
    vorschau: ii.thumburl,
  });
  if (kandidaten.length >= anzahl) break;
}

mkdirSync(ordner, { recursive: true });
for (const [i, k] of kandidaten.entries()) {
  const r = await fetch(k.vorschau, { headers: { 'User-Agent': UA } });
  writeFileSync(join(ordner, `${i + 1}.jpg`), Buffer.from(await r.arrayBuffer()));
  k.datei = `${i + 1}.jpg`;
}
writeFileSync(join(ordner, 'kandidaten.json'), JSON.stringify(kandidaten, null, 1) + '\n');
console.log(`${kandidaten.length} Kandidaten mit freier Lizenz → ${ordner}`);
for (const [i, k] of kandidaten.entries()) {
  console.log(
    `${String(i + 1).padStart(2)}  ${k.lizenz.padEnd(13)} ${k.breite}×${k.hoehe}  ${k.titel.slice(0, 70)} | ${k.autor.slice(0, 25)}`,
  );
}
