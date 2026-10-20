/**
 * Gemeinsame Beschreibung von SVG-Zeichnungen als reine Daten („Knoten“).
 * Die App zeichnet sie mit react-native-svg (src/components/taler/), das Vorschau-Skript
 * (scripts/taler-vorschau.mjs) macht daraus ein Bild – so sehen Mensch und Agent dasselbe.
 * Diese Datei hat bewusst keine Importe, damit Node sie direkt laden kann
 * (`node scripts/taler-vorschau.mjs`).
 */
export type Knoten = {
  t: 'g' | 'path' | 'circle' | 'ellipse' | 'rect' | 'radialGradient' | 'linearGradient' | 'stop' | 'clipPath' | 'defs';
  a: Record<string, string | number>;
  k?: Knoten[];
};

export const g = (a: Knoten['a'], k: Knoten[]): Knoten => ({ t: 'g', a, k });
export const pfad = (d: string, a: Knoten['a'] = {}): Knoten => ({ t: 'path', a: { d, ...a } });
export const kreis = (cx: number, cy: number, r: number, a: Knoten['a'] = {}): Knoten => ({
  t: 'circle',
  a: { cx, cy, r, ...a },
});

/** Attribute, die SVG in camelCase schreibt – alle anderen werden zu kebab-case (strokeWidth → stroke-width) */
const CAMEL = new Set(['gradientUnits', 'gradientTransform', 'clipPathUnits', 'viewBox']);

/** Knoten → SVG-Text (für das Vorschau-Skript) */
export function alsSvg(k: Knoten): string {
  const attr = Object.entries(k.a)
    .map(([n, v]) => `${CAMEL.has(n) ? n : n.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${v}"`)
    .join(' ');
  if (!k.k?.length) return `<${k.t} ${attr}/>`;
  return `<${k.t} ${attr}>${k.k.map(alsSvg).join('')}</${k.t}>`;
}

/**
 * Rang-Embleme: der Rahmen um jedes Art-Icon, je nach Seltenheit (Gestaltung: docs/ICONS.md).
 * Alle vier Ränge sind eine Familie – sie steigern sich über Metall, Email-Farbe und Edelstein:
 *  1 häufig      – Kupfer und Patina:   Ring, kleines Blatt je Seite, kleiner Stein oben, Anhänger unten
 *  2 selten      – Bronze und Smaragd:  drei Blätter je Seite, Blattkamm, Stein im Anhänger
 *  3 sehr selten – Silber und Amethyst: vier Blätter je Seite, leiser violetter Schein, Funkeln
 *  4 legendär    – Gold und Rubinfeuer: wie 3, größerer Rubin, warmer Schein
 * Raster: Icon-Mitte 60/60, Icon-Scheibe Radius ICON_RADIUS. Das Emblem ragt darüber hinaus,
 * deshalb gilt für die Darstellung TALER_VIEWBOX. Farben kommen als Parameter (src/theme/theme.ts).
 */
export const TALER_GROESSE = 120;
export const MITTE = 60;
export const ICON_RADIUS = 41;
export const TALER_VIEWBOX = { x: -10, y: -4, b: 140, h: 136 };

export type RangFarben = {
  metall: readonly string[];
  email: readonly string[];
  stein: string;
  schein: string;
  glanz: number;
};
export type GrundFarben = { night: string; forest: string };

const f2 = (n: number) => Math.round(n * 100) / 100;

function verlaufLinear(id: string, stops: [string, string][]): Knoten {
  return {
    t: 'linearGradient',
    a: { id, x1: '0', y1: '0', x2: '0.35', y2: '1' },
    k: stops.map(([o, f]) => ({ t: 'stop', a: { offset: o, stopColor: f } })),
  };
}
function verlaufRadial(id: string, stops: [string, string, number?][]): Knoten {
  return {
    t: 'radialGradient',
    a: { id, cx: '50%', cy: '42%', r: '58%' },
    k: stops.map(([o, f, op]) => ({ t: 'stop', a: { offset: o, stopColor: f, stopOpacity: op ?? 1 } })),
  };
}

