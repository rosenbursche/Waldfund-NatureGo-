/**
 * Vorschau der Art-Taler (Icon + Rang-Rahmen) als PNG – für Gestaltung und Prüfung durch Agenten.
 *
 *   node scripts/taler-vorschau.mjs <artId> [<artId> …] [--alle] [--gross] [--aus datei.png] [--stufe 1-4]
 *
 * Zeigt je Art: gefunden (groß), noch nicht gefunden (Silhouette) und die echte Größe in der App (44 px),
 * dazu den Namen. Ohne --aus landet das Bild in recherche/icons/vorschau.png.
 * Icons: src/data/icons/<artId>.json · Stilregeln: docs/ICONS.md
 */
import { Resvg } from '@resvg/resvg-js';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { colors } from '../src/theme/theme.ts';
import { alsSvg, iconKnoten, talerRahmen, TALER_GROESSE } from '../src/logic/taler/taler.ts';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const wert = (s) => (args.includes(s) ? args[args.indexOf(s) + 1] : undefined);
const aus = wert('--aus') ?? join(WURZEL, 'recherche', 'icons', 'vorschau.png');
const stufeFest = wert('--stufe') ? Number(wert('--stufe')) : undefined;
const iconOrdner = join(WURZEL, 'src', 'data', 'icons');

let ids = args.filter((a, i) => !a.startsWith('--') && !['--aus', '--stufe'].includes(args[i - 1]));
if (args.includes('--alle'))
  ids = readdirSync(iconOrdner)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5));
if (!ids.length) {
  console.log('Aufruf: node scripts/taler-vorschau.mjs <artId> … [--alle] [--aus datei.png] [--stufe 1-4]');
  process.exit(1);
}

// Name und Seltenheit aus den Artendaten lesen (einfacher Textabgleich, ohne die TS-Dateien auszuführen)
const arten =
  readFileSync(join(WURZEL, 'src', 'data', 'arten.ts'), 'utf8') +
  readFileSync(join(WURZEL, 'src', 'data', 'baumarten.ts'), 'utf8');
function info(id) {
  const i = arten.indexOf(`id: '${id}'`);
  const stueck = i >= 0 ? arten.slice(i, i + 1500) : '';
  return {
    name: /name: '([^']+)'/.exec(stueck)?.[1] ?? id,
    seltenheit: Number(/seltenheit: (\d)/.exec(stueck)?.[1] ?? 1),
  };
}

function taler(id, icon, stufe, gefunden, x, y, groesse) {
  const r = talerRahmen(stufe, colors, `${id}-${gefunden ? 'a' : 'b'}-${groesse}`);
  const innen = icon ? iconKnoten(icon, gefunden, colors.moss, `${id}-${gefunden ? 'a' : 'b'}-${groesse}`) : [];
  const teile = [...r.hinten, ...r.scheibe, ...innen, ...r.rand].map(alsSvg).join('');
  const k = groesse / TALER_GROESSE;
  return `<g transform="translate(${x} ${y}) scale(${k})" opacity="${gefunden ? 1 : 0.85}"><defs>${r.defs.map(alsSvg).join('')}</defs>${teile}</g>`;
}

const GROSS = args.includes('--gross');
const SPALTE = GROSS ? 600 : 330;
const ZEILE = GROSS ? 420 : 230;
const proZeile = Math.min(ids.length, 4);
const breite = proZeile * SPALTE;
const hoehe = Math.ceil(ids.length / proZeile) * ZEILE;
let inhalt = '';
ids.forEach((id, n) => {
  const pfadIcon = join(iconOrdner, `${id}.json`);
  const icon = existsSync(pfadIcon) ? JSON.parse(readFileSync(pfadIcon, 'utf8')) : undefined;
  const { name, seltenheit } = info(id);
  const stufe = stufeFest ?? seltenheit;
  const x0 = (n % proZeile) * SPALTE;
  const y0 = Math.floor(n / proZeile) * ZEILE;
  const G = GROSS ? 2 : 1;
  inhalt += taler(id, icon, stufe, true, x0 + 10, y0 + 10, 180 * G);
  inhalt += taler(id, icon, stufe, false, x0 + 200 * G - (GROSS ? 20 : 0), y0 + 20, 110 * (GROSS ? 1.6 : 1));
  inhalt += taler(id, icon, stufe, true, x0 + 230 * G - (GROSS ? 30 : 0), y0 + 140 * G, 44);
  inhalt += `<text x="${x0 + 14}" y="${y0 + ZEILE - 16}" font-family="Georgia" font-size="15" fill="${colors.moon}">${name}${icon ? '' : ' (kein Icon)'} · Stufe ${stufe}</text>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}"><rect width="100%" height="100%" fill="${colors.night}"/>${inhalt}</svg>`;
mkdirSync(dirname(aus), { recursive: true });
writeFileSync(aus, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(`→ ${aus} (${ids.length} Arten)`);
