/**
 * Ein ausgewähltes Commons-Foto in die App übernehmen.
 *
 *   node scripts/commons-laden.mjs <fotoId> "<Dateititel auf Commons>" "<Beschreibung>" [--max 1200]
 *
 * Beispiel: node scripts/commons-laden.mjs wildschwein/frischling "Sus scrofa piglet.jpg" "Frischling mit Streifen"
 *
 * - prüft die Lizenz noch einmal (nur CC0, gemeinfrei, CC BY, CC BY-SA)
 * - lädt das Foto, verkleinert es (längste Seite `--max`, Standard 1200 px) – NICHT beschneiden, nicht verändern
 * - speichert `assets/fotos/<fotoId>.jpg`
 * - trägt es in `src/data/fotos.ts` ein (Urheber, Lizenz, Link) und in die Foto-Tabelle in DATENQUELLEN.md
 * Braucht macOS (`sips` zum Verkleinern).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-; Lernprojekt)';
const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');

const [fotoId, titel, beschreibung, ...rest] = process.argv.slice(2);
if (!fotoId || !titel || !beschreibung || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(fotoId)) {
  console.log('Aufruf: node scripts/commons-laden.mjs <ordner/name> "<Dateititel>" "<Beschreibung>" [--max 1200]');
  console.log('fotoId nur Kleinbuchstaben, Ziffern, Bindestrich, z. B. wildschwein/frischling');
  process.exit(1);
}
const max = Number(rest[rest.indexOf('--max') + 1]) || 1200;

const ohneHtml = (t = '') =>
  t
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const lizenzErlaubt = (l) =>
  !/\bNC\b|\bND\b|non-?commercial|no-?deriv/i.test(l) && /^(CC0|Public domain|PD\b|PDM|CC BY(-SA)? \d(\.\d)?)/i.test(l);

const url =
  'https://commons.wikimedia.org/w/api.php?' +
  new URLSearchParams({
    action: 'query',
    titles: `File:${titel}`,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(Math.max(max, 1600)),
    format: 'json',
  });
const d = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
const seite = Object.values(d.query.pages)[0];
const ii = seite.imageinfo?.[0];
if (!ii) {
  console.log('Datei nicht gefunden:', titel);
  process.exit(1);
}
const m = ii.extmetadata ?? {};
const lizenz = ohneHtml(m.LicenseShortName?.value);
if (!lizenzErlaubt(lizenz)) {
  console.log(`Lizenz nicht erlaubt: „${lizenz}“ – Foto wird nicht übernommen.`);
  process.exit(1);
}
const autor = ohneHtml(m.Artist?.value).replace(/'/g, '’');
const lizenzUrl = ohneHtml(m.LicenseUrl?.value);

// Laden und verkleinern (nur verkleinern – sips -Z hält das Seitenverhältnis)
const ziel = join(WURZEL, 'assets', 'fotos', `${fotoId}.jpg`);
mkdirSync(dirname(ziel), { recursive: true });
const roh = `/tmp/wildfund-${fotoId.replace('/', '-')}`;
writeFileSync(roh, Buffer.from(await (await fetch(ii.thumburl, { headers: { 'User-Agent': UA } })).arrayBuffer()));
execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', String(max), roh, '--out', ziel], {
  stdio: 'ignore',
});
const masse = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', ziel]).toString();
const breite = Number(/pixelWidth: (\d+)/.exec(masse)[1]);
const hoehe = Number(/pixelHeight: (\d+)/.exec(masse)[1]);

// In src/data/fotos.ts eintragen (falls noch nicht vorhanden)
const fotosPfad = join(WURZEL, 'src', 'data', 'fotos.ts');
let fotos = readFileSync(fotosPfad, 'utf8');
if (fotos.includes(`'${fotoId}': {`)) {
  console.log(`${fotoId} steht schon in fotos.ts – nur die Bilddatei wurde erneuert.`);
} else {
  const eintrag =
    `  // ${beschreibung}\n` +
    `  '${fotoId}': {\n` +
    `    quelle: require('../../assets/fotos/${fotoId}.jpg'),\n` +
    `    breite: ${breite},\n    hoehe: ${hoehe},\n` +
    `    autor: '${autor}',\n    lizenz: '${lizenz}',\n    lizenzUrl: '${lizenzUrl}',\n` +
    `    seite: '${ii.descriptionurl}',\n  },\n`;
  fotos = fotos.replace('} satisfies Record<string, Foto>;', `${eintrag}} satisfies Record<string, Foto>;`);
  writeFileSync(fotosPfad, fotos);
}

// In DATENQUELLEN.md eintragen (Zeile an die Foto-Tabelle anhängen)
const dqPfad = join(WURZEL, 'DATENQUELLEN.md');
const dq = readFileSync(dqPfad, 'utf8');
const zeile = `| \`assets/fotos/${fotoId}.jpg\` | ${beschreibung} | ${autor || 'unbekannt'} | ${lizenz} | [Commons](${ii.descriptionurl}) |`;
if (!dq.includes(`assets/fotos/${fotoId}.jpg`)) {
  const zeilen = dq.split('\n');
  let letzte = -1;
  zeilen.forEach((z, i) => {
    if (z.startsWith('| `assets/fotos/')) letzte = i;
  });
  if (letzte >= 0) zeilen.splice(letzte + 1, 0, zeile);
  else zeilen.push('', zeile);
  writeFileSync(dqPfad, zeilen.join('\n'));
}

console.log(
  `✓ ${fotoId}: ${breite}×${hoehe}, ${Math.round(statSync(ziel).size / 1024)} KB · ${lizenz} · ${autor || 'Urheber unbekannt'}`,
);