/** geschwungenes Metallblatt: Basis bei (0,0), Spitze bei (L,0), Breite w, mit Mittelrippe, Adern und Glanzkante */
function klinge(L: number, w: number, m: readonly string[], night: string, id: string, adern: number): Knoten[] {
  const k = L * 0.25;
  const unten = `C${f2(L * 0.72)} ${f2(w * 0.35 - k * 0.6)} ${f2(L * 0.3)} ${f2(w * 0.75)} 0 ${f2(w * 0.35)} Z`;
  const teile: Knoten[] = [
    pfad(
      `M0 ${f2(-w * 0.35)} C${f2(L * 0.3)} ${f2(-w - k * 0.2)} ${f2(L * 0.7)} ${f2(-w * 0.8 - k)} ${f2(L)} ${f2(-k)} ${unten}`,
      { fill: `url(#${id}-metall)`, stroke: night, strokeWidth: 1.1, strokeLinejoin: 'round' },
    ),
    pfad(`M0 0 C${f2(L * 0.35)} ${f2(-k * 0.1)} ${f2(L * 0.7)} ${f2(-k * 0.55)} ${f2(L)} ${f2(-k)} ${unten}`, {
      fill: '#000000',
      opacity: 0.28,
    }),
    pfad(`M1 0 C${f2(L * 0.35)} ${f2(-k * 0.1)} ${f2(L * 0.7)} ${f2(-k * 0.55)} ${f2(L - 1)} ${f2(-k)}`, {
      fill: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 0.8,
      opacity: 0.55,
    }),
  ];
  for (let i = 1; i <= adern; i++) {
    const t = i / (adern + 1);
    teile.push(
      pfad(`M${f2(L * t)} ${f2(-k * t * t)} q${f2(L * 0.08)} ${f2(-w * 0.45)} ${f2(L * 0.16)} ${f2(-w * 0.55)}`, {
        fill: 'none',
        stroke: m[4],
        strokeWidth: 0.6,
        opacity: 0.6,
      }),
    );
  }
  teile.push(
    pfad(
      `M${f2(L * 0.12)} ${f2(-w * 0.55)} C${f2(L * 0.35)} ${f2(-w * 0.9)} ${f2(L * 0.6)} ${f2(-w * 0.8)} ${f2(L * 0.82)} ${f2(-k * 0.9 - w * 0.25)}`,
      { fill: 'none', stroke: '#FFFFFF', strokeWidth: 1, opacity: 0.45, strokeLinecap: 'round' },
    ),
  );
  return teile;
}
const setze = (x: number, y: number, w: number, teile: Knoten[], spiegeln = false): Knoten =>
  spiegeln
    ? g({ transform: `translate(${2 * MITTE} 0) scale(-1 1)` }, [
        g({ transform: `translate(${x} ${y}) rotate(${w})` }, teile),
      ])
    : g({ transform: `translate(${x} ${y}) rotate(${w})` }, teile);
const beidseitig = (x: number, y: number, w: number, teile: Knoten[]) => [
  setze(x, y, w, teile),
  setze(x, y, w, teile, true),
];

function edelstein(x: number, y: number, r: number, farbe: string, night: string, id: string): Knoten {
  return g({ transform: `translate(${x} ${y})` }, [
    kreis(0, 0, f2(r * 1.9), { fill: farbe, opacity: 0.22 }),
    pfad(
      `M0 ${-r} C${f2(r * 0.7)} ${f2(-r * 0.7)} ${f2(r * 0.95)} ${f2(-r * 0.2)} ${f2(r * 0.9)} 0 C${f2(r * 0.85)} ${f2(r * 0.5)} ${f2(r * 0.5)} ${f2(r * 0.9)} 0 ${r} C${f2(-r * 0.5)} ${f2(r * 0.9)} ${f2(-r * 0.85)} ${f2(r * 0.5)} ${f2(-r * 0.9)} 0 C${f2(-r * 0.95)} ${f2(-r * 0.2)} ${f2(-r * 0.7)} ${f2(-r * 0.7)} 0 ${-r} Z`,
      { fill: `url(#${id}-stein)`, stroke: night, strokeWidth: 0.9 },
    ),
    pfad(`M0 ${f2(-r * 0.55)} L${f2(r * 0.5)} 0 L0 ${f2(r * 0.55)} L${f2(-r * 0.5)} 0 Z`, {
      fill: '#FFFFFF',
      opacity: 0.18,
    }),
    pfad(
      `M${f2(-r * 0.5)} ${f2(-r * 0.5)} C${f2(-r * 0.3)} ${f2(-r * 0.8)} ${f2(r * 0.1)} ${f2(-r * 0.85)} ${f2(r * 0.25)} ${f2(-r * 0.7)}`,
      { fill: 'none', stroke: '#FFFFFF', strokeWidth: f2(r * 0.22), opacity: 0.75, strokeLinecap: 'round' },
    ),
    kreis(f2(r * 0.35), f2(r * 0.35), f2(r * 0.12), { fill: '#FFFFFF', opacity: 0.6 }),
  ]);
}
function funkeln(x: number, y: number, r: number): Knoten {
  const k = r * 0.22;
  return pfad(
    `M${x} ${y - r} Q${f2(x + k)} ${f2(y - k)} ${x + r} ${y} Q${f2(x + k)} ${f2(y + k)} ${x} ${y + r} Q${f2(x - k)} ${f2(y + k)} ${x - r} ${y} Q${f2(x - k)} ${f2(y - k)} ${x} ${y - r} Z`,
    { fill: '#FFFFFF', opacity: 0.95 },
  );
}

