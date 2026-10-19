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
 * Rang-Taler: der Rahmen um jedes Art-Icon, je nach Seltenheit.
 * Jede Stufe hat eine eigene FORM (nicht nur Farbe), damit man sie auch ohne Farbsehen erkennt:
 *
 *  1 häufig      – Rindentaler:   schlichter Holzring mit Kerben, Jahresring-Linie
 *  2 selten      – Moostaler:     Ring mit Blätterkranz, zwei Edelsteine links und rechts
 *  3 sehr selten – Kristalltaler: Doppelring mit Runenband, sechs Kristallzacken, Funkeln
 *  4 legendär    – Sonnentaler:   Strahlenkranz, Perlenring, Krone oben, Lorbeer unten, starker Schein
 *
 * Raster 120 × 120, Mitte 60/60. Das Icon liegt in der Scheibe mit Radius 41 (siehe ICON_RADIUS).
 * Farben kommen als Parameter (aus src/theme/theme.ts) – keine Farbwerte in dieser Datei.
 */
export const TALER_GROESSE = 120;
export const MITTE = 60;
export const ICON_RADIUS = 41;

export type TalerFarben = {
  night: string;
  forest: string;
  moss: string;
  rune: string;
  fog: string;
  moon: string;
  amber: string;
  rare: string;
  legend: string;
  rinde: string;
  rindeHell: string;
  rindeDunkel: string;
  eichel: string;
  eichenLaub: string;
  eichenLaubHell: string;
};

const rad = (grad: number) => ((grad - 90) * Math.PI) / 180;
const pol = (r: number, grad: number): [number, number] => [
  MITTE + r * Math.cos(rad(grad)),
  MITTE + r * Math.sin(rad(grad)),
];
const f1 = (n: number) => Math.round(n * 10) / 10;

