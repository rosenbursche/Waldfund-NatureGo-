/**
 * Licht nach echter Uhrzeit: Morgendunst, Tag, goldene Stunde, Mondnacht.
 *
 * Für einige Uhrzeiten gibt es feste "Stimmungen" (Schlüsselbilder).
 * Dazwischen werden Farben und Helligkeiten weich übergeblendet,
 * damit es keinen harten Sprung gibt.
 *
 * Bewusst gedämpft: Auch der Tag soll mystisch bleiben, nicht grell.
 */

export type Stimmung = {
  name: string;
  himmel: string; // Hintergrundfarbe
  nebel: string; // Nebelfarbe
  nebelDichte: number; // 0.02 = klar, 0.08 = dicht
  umgebung: string; // Umgebungslicht
  umgebungStaerke: number;
  licht: string; // Sonne bzw. Mond
  lichtStaerke: number;
  lichtHoehe: number; // 0 = Horizont, 1 = Zenit
  sterne: number; // Sichtbarkeit 0–1
  gluehwuermchen: number; // Anteil sichtbarer Glühwürmchen/Sporen 0–1
  fenster: number; // Leuchtkraft der Hüttenfenster 0–1
};

// Schlüsselbilder: Stunde des Tages → Stimmung
const SCHLUESSEL: [number, Stimmung][] = [
  [0, nacht()],
  [4.5, nacht()],
  [
    6.5,
    {
      name: 'Morgendunst',
      himmel: '#2A3A3C',
      nebel: '#6F8580',
      nebelDichte: 0.075,
      umgebung: '#9FB3AD',
      umgebungStaerke: 0.55,
      licht: '#F2D3A8',
      lichtStaerke: 0.7,
      lichtHoehe: 0.15,
      sterne: 0,
      gluehwuermchen: 0.2,
      fenster: 0.5,
    },
  ],
  [
    10,
    {
      name: 'Tag im Wald',
      himmel: '#3E5652',
      nebel: '#5E7570',
      nebelDichte: 0.035,
      umgebung: '#C9D6D0',
      umgebungStaerke: 0.75,
      licht: '#F4EBD8',
      lichtStaerke: 1.1,
      lichtHoehe: 0.8,
      sterne: 0,
      gluehwuermchen: 0.1,
      fenster: 0.15,
    },
  ],
  [
    16.5,
    {
      name: 'Tag im Wald',
      himmel: '#3E5652',
      nebel: '#5E7570',
      nebelDichte: 0.035,
      umgebung: '#C9D6D0',
      umgebungStaerke: 0.75,
      licht: '#F4EBD8',
      lichtStaerke: 1.1,
      lichtHoehe: 0.6,
      sterne: 0,
      gluehwuermchen: 0.1,
      fenster: 0.15,
    },
  ],
  [
    19,
    {
      name: 'Goldene Stunde',
      himmel: '#3A2E2A',
      nebel: '#7A5E48',
      nebelDichte: 0.045,
      umgebung: '#C99A6A',
      umgebungStaerke: 0.5,
      licht: '#E8B86A',
      lichtStaerke: 1.2,
      lichtHoehe: 0.12,
      sterne: 0.05,
      gluehwuermchen: 0.5,
      fenster: 0.7,
    },
  ],
  [
    21,
    {
      name: 'Dämmerung',
      himmel: '#142420',
      nebel: '#2C3E3A',
      nebelDichte: 0.06,
      umgebung: '#5E7A80',
      umgebungStaerke: 0.35,
      licht: '#9FB3C8',
      lichtStaerke: 0.4,
      lichtHoehe: 0.3,
      sterne: 0.6,
      gluehwuermchen: 1,
      fenster: 1,
    },
  ],
  [22.5, nacht()],
  [24, nacht()],
];

function nacht(): Stimmung {
  return {
    name: 'Mondnacht',
    himmel: '#0B1414',
    nebel: '#1B2A2A',
    nebelDichte: 0.055,
    umgebung: '#4A6070',
    umgebungStaerke: 0.3,
    licht: '#B8C8DC',
    lichtStaerke: 0.45,
    lichtHoehe: 0.55,
    sterne: 1,
    gluehwuermchen: 1,
    fenster: 1,
  };
}

/** Farbe "#RRGGBB" → [r, g, b] */
function zuRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function zuHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function mischeFarbe(a: string, b: string, t: number): string {
  const x = zuRgb(a);
  const y = zuRgb(b);
  return zuHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as [number, number, number]);
}

const mische = (a: number, b: number, t: number) => a + (b - a) * t;

/** Stimmung für eine Uhrzeit. `stunde` darf Nachkommastellen haben (18.5 = 18:30). */
export function stimmungFuer(stunde: number): Stimmung {
  const h = ((stunde % 24) + 24) % 24;
  let i = 0;
  while (i < SCHLUESSEL.length - 2 && SCHLUESSEL[i + 1][0] <= h) i++;
  const [h0, a] = SCHLUESSEL[i];
  const [h1, b] = SCHLUESSEL[i + 1];
  // Weiche Kurve statt gerader Linie (langsamer Anfang und langsames Ende)
  const roh = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
  const t = roh * roh * (3 - 2 * roh);

  return {
    name: t < 0.5 ? a.name : b.name,
    himmel: mischeFarbe(a.himmel, b.himmel, t),
    nebel: mischeFarbe(a.nebel, b.nebel, t),
    nebelDichte: mische(a.nebelDichte, b.nebelDichte, t),
    umgebung: mischeFarbe(a.umgebung, b.umgebung, t),
    umgebungStaerke: mische(a.umgebungStaerke, b.umgebungStaerke, t),
    licht: mischeFarbe(a.licht, b.licht, t),
    lichtStaerke: mische(a.lichtStaerke, b.lichtStaerke, t),
    lichtHoehe: mische(a.lichtHoehe, b.lichtHoehe, t),
    sterne: mische(a.sterne, b.sterne, t),
    gluehwuermchen: mische(a.gluehwuermchen, b.gluehwuermchen, t),
    fenster: mische(a.fenster, b.fenster, t),
  };
}

export function stimmungJetzt(jetzt: Date = new Date()): Stimmung {
  return stimmungFuer(jetzt.getHours() + jetzt.getMinutes() / 60);
}