/**
 * Teile des Emblems (id: eindeutiges Präfix für Verläufe):
 * - defs: Verläufe · hinten: Schein und Seitenblätter · scheibe: Grund der Icon-Scheibe
 * - innen: farbiges Leuchten am Rand der Scheibe (über dem Icon) · vorn: Ring, Kamm, Anhänger, Funkeln
 */
export function talerRahmen(stufe: 1 | 2 | 3 | 4, rang: RangFarben, grund: GrundFarben, id: string) {
  const m = rang.metall;
  const e = rang.email;
  const night = grund.night;
  const defs: Knoten[] = [
    verlaufLinear(`${id}-metall`, [
      ['0', m[0]],
      ['0.22', m[1]],
      ['0.42', m[2]],
      ['0.55', m[3]],
      ['0.78', m[1]],
      ['1', m[4]],
    ]),
    verlaufRadial(`${id}-email`, [
      ['0', e[0]],
      ['0.6', e[1]],
      ['1', e[2]],
    ]),
    verlaufRadial(`${id}-stein`, [
      ['0', '#FFFFFF'],
      ['0.25', rang.stein],
      ['1', e[2]],
    ]),
    verlaufRadial(`${id}-schein`, [
      ['0.25', rang.schein, rang.glanz],
      ['0.6', rang.schein, rang.glanz * 0.4],
      ['1', rang.schein, 0],
    ]),
    verlaufRadial(`${id}-innen`, [
      ['0.7', e[1], 0],
      ['1', e[0], 0.55],
    ]),
  ];
  const hinten: Knoten[] = [kreis(MITTE, MITTE, 66, { fill: `url(#${id}-schein)` })];
  const vorn: Knoten[] = [];
  const y = (n: number) => n - 6; // Entwurf war für Mitte 60/66 gezeichnet

  // Seitenblätter
  if (stufe === 1) hinten.push(...beidseitig(98, y(70), -16, klinge(20, 7, m, night, id, 2)));
  if (stufe === 2) {
    hinten.push(...beidseitig(96, y(56), -40, klinge(30, 9, m, night, id, 3)));
    hinten.push(...beidseitig(100, y(72), -6, klinge(28, 8.5, m, night, id, 3)));
    hinten.push(...beidseitig(96, y(88), 28, klinge(20, 7, m, night, id, 2)));
  }
  if (stufe >= 3) {
    hinten.push(...beidseitig(96, y(54), -46, klinge(30, 9, m, night, id, 3)));
    hinten.push(...beidseitig(100, y(68), -14, klinge(30, 9, m, night, id, 3)));
    hinten.push(...beidseitig(99, y(82), 12, klinge(26, 8, m, night, id, 3)));
    hinten.push(...beidseitig(94, y(94), 36, klinge(18, 6.5, m, night, id, 2)));
  }

  // Ring: dunkle Fassung, Metallrand außen, Email-Band, Metallrand innen
  vorn.push(
    kreis(MITTE, MITTE, 49, { fill: 'none', stroke: night, strokeWidth: 10 }),
    kreis(MITTE, MITTE, 51, { fill: 'none', stroke: `url(#${id}-metall)`, strokeWidth: 3.2 }),
    kreis(MITTE, MITTE, 46.8, { fill: 'none', stroke: `url(#${id}-email)`, strokeWidth: 3.6 }),
    ...Array.from({ length: 16 }, (_, i) => {
      const w0 = (i * 22.5 * Math.PI) / 180;
      const [x, yy] = [MITTE + 46.5 * Math.cos(w0), MITTE + 46.5 * Math.sin(w0)];
      return pfad(
        `M${f2(x)} ${f2(yy)} q${f2(2.2 * Math.cos(w0 + 1.4))} ${f2(2.2 * Math.sin(w0 + 1.4))} ${f2(3.6 * Math.cos(w0 + 0.6))} ${f2(3.6 * Math.sin(w0 + 0.6))}`,
        { fill: 'none', stroke: m[0], strokeWidth: 0.7, opacity: 0.55, strokeLinecap: 'round' },
      );
    }),
    kreis(MITTE, MITTE, 44.3, { fill: 'none', stroke: `url(#${id}-metall)`, strokeWidth: 1.6 }),
    pfad(`M${MITTE - 44} ${MITTE - 22} A50 50 0 0 1 ${MITTE + 6} ${MITTE - 51}`, {
      fill: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 1.4,
      opacity: 0.6,
      strokeLinecap: 'round',
    }),
  );
  const perlen = stufe === 1 ? 8 : stufe === 2 ? 12 : 16;
  for (let i = 0; i < perlen; i++) {
    const w0 = ((i * 360) / perlen - 90) * (Math.PI / 180);
    vorn.push(
      kreis(f2(MITTE + 50.9 * Math.cos(w0)), f2(MITTE + 50.9 * Math.sin(w0)), stufe >= 3 ? 1.05 : 1.2, {
        fill: m[0],
        stroke: m[4],
        strokeWidth: 0.4,
      }),
    );
  }

  // Kamm oben
  if (stufe === 1) vorn.push(setze(60, y(16), -90, klinge(10, 5, m, night, id, 1)));
  if (stufe === 2) {
    vorn.push(setze(60, y(18), -90, klinge(16, 6.5, m, night, id, 2)));
    vorn.push(...beidseitig(62, y(18), -58, klinge(14, 5.5, m, night, id, 2)));
  }
  if (stufe >= 3) {
    vorn.push(setze(60, y(18), -90, klinge(18, 7, m, night, id, 2)));
    vorn.push(...beidseitig(62, y(18), -54, klinge(16, 6, m, night, id, 2)));
  }
  vorn.push(edelstein(60, y(14), [4, 5, 5.5, 6][stufe - 1], rang.stein, night, id));

  // Anhänger unten
  const tief = y([120, 126, 128, 130][stufe - 1]);
  vorn.push(
    pfad(
      `M48 ${y(112)} C52 ${y(116)} 54 ${tief - 6} 60 ${tief} C66 ${tief - 6} 68 ${y(116)} 72 ${y(112)} C66 ${y(117)} 54 ${y(117)} 48 ${y(112)} Z`,
      { fill: `url(#${id}-metall)`, stroke: night, strokeWidth: 1.1 },
    ),
    pfad(`M51 ${y(113.5)} C55 ${y(116)} 65 ${y(116)} 69 ${y(113.5)}`, {
      fill: 'none',
      stroke: '#FFFFFF',
      strokeWidth: 0.8,
      opacity: 0.5,
    }),
  );
  if (stufe >= 2) vorn.push(edelstein(60, tief - 12, 4, rang.stein, night, id));

  // Funkeln
  const funken: [number, number, number][] = [
    [],
    [[18, y(44), 3]],
    [
      [18, y(40), 3.2],
      [104, y(100), 2.6],
    ],
    [
      [16, y(38), 3.6],
      [104, y(102), 3],
      [100, y(28), 2.4],
    ],
  ][stufe - 1] as [number, number, number][];
  for (const [x, yy, r] of funken) vorn.push(funkeln(x, yy, r));

  return {
    defs,
    hinten,
    scheibe: [kreis(MITTE, MITTE, ICON_RADIUS + 3, { fill: grund.forest })],
    innen: [kreis(MITTE, MITTE, ICON_RADIUS + 2.5, { fill: `url(#${id}-innen)` })],
    vorn,
  };
}

