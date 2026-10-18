/**
 * Vorschau der nachgezeichneten Trittsiegel aus recherche/<artId>/spuren.json.
 *
 *   node scripts/spur-vorschau.mjs <artId>
 *
 * Rendert Vorderfuß, Hinterfuß und (falls vorhanden) die Fluchtform groß nebeneinander mit
 * Zentimeter-Raster (aus laengeCm) nach recherche/<artId>/spuren-vorschau.png – damit der
 * Spuren-Agent seine Zeichnung neben echte Referenzfotos legen und vergleichen kann.
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const artId = process.argv[2];
if (!artId) {
  console.log('Aufruf: node scripts/spur-vorschau.mjs <artId>');
  process.exit(1);
}
const ordner = join('recherche', artId);
const s = JSON.parse(readFileSync(join(ordner, 'spuren.json'), 'utf8'));
const formen = [
  ['Vorderfuß', s.vorne],
  ['Hinterfuß', s.hinten],
  ['Flucht', s.flucht],
].filter(([, f]) => f?.pfad);

const FELD = 300; // Pixel je Form (Raster −15 … 15 → 30 Einheiten)
const k = FELD / 34;
const teile = formen.map(([name, f], i) => {
  const x0 = i * FELD;
  // Zentimeter-Raster: 30 Einheiten = mittlere Länge des Trittsiegels
  const laenge = f.laengeCm ? (f.laengeCm[0] + f.laengeCm[1]) / 2 : undefined;
  const cm = laenge ? 30 / laenge : undefined;
  const raster = cm
    ? Array.from({ length: Math.ceil(34 / cm) + 1 }, (_, n) => {
        const p = -17 + n * cm;
        return `<line x1="${p}" y1="-17" x2="${p}" y2="17" /><line x1="-17" y1="${p}" x2="17" y2="${p}" />`;
      }).join('')
    : '';
  return `
  <g transform="translate(${x0 + FELD / 2} ${FELD / 2}) scale(${k})">
    <g stroke="#c9c2b0" stroke-width="0.06">${raster}</g>
    <path d="${f.pfad}" fill="#2a2119" fill-rule="evenodd" />
  </g>
  <text x="${x0 + 12}" y="${FELD + 24}" font-size="18" fill="#222">${name}${laenge ? ` · Raster 1 cm (Länge ${f.laengeCm.join('–')} cm)` : ''}</text>`;
});

const breite = Math.max(1, formen.length) * FELD;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${FELD + 40}">
  <rect width="100%" height="100%" fill="#f4f0e6" />${teile.join('')}
</svg>`;
writeFileSync(
  join(ordner, 'spuren-vorschau.png'),
  new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng(),
);
console.log(`→ ${join(ordner, 'spuren-vorschau.png')} (${formen.length} Formen)`);