/** Blatt (Spitze nach außen) an Winkel `grad` auf Radius r */
function blatt(r: number, grad: number, laenge: number, breite: number, farbe: string, a: Knoten['a'] = {}): Knoten {
  const [x, y] = pol(r, grad);
  return pfad(
    `M0 ${f1(laenge / 2)} C${f1(breite)} ${f1(laenge / 4)} ${f1(breite)} ${f1(-laenge / 4)} 0 ${f1(-laenge / 2)} C${f1(-breite)} ${f1(-laenge / 4)} ${f1(-breite)} ${f1(laenge / 4)} 0 ${f1(laenge / 2)} Z`,
    { fill: farbe, transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(grad)})`, ...a },
  );
}

/** vierzackiger Funkelstern */
function funkeln(x: number, y: number, r: number, farbe: string): Knoten {
  const k = r * 0.28;
  return pfad(
    `M${f1(x)} ${f1(y - r)} L${f1(x + k)} ${f1(y - k)} L${f1(x + r)} ${f1(y)} L${f1(x + k)} ${f1(y + k)} L${f1(x)} ${f1(y + r)} L${f1(x - k)} ${f1(y + k)} L${f1(x - r)} ${f1(y)} L${f1(x - k)} ${f1(y - k)} Z`,
    { fill: farbe },
  );
}

/**
 * Teile des Talers:
 * - `defs`: Verläufe (mit eindeutigem Präfix, damit mehrere Taler auf einer Seite nicht kollidieren)
 * - `hinten`: Schein und Strahlen hinter der Münze
 * - `scheibe`: Hintergrund der Icon-Scheibe
 * - `rand`: Ring und Schmuck über dem Icon
 */
export function talerRahmen(stufe: 1 | 2 | 3 | 4, c: TalerFarben, id: string) {
  const v = (n: string) => `url(#${id}-${n})`;
  const defs: Knoten[] = [
    {
      t: 'radialGradient',
      a: { id: `${id}-scheibe`, cx: '50%', cy: '38%', r: '62%' },
      k: [
        { t: 'stop', a: { offset: '0', stopColor: c.forest } },
        { t: 'stop', a: { offset: '1', stopColor: c.night } },
      ],
    },
    {
      t: 'radialGradient',
      a: { id: `${id}-schein`, cx: '50%', cy: '50%', r: '50%' },
      k: [
        {
          t: 'stop',
          a: {
            offset: '0.62',
            stopColor: [c.fog, c.rune, c.rare, c.legend][stufe - 1],
            stopOpacity: [0, 0.35, 0.5, 0.75][stufe - 1],
          },
        },
        { t: 'stop', a: { offset: '1', stopColor: [c.fog, c.rune, c.rare, c.legend][stufe - 1], stopOpacity: 0 } },
      ],
    },
    {
      t: 'linearGradient',
      a: { id: `${id}-ring`, x1: '0', y1: '0', x2: '0', y2: '1' },
      k: (
        [
          [c.rindeHell, c.rinde, c.rindeDunkel],
          [c.eichenLaubHell, c.eichel, c.eichenLaub],
          [c.moon, c.rare, c.night],
          [c.moon, c.legend, c.amber],
        ][stufe - 1] as string[]
      ).map((farbe, i) => ({ t: 'stop' as const, a: { offset: String(i / 2), stopColor: farbe } })),
    },
  ];

  const hinten: Knoten[] = [
    kreis(MITTE, MITTE, 60, { fill: v('schein') }),
    kreis(MITTE, MITTE + 2, 51, { fill: c.night, opacity: 0.55 }),
  ];
  const rand: Knoten[] = [];

  if (stufe === 1) {
    rand.push(
      kreis(MITTE, MITTE, 46.5, { fill: 'none', stroke: v('ring'), strokeWidth: 7 }),
      kreis(MITTE, MITTE, 50, { fill: 'none', stroke: c.rindeDunkel, strokeWidth: 1 }),
      kreis(MITTE, MITTE, 42.8, { fill: 'none', stroke: c.rindeDunkel, strokeWidth: 1.2 }),
      // Jahresring-Linie im Holz
      kreis(MITTE, MITTE, 47.6, {
        fill: 'none',
        stroke: c.rindeDunkel,
        strokeWidth: 0.5,
        opacity: 0.6,
        strokeDasharray: '9 4 3 5',
      }),
      // Kerben wie in Rinde geschnitzt
      ...Array.from({ length: 12 }, (_, i) => {
        const [x0, y0] = pol(43.6, i * 30 + 15);
        const [x1, y1] = pol(49.4, i * 30 + 15);
        return pfad(`M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`, {
          stroke: c.rindeDunkel,
          strokeWidth: 1.1,
          opacity: 0.7,
        });
      }),
    );
  }

  if (stufe === 2) {
    // Blätterkranz hinter dem Ring
    hinten.push(
      ...Array.from({ length: 16 }, (_, i) =>
        blatt(51, i * 22.5 + 11, 11, 3.6, i % 2 ? c.eichenLaubHell : c.eichenLaub, { opacity: 0.95 }),
      ),
    );
    rand.push(
      kreis(MITTE, MITTE, 46.5, { fill: 'none', stroke: v('ring'), strokeWidth: 6.5 }),
      kreis(MITTE, MITTE, 49.8, { fill: 'none', stroke: c.eichenLaub, strokeWidth: 1 }),
      kreis(MITTE, MITTE, 43, { fill: 'none', stroke: c.rune, strokeWidth: 1, opacity: 0.8 }),
      // zwei Edelsteine links und rechts
      ...[270, 90].map((grad) => {
        const [x, y] = pol(46.5, grad);
        return g({ transform: `translate(${f1(x)} ${f1(y)})` }, [
          pfad('M0 -6 L4.5 0 L0 6 L-4.5 0 Z', { fill: c.rune, stroke: c.night, strokeWidth: 0.8 }),
          pfad('M0 -6 L4.5 0 L0 0 Z', { fill: c.moon, opacity: 0.55 }),
        ]);
      }),
    );
  }

  if (stufe === 3) {
    // sechs Kristallzacken
    hinten.push(
      ...Array.from({ length: 6 }, (_, i) => {
        const w = i * 60 + 30;
        const [xa, ya] = pol(45, w - 7);
        const [xs, ys] = pol(60, w);
        const [xb, yb] = pol(45, w + 7);
        const [xm, ym] = pol(52, w);
        return g({}, [
          pfad(`M${f1(xa)} ${f1(ya)} L${f1(xs)} ${f1(ys)} L${f1(xb)} ${f1(yb)} Z`, {
            fill: c.rare,
            stroke: c.night,
            strokeWidth: 0.8,
          }),
          pfad(`M${f1(xa)} ${f1(ya)} L${f1(xs)} ${f1(ys)} L${f1(xm)} ${f1(ym)} Z`, { fill: c.moon, opacity: 0.45 }),
        ]);
      }),
    );
    rand.push(
      kreis(MITTE, MITTE, 46.5, { fill: 'none', stroke: v('ring'), strokeWidth: 7 }),
      kreis(MITTE, MITTE, 50.2, { fill: 'none', stroke: c.rare, strokeWidth: 1.2 }),
      kreis(MITTE, MITTE, 42.6, { fill: 'none', stroke: c.rare, strokeWidth: 1.2 }),
      // Runenband: kurze eingeritzte Zeichen rundherum
      ...Array.from({ length: 24 }, (_, i) => {
        const w = i * 15;
        const [x0, y0] = pol(44.6, w);
        const [x1, y1] = pol(48.4, w + (i % 3 === 0 ? 0 : i % 3 === 1 ? 3 : -3));
        return pfad(`M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`, {
          stroke: c.moon,
          strokeWidth: 0.9,
          opacity: 0.6,
          strokeLinecap: 'round',
        });
      }),
      funkeln(22, 20, 4.5, c.moon),
      funkeln(100, 96, 3.6, c.moon),
      funkeln(104, 28, 2.6, c.rare),
    );
  }

  if (stufe === 4) {
    // Strahlenkranz
    hinten.push(
      ...Array.from({ length: 24 }, (_, i) => {
        const w = i * 15;
        const lang = i % 2 === 0 ? 60 : 55.5;
        const [xa, ya] = pol(48, w - 4);
        const [xs, ys] = pol(lang, w);
        const [xb, yb] = pol(48, w + 4);
        return pfad(`M${f1(xa)} ${f1(ya)} L${f1(xs)} ${f1(ys)} L${f1(xb)} ${f1(yb)} Z`, {
          fill: i % 2 === 0 ? c.legend : c.amber,
          opacity: 0.95,
        });
      }),
      // Lorbeer unten links und rechts
      ...[0, 1, 2, 3, 4].flatMap((n) => [
        blatt(50, 205 - n * 13, 10, 3.4, n % 2 ? c.legend : c.amber, { stroke: c.night, strokeWidth: 0.5 }),
        blatt(50, 155 + n * 13, 10, 3.4, n % 2 ? c.legend : c.amber, { stroke: c.night, strokeWidth: 0.5 }),
      ]),
    );
    rand.push(
      kreis(MITTE, MITTE, 46.5, { fill: 'none', stroke: v('ring'), strokeWidth: 7.5 }),
      kreis(MITTE, MITTE, 50.4, { fill: 'none', stroke: c.amber, strokeWidth: 1.2 }),
      kreis(MITTE, MITTE, 42.5, { fill: 'none', stroke: c.amber, strokeWidth: 1.2 }),
      // Perlenring
      ...Array.from({ length: 30 }, (_, i) => {
        const [x, y] = pol(46.5, i * 12);
        return kreis(f1(x), f1(y), 1.25, { fill: c.moon, opacity: 0.9 });
      }),
      // Krone oben
      g({ transform: `translate(${MITTE} 9)` }, [
        pfad('M-11 5 L-11 -3 L-6 1 L0 -7 L6 1 L11 -3 L11 5 Z', { fill: c.legend, stroke: c.night, strokeWidth: 1 }),
        pfad('M-11 5 L11 5 L11 7.5 L-11 7.5 Z', { fill: c.amber, stroke: c.night, strokeWidth: 0.8 }),
        kreis(0, -7, 1.6, { fill: c.moon }),
        kreis(-11, -3, 1.3, { fill: c.moon }),
        kreis(11, -3, 1.3, { fill: c.moon }),
      ]),
      funkeln(18, 30, 4, c.moon),
      funkeln(104, 86, 3.2, c.moon),
    );
  }

  return { defs, hinten, scheibe: [kreis(MITTE, MITTE, ICON_RADIUS + 2, { fill: v('scheibe') })], rand };
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
