/**
 * Erzeugt einfache Platzhalter-Ebenen für die Diorama-Startszene (Heide in der Dämmerung),
 * damit Parallaxe und Effekte getestet werden können, bevor die echten ChatGPT-Bilder da sind.
 *
 * Ausführen:  node scripts/platzhalter-szene.mjs
 * Ergebnis:   assets/szene/platzhalter/0-himmel.png … 5-vordergrund.png (1024 × 1536, mit Transparenz)
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';

const B = 1024;
const H = 1536;
const ORDNER = 'assets/szene/platzhalter';
mkdirSync(ORDNER, { recursive: true });

// fester Zufall, damit die Platzhalter immer gleich aussehen
let saat = 7;
const zufall = () => (saat = (saat * 16807) % 2147483647) / 2147483647;

const svg = (inhalt, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}" viewBox="0 0 ${B} ${H}"><defs>${defs}</defs>${inhalt}</svg>`;

function speichern(name, text) {
  writeFileSync(`${ORDNER}/${name}.png`, new Resvg(text, { fitTo: { mode: 'width', value: B } }).render().asPng());
  console.log('→', `${ORDNER}/${name}.png`);
}

const kiefer = (x, y, h, farbe) =>
  `<g><rect x="${x - h * 0.02}" y="${y - h * 0.75}" width="${h * 0.04}" height="${h * 0.75}" fill="#3A2A24"/>` +
  `<ellipse cx="${x}" cy="${y - h * 0.82}" rx="${h * 0.26}" ry="${h * 0.12}" fill="${farbe}"/>` +
  `<ellipse cx="${x - h * 0.12}" cy="${y - h * 0.72}" rx="${h * 0.14}" ry="${h * 0.07}" fill="${farbe}"/>` +
  `<ellipse cx="${x + h * 0.13}" cy="${y - h * 0.75}" rx="${h * 0.13}" ry="${h * 0.06}" fill="${farbe}"/></g>`;
const birke = (x, y, h, farbe) =>
  `<g><rect x="${x - h * 0.012}" y="${y - h}" width="${h * 0.024}" height="${h}" fill="#D8D6CC"/>` +
  `<ellipse cx="${x}" cy="${y - h * 0.72}" rx="${h * 0.17}" ry="${h * 0.3}" fill="${farbe}" opacity="0.9"/></g>`;
const wacholder = (x, y, h, farbe) =>
  `<ellipse cx="${x}" cy="${y - h / 2}" rx="${h * 0.16}" ry="${h / 2}" fill="${farbe}"/>`;
const eiche = (x, y, h, farbe) =>
  `<g><rect x="${x - h * 0.04}" y="${y - h * 0.6}" width="${h * 0.08}" height="${h * 0.6}" fill="#34281F"/>` +
  [
    [-0.2, 0.72, 0.24],
    [0.2, 0.7, 0.26],
    [0, 0.88, 0.28],
    [-0.32, 0.6, 0.15],
    [0.33, 0.6, 0.16],
  ]
    .map(([dx, dy, r]) => `<circle cx="${x + dx * h}" cy="${y - dy * h}" r="${r * h}" fill="${farbe}"/>`)
    .join('') +
  '</g>';

// --- Ebene 0: Himmel ---
const sterne = Array.from({ length: 140 }, () => {
  const x = zufall() * B;
  const y = zufall() * H * 0.45;
  return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.6 + zufall() * 1.4).toFixed(1)}" fill="#D9E0E6" opacity="${(0.3 + zufall() * 0.7).toFixed(2)}"/>`;
}).join('');
speichern(
  '0-himmel',
  svg(
    `<rect width="${B}" height="${H}" fill="url(#h)"/>${sterne}<circle cx="720" cy="300" r="34" fill="#E8EEF0"/><circle cx="720" cy="300" r="90" fill="url(#m)"/>`,
    `<linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1A1F"/><stop offset="0.45" stop-color="#1D3A3E"/><stop offset="0.62" stop-color="#5A5650"/><stop offset="0.72" stop-color="#2A3A36"/><stop offset="1" stop-color="#142420"/></linearGradient>` +
      `<radialGradient id="m"><stop offset="0" stop-color="#D9E0E6" stop-opacity="0.45"/><stop offset="1" stop-color="#D9E0E6" stop-opacity="0"/></radialGradient>`,
  ),
);

// --- Ebene 1: Ferne – flacher Waldrand mit Nebel ---
let ferne = '';
for (let x = -20; x < B + 40; x += 18 + zufall() * 14)
  ferne += kiefer(x, 760 + zufall() * 10, 90 + zufall() * 60, '#1C2E2A');
speichern(
  '1-ferne',
  svg(
    `<rect x="0" y="740" width="${B}" height="60" fill="#1C2E2A"/>${ferne}<rect x="0" y="700" width="${B}" height="140" fill="url(#n)"/>`,
    `<linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB3AD" stop-opacity="0"/><stop offset="0.6" stop-color="#9FB3AD" stop-opacity="0.35"/><stop offset="1" stop-color="#9FB3AD" stop-opacity="0"/></linearGradient>`,
  ),
);

// --- Ebene 2: Mittelgrund – Heide mit Wacholder, Birken, Kiefern, Eichen ---
let mitte = `<path d="M0 820 Q 300 790 512 812 T ${B} 806 L ${B} 980 L 0 980 Z" fill="#203229"/>`;
mitte +=
  kiefer(120, 900, 330, '#24392F') +
  kiefer(880, 905, 360, '#243A30') +
  eiche(260, 910, 250, '#2C4232') +
  eiche(770, 905, 230, '#2D4433');
mitte += birke(390, 900, 230, '#5E7F4A') + birke(640, 905, 210, '#5A7A46') + birke(940, 930, 200, '#58784A');
for (let i = 0; i < 16; i++)
  mitte += wacholder(40 + zufall() * 940, 905 + zufall() * 60, 50 + zufall() * 70, '#1A2C24');
speichern('2-mittelgrund', svg(mitte));

// --- Ebene 3: Lichtung – sandiger Boden, Heidekraut, Tümpel, Weg ---
let boden = `<path d="M0 940 Q 512 880 ${B} 940 L ${B} ${H} L 0 ${H} Z" fill="#2A3A2C"/>`;
boden += `<ellipse cx="512" cy="1010" rx="260" ry="70" fill="#5E5644" opacity="0.8"/>`;
boden += `<path d="M470 1040 Q 430 1250 330 ${H} L 620 ${H} Q 560 1250 560 1040 Z" fill="#6A604B" opacity="0.85"/>`;
boden += `<ellipse cx="800" cy="1180" rx="130" ry="40" fill="#0F1C1E"/><ellipse cx="790" cy="1172" rx="80" ry="14" fill="#5D8FA3" opacity="0.35"/>`;
for (let i = 0; i < 120; i++) {
  const x = zufall() * B;
  const y = 960 + zufall() * 520;
  if (Math.abs(x - 512) < 120 && y > 1000) continue;
  boden += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4 + zufall() * 8).toFixed(0)}" fill="${zufall() > 0.5 ? '#6E4E7A' : '#4E5E3E'}" opacity="0.8"/>`;
}
speichern('3-lichtung', svg(boden));

// --- Ebene 4: Hütte (Waldhütte) ---
speichern(
  '4-huette-1',
  svg(
    `<ellipse cx="512" cy="1012" rx="150" ry="22" fill="#000" opacity="0.35"/>
     <rect x="410" y="900" width="204" height="110" fill="#4A3628"/>
     <path d="M390 910 L 512 820 L 634 910 Z" fill="#2E3B30"/><path d="M400 905 L 512 826 L 624 905" fill="none" stroke="#3D5A45" stroke-width="10"/>
     <rect x="565" y="830" width="24" height="60" fill="#5F625C"/>
     <rect x="440" y="945" width="40" height="65" fill="#2A1E16"/>
     <rect x="530" y="935" width="46" height="38" fill="#E8B86A"/><path d="M553 935 V 973 M530 954 H 576" stroke="#2A1E16" stroke-width="4"/>`,
  ),
);

// --- Ebene 5: Vordergrund – Kiefernstamm links, Zweige oben rechts, Farne unten ---
// Handys sind schmaler als 2:3 – links und rechts werden je ~18 % abgeschnitten, deshalb der Stamm bei x ≈ 200
let vorne = `<path d="M150 0 L 252 0 L 262 ${H} L 140 ${H} Z" fill="#1A1410"/><rect x="225" y="0" width="14" height="${H}" fill="#2A2018" opacity="0.6"/>`;
vorne += `<path d="M${B} 60 Q 760 120 620 90 M ${B} 140 Q 800 190 680 200" stroke="#1C1612" stroke-width="10" fill="none"/>`;
for (let i = 0; i < 14; i++)
  vorne += `<circle cx="${(640 + zufall() * 260).toFixed(0)}" cy="${(60 + zufall() * 150).toFixed(0)}" r="${(26 + zufall() * 30).toFixed(0)}" fill="#14221A"/>`;
const farn = (x, y, s, dreh) =>
  `<g transform="translate(${x} ${y}) rotate(${dreh}) scale(${s})">` +
  Array.from(
    { length: 9 },
    (_, i) =>
      `<ellipse cx="${i * 14}" cy="${-i * 9}" rx="22" ry="7" fill="#1E3324" transform="rotate(-30 ${i * 14} ${-i * 9})"/>`,
  ).join('') +
  '</g>';
vorne +=
  farn(230, 1500, 1.6, -40) + farn(300, 1530, 1.3, -60) + farn(820, 1500, 1.6, -150) + farn(740, 1530, 1.2, -120);
speichern('5-vordergrund', svg(vorne));
