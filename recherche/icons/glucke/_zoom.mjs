// Rendert Icons ohne Rahmen groß (480 px) nebeneinander: node zoom.mjs aus.png id …
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
const [aus, ...ids] = process.argv.slice(2);
let inhalt = '';
ids.forEach((id, i) => {
  const ic = JSON.parse(readFileSync(`src/data/icons/${id}.json`, 'utf8'));
  const p = ic.ebenen.map((e) => `<path d="${e.d}" fill="${e.f ?? 'none'}" ${e.o != null ? `opacity="${e.o}"` : ''} ${e.s ? `stroke="${e.s}" stroke-width="${e.sw ?? 1}" stroke-linejoin="round" stroke-linecap="round"` : ''}/>`).join('');
  inhalt += `<g transform="translate(${i * 480},0) scale(4)"><clipPath id="c${i}"><circle cx="60" cy="60" r="41"/></clipPath><g clip-path="url(#c${i})">${p}</g></g>`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ids.length * 480}" height="480"><rect width="100%" height="100%" fill="#0B1414"/>${inhalt}</svg>`;
writeFileSync(aus, new Resvg(svg).render().asPng());
