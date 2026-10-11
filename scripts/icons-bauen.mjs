/**
 * Baut App-Icon, Android-Icons, Splash-Bild und Favicon aus einer Vektorzeichnung.
 *
 * Ausführen:  node scripts/icons-bauen.mjs
 *
 * Motiv: Waldhütte mit warm leuchtendem Fenster zwischen Tannen, umgeben von einem
 * türkisen Runenkreis – in den Farben aus src/theme/theme.ts.
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';

// Farben (wie in theme.ts)
const F = {
  night: '#0B1414',
  forest: '#142420',
  moss: '#3D5A45',
  fog: '#9FB3AD',
  amber: '#E8B86A',
  rune: '#8FD1C4',
};

/** Das Motiv auf einer 1024er-Fläche. `farbig=false` → einfarbige Silhouette (Android "monochrome") */
function motiv({ farbig = true, ring = true } = {}) {
  const dunkel = farbig ? '#0E1C19' : '#FFFFFF';
  const tanne = farbig ? '#1F3A30' : '#FFFFFF';
  const fenster = farbig ? F.amber : '#000000';
  // Acht kleine Runenzeichen innen am Kreis (Stab mit Zweigen, je Zeichen anders)
  const glyphen = [
    'M0 -22 V22 M0 -10 L12 -20 M0 2 L12 -8',
    'M0 -22 V22 M0 -22 L12 -10 L0 0',
    'M0 -22 V22 M-10 -12 L10 4',
    'M0 -22 V22 M0 -6 L12 -18 M0 -6 L-12 -18',
    'M-8 -22 V22 M8 -22 V22 M-8 -6 L8 6',
    'M0 -22 V22 M0 10 L12 22 M0 10 L-12 22',
    'M0 -22 L10 0 L0 22 L-10 0 Z',
    'M0 -22 V22 M0 -14 L12 -4 L0 6',
  ];
  const runen = glyphen
    .map((d, i) => {
      const grad = (i / glyphen.length) * 360 + 22.5;
      return `<path d="${d}" transform="rotate(${grad} 512 512) translate(512 236)"/>`;
    })
    .join('');
  const sporen = [
    [300, 330, 7, F.amber],
    [720, 300, 6, F.rune],
    [760, 470, 5, F.amber],
    [270, 520, 5, F.rune],
    [640, 250, 4, F.amber],
  ]
    .map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.9"/>`)
    .join('');

  return `
  ${
    ring
      ? `<g stroke="${farbig ? F.rune : '#FFFFFF'}" stroke-linecap="round" fill="none">
      <circle cx="512" cy="512" r="330" stroke-width="10" opacity="${farbig ? 0.85 : 1}"/>
      <g stroke-width="6" stroke-linejoin="round" opacity="${farbig ? 0.8 : 1}">${runen}</g>
    </g>`
      : ''
  }
  <!-- Boden -->
  <ellipse cx="512" cy="700" rx="270" ry="34" fill="${farbig ? F.moss : '#FFFFFF'}" opacity="${farbig ? 0.55 : 1}"/>
  <!-- Tannen links und rechts -->
  <path d="M300 700 L300 640 L240 640 L300 560 L258 560 L310 480 L278 480 L330 390 L382 480 L350 480 L402 560 L360 560 L420 640 L360 640 L360 700 Z" fill="${tanne}"/>
  <path d="M690 700 L690 650 L640 650 L690 580 L655 580 L700 510 L672 510 L715 440 L758 510 L730 510 L775 580 L740 580 L790 650 L740 650 L740 700 Z" fill="${tanne}"/>
  <!-- Hütte -->
  <path d="M430 700 L430 560 L512 486 L594 560 L594 700 Z" fill="${dunkel}"/>
  <path d="M410 572 L512 470 L614 572" fill="none" stroke="${dunkel}" stroke-width="26" stroke-linejoin="round"/>
  ${farbig ? `<path d="M398 580 L512 460 L626 580" fill="none" stroke="${F.moss}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
  <rect x="556" y="474" width="22" height="58" fill="${dunkel}"/>
  ${farbig ? `<circle cx="512" cy="610" r="90" fill="url(#glut)"/>` : ''}
  <rect x="488" y="584" width="48" height="52" rx="4" fill="${fenster}"/>
  <path d="M512 584 V636 M488 610 H536" stroke="${dunkel}" stroke-width="6"/>
  ${farbig ? sporen : ''}`;
}

const defs = `
  <defs>
    <radialGradient id="himmel" cx="50%" cy="42%" r="70%">
      <stop offset="0" stop-color="${F.forest}"/>
      <stop offset="1" stop-color="${F.night}"/>
    </radialGradient>
    <radialGradient id="glut" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${F.amber}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${F.amber}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebel" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${F.fog}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${F.fog}" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

const svg = (inhalt, hintergrund = true) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${defs}
  ${hintergrund ? `<rect width="1024" height="1024" fill="url(#himmel)"/><ellipse cx="512" cy="720" rx="520" ry="120" fill="url(#nebel)"/>` : ''}
  ${inhalt}
</svg>`;

/** Motiv verkleinert in die Mitte setzen (Android braucht Rand für runde/eckige Masken) */
const mitRand = (inhalt, faktor) =>
  `<g transform="translate(${512 * (1 - faktor)} ${512 * (1 - faktor)}) scale(${faktor})">${inhalt}</g>`;

function png(svgText, breite, datei) {
  const bild = new Resvg(svgText, { fitTo: { mode: 'width', value: breite } }).render().asPng();
  writeFileSync(datei, bild);
  console.log('→', datei);
}

mkdirSync('assets/icon-quelle', { recursive: true });
const icon = svg(motiv());
writeFileSync('assets/icon-quelle/icon.svg', icon);

png(icon, 1024, 'assets/images/icon.png');
png(svg(mitRand(motiv(), 0.72), false), 1024, 'assets/images/android-icon-foreground.png');
png(svg('', true), 1024, 'assets/images/android-icon-background.png');
png(svg(mitRand(motiv({ farbig: false }), 0.72), false), 1024, 'assets/images/android-icon-monochrome.png');
png(svg(motiv(), false), 1024, 'assets/images/splash-icon.png');
png(icon, 48, 'assets/images/favicon.png');