// ---------- Art-Icons ----------

/**
 * Ein Art-Icon: Ebenen im Raster 120 × 120 (Mitte 60/60), gezeichnet innerhalb der Scheibe
 * mit Radius ICON_RADIUS. Daten liegen in src/data/icons/<artId>.json (Stilregeln: docs/ICONS.md).
 * - d: SVG-Pfad · f: Füllfarbe · o: Deckkraft · s/sw: Kontur und Breite
 * - rolle: 'form' (gehört zum Umriss), 'schatten', 'licht', 'detail' (Linien, Augen …)
 *   Noch nicht gefunden: nur die Form-Ebenen, alle in einer Farbe (Silhouette).
 */
export type IconEbene = {
  d: string;
  f?: string;
  o?: number;
  s?: string;
  sw?: number;
  rolle?: 'form' | 'schatten' | 'licht' | 'detail';
};
export type ArtIconDaten = { id: string; ebenen: IconEbene[] };

export function iconKnoten(icon: ArtIconDaten, gefunden: boolean, silhouette: string, id: string): Knoten[] {
  const clip: Knoten = { t: 'clipPath', a: { id: `${id}-clip` }, k: [kreis(MITTE, MITTE, ICON_RADIUS)] };
  const ebenen = gefunden ? icon.ebenen : icon.ebenen.filter((e) => (e.rolle ?? 'form') === 'form');
  return [
    { t: 'defs', a: {}, k: [clip] },
    g(
      { clipPath: `url(#${id}-clip)` },
      ebenen.map((e) =>
        pfad(e.d, {
          fill: gefunden ? (e.f ?? 'none') : silhouette,
          ...(e.o !== undefined && gefunden ? { opacity: e.o } : {}),
          ...(e.s && gefunden
            ? { stroke: e.s, strokeWidth: e.sw ?? 1, strokeLinecap: 'round', strokeLinejoin: 'round' }
            : {}),
        }),
      ),
    ),
  ];
}
