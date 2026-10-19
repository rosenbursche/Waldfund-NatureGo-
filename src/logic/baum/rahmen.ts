/**
 * Gemeinsames Gerüst aller Lebensbäume: Platz für Äste, Sterne, den toten Ast (Gefahr), Wurzeln und Runenring.
 * Jeder Baum-Stil zeichnet seine eigene Gestalt in dieses Gerüst.
 */
import {
  lerp,
  punktAuf,
  r1,
  richtungAuf,
  verjuengt,
  zweigKurve,
  zwischen,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export type BaumArt = 'pflanzen' | 'pilze' | 'voegel' | 'saeuger';

/** Farbrollen – welche echte Farbe dahintersteht, legt der Stil in der Oberfläche fest */
export type Rolle =
  | 'laubHinten'
  | 'holz'
  | 'holzSchatten'
  | 'rinde'
  | 'licht'
  | 'moos'
  | 'ranke'
  | 'laub'
  | 'laubHell'
  | 'ader'
  | 'akzent'
  | 'akzentHell'
  | 'dunkel'
  | 'leuchten';

/** Zeichenreihenfolge von hinten nach vorn */
export const REIHENFOLGE: Rolle[] = [
  'laubHinten',
  'leuchten',
  'holz',
  'holzSchatten',
  'rinde',
  'licht',
  'moos',
  'ranke',
  'laub',
  'laubHell',
  'ader',
  'akzent',
  'akzentHell',
  'dunkel',
];

/** eine Zeichenebene: Fläche (ohne `strich`) oder Linie (mit `strich` = Linienbreite) */
export type Ebene = { rolle: Rolle; d: string; strich?: number; deckkraft: number };

/** Sammelt alle Pfade nach Rolle, Linienbreite und Deckkraft – so entstehen wenige große Pfade. */
export class Leinwand {
  private teile = new Map<string, Ebene & { stuecke: string[] }>();
  /** Fläche */
  flaeche(rolle: Rolle, d: string, deckkraft = 1) {
    this.dazu(rolle, d, undefined, deckkraft);
  }
  /** Linie */
  strich(rolle: Rolle, d: string, breite: number, deckkraft = 1) {
    this.dazu(rolle, d, breite, deckkraft);
  }
  private dazu(rolle: Rolle, d: string, strich: number | undefined, deckkraft: number) {
    if (!d) return;
    const s = strich === undefined ? undefined : Math.round(strich * 10) / 10;
    const schluessel = `${rolle}|${s ?? ''}|${deckkraft}`;
    let e = this.teile.get(schluessel);
    if (!e) this.teile.set(schluessel, (e = { rolle, d: '', strich: s, deckkraft, stuecke: [] }));
    e.stuecke.push(d);
  }
  ebenen(): Ebene[] {
    const alle = [...this.teile.values()].map(({ rolle, strich, deckkraft, stuecke }) => ({
      rolle,
      strich,
      deckkraft,
      d: stuecke.join(' '),
    }));
    // nach Rolle sortieren, innerhalb einer Rolle Flächen vor Linien
    return alle.sort(
      (a, b) =>
        REIHENFOLGE.indexOf(a.rolle) - REIHENFOLGE.indexOf(b.rolle) ||
        Number(a.strich !== undefined) - Number(b.strich !== undefined),
    );
  }
}

export type Rune = { x: number; y: number; winkel: number; d: string };

export type Gestalt = {
  /** Spreizung der Äste in Grad (links und rechts von senkrecht) */
  spreizung: number;
  /** Abstand der Astspitzen von der Mitte (Anteil der Breite); bei vielen Ästen abwechselnd kurz/lang */
  lang: number;
  kurz: number;
  /** Erdboden (Anteil der Breite) */
  boden: number;
};

export type Rahmen = {
  W: number;
  hoehe: number;
  mitte: Punkt;
  ringRadius: number;
  boden: number;
  astSpitzen: Punkt[];
  /** -1 (ganz links) … 1 (ganz rechts) */
  astAnteile: number[];
  sternPlaetze: Punkt[];
  wurzelPlatz: Punkt;
  /** Spitze des toten Asts (gefährliche Arten), senkrecht über der Krone */
  todesPlatz: Punkt;
  runen: Rune[];
};

export function rahmen(W: number, anzahlAeste: number, anzahlSterne: number, rnd: Zufall, g: Gestalt): Rahmen {
  const mitte = { x: W / 2, y: W * 0.56 };
  const N = Math.max(1, anzahlAeste);
  // ab 5 Ästen weiter auffächern und die langen Äste weiter hinausziehen, damit sich die Knöpfe nicht berühren
  const viele = N >= 5;
  const spreizung = ((viele ? Math.max(g.spreizung, 80) : Math.min(g.spreizung, 22 + N * 10)) * Math.PI) / 180;
  const lang = viele ? g.lang + 0.07 : g.lang;
  const kurz = viele ? g.kurz + 0.01 : g.kurz;
  const astSpitzen: Punkt[] = [];
  const astAnteile: number[] = [];
  for (let i = 0; i < N; i++) {
    const anteil = N === 1 ? 0 : lerp(-1, 1, i / (N - 1));
    const a = anteil * spreizung;
    // der mittlere Ast (bei ungerader Zahl) bleibt kurz – darüber steht der Knopf des toten Asts
    const mittig = N % 2 === 1 && N > 1 && i === (N - 1) / 2;
    const r = W * ((N >= 4 && i % 2) || mittig ? kurz : lang);
    astSpitzen.push({ x: mitte.x + Math.sin(a) * r, y: mitte.y + W * 0.01 - Math.cos(a) * r });
    astAnteile.push(anteil);
  }

  // Sterne im Bogen über der Krone – in der Mitte bleibt eine Lücke für den toten Ast
  const sternPlaetze: Punkt[] = [];
  const luft = (16 * Math.PI) / 180;
  const sw = (Math.max(34, Math.min(62, 9 * anzahlSterne)) * Math.PI) / 180;
  const links = Math.ceil(anzahlSterne / 2);
  const rechts = anzahlSterne - links;
  const rs = W * (viele ? 0.455 : 0.415); // über den weiter hinausgezogenen Ästen
  for (let i = 0; i < anzahlSterne; i++) {
    const seite = i < links ? -1 : 1;
    const n = seite < 0 ? links : rechts;
    const k = seite < 0 ? i : i - links;
    const t = n === 1 ? 0.5 : seite < 0 ? k / (n - 1) : 1 - k / (n - 1);
    const a = seite * lerp(sw, luft, t);
    sternPlaetze.push({ x: mitte.x + Math.sin(a) * rs, y: mitte.y - Math.cos(a) * rs });
  }

  // Runenring, unten offen: dort brechen die Wurzeln hindurch
  const ringRadius = W * 0.47;
  const runen: Rune[] = [];
  const anzahlRunen = 44;
  const luecke = (26 * Math.PI) / 180;
  const lueckeOben = (12 * Math.PI) / 180; // oben Platz für den Knopf des toten Asts
  const gr = W / 300;
  for (let k = 0; k < anzahlRunen; k++) {
    const phi = -Math.PI / 2 + (k / anzahlRunen) * Math.PI * 2;
    const vonUnten = Math.abs(((phi - Math.PI / 2 + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const d = runenZeichen(rnd, gr);
    if (vonUnten < luecke || Math.PI - vonUnten < lueckeOben) continue;
    runen.push({
      x: r1(mitte.x + Math.cos(phi) * ringRadius),
      y: r1(mitte.y + Math.sin(phi) * ringRadius),
      winkel: r1((phi * 180) / Math.PI + 90),
      d,
    });
  }

  return {
    W,
    hoehe: W * 1.1,
    mitte,
    ringRadius,
    boden: W * g.boden,
    astSpitzen,
    astAnteile,
    sternPlaetze,
    wurzelPlatz: { x: W / 2, y: W * 0.915 },
    todesPlatz: { x: W / 2, y: W * 0.1 },
    runen,
  };
}

/** zufällige, runenartige Zeichen aus wenigen Strichen (eigene Erfindung, keine echte Schrift) */
function runenZeichen(rnd: Zufall, g: number): string {
  const teile: string[] = [];
  const P = (x: number, y: number) => `${r1(x * g)} ${r1(y * g)}`;
  if (rnd() < 0.75) teile.push(`M${P(0, -6)} L${P(0, 6)}`);
  const n = 1 + Math.floor(rnd() * 2);
  for (let i = 0; i < n; i++) {
    const art = rnd();
    const y = -5 + rnd() * 8;
    const s = rnd() < 0.5 ? -1 : 1;
    if (art < 0.35) teile.push(`M${P(0, y)} L${P(s * 4, y - 3)}`);
    else if (art < 0.6) teile.push(`M${P(0, y)} L${P(s * 4, y + 3)}`);
    else if (art < 0.8) teile.push(`M${P(0, y)} Q${P(s * 5, y - 1)} ${P(s * 2, y + 4)}`);
    else teile.push(`M${P(-3, y)} L${P(3, y + 2)}`);
  }
  if (rnd() < 0.3) teile.push(`M${P(-1.2, -9)} L${P(1.2, -9)}`);
  return teile.join(' ');
}

/**
 * Schattenwurzeln unter der Erde ("Gefährlich & tödlich").
 * `fein` = viele dünne Fäden (Pilz-Myzel) statt kräftiger Wurzeln.
 */
export function schattenWurzeln(W: number, boden: number, rnd: Zufall, fein = false): string {
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const teile: string[] = [];
  const anzahl = fein ? 14 : 9;
  for (let i = 0; i < anzahl; i++) {
    const s = i % 2 ? 1 : -1;
    const weite = (Math.floor(i / 2) + 0.3) * W * (fein ? 0.04 : 0.06);
    const start = { x: W / 2 + s * z(0, W * 0.025), y: boden + W * 0.004 };
    const ende = { x: W / 2 + s * weite + z(-6, 6), y: W * z(0.97, 1.07) };
    const k: Kurve = [
      start,
      { x: start.x + s * weite * z(0.5, 0.9), y: boden + W * z(0.02, 0.06) },
      { x: ende.x - s * weite * z(-0.2, 0.3), y: ende.y - W * z(0.05, 0.1) },
      ende,
    ];
    teile.push(fein ? verjuengt(k, W * 0.005, W * 0.0008, 12) : verjuengt(k, W * z(0.006, 0.014), W * 0.001, 14));
    const q = punktAuf(k, z(0.4, 0.6));
    teile.push(
      verjuengt(zweigKurve(q, Math.PI / 2 + s * z(0.3, 0.9), W * z(0.03, 0.06), -W * 0.01), W * 0.004, W * 0.0008, 6),
    );
  }
  return teile.join(' ');
}

/**
 * Der tote Ast: wächst schwarz, knorrig und dornig aus der Krone senkrecht nach oben zum Totenkopf-Knopf.
 * `holz` ist die Fläche, `dornen` die Dornen als Flächen, `risse` helle Risse im toten Holz.
 */
export function toterAst(
  mitte: Punkt,
  ziel: Punkt,
  W: number,
  rnd: Zufall,
): { holz: string; dornen: string; risse: string } {
  const start = { x: mitte.x, y: mitte.y - W * 0.06 };
  const ende = { x: ziel.x, y: ziel.y + W * 0.05 };
  const h = start.y - ende.y;
  const k: Kurve = [
    start,
    { x: start.x - W * 0.05, y: start.y - h * 0.35 },
    { x: ende.x + W * 0.05, y: start.y - h * 0.7 },
    ende,
  ];
  const holz = verjuengt(k, W * 0.05, W * 0.012, 24, 0.35, rnd);
  let dornen = '';
  let risse = '';
  for (let i = 1; i < 9; i++) {
    const t = i / 9.5;
    const p = punktAuf(k, t);
    const d = richtungAuf(k, t);
    const seite = i % 2 ? 1 : -1;
    const breite = lerp(W * 0.05, W * 0.012, t) / 2;
    const fuss = { x: p.x + d.y * breite * seite, y: p.y - d.x * breite * seite };
    const lang = W * (0.035 - t * 0.015) * zwischen(rnd, 0.8, 1.2);
    // Dorn zeigt schräg nach außen oben
    const spitze = { x: fuss.x + seite * lang, y: fuss.y - lang * 0.7 };
    const b = W * 0.006;
    dornen += `M${r1(fuss.x)} ${r1(fuss.y - b)} L${r1(spitze.x)} ${r1(spitze.y)} L${r1(fuss.x)} ${r1(fuss.y + b)} Z `;
    if (i % 3 === 0) {
      const q = punktAuf(k, t + 0.03);
      risse += `M${r1(p.x - 1)} ${r1(p.y)} L${r1(q.x + 1)} ${r1(q.y)} `;
    }
  }
  // zwei abgebrochene Seitenstummel
  for (const [t, s] of [
    [0.3, -1],
    [0.55, 1],
  ] as const) {
    const p = punktAuf(k, t);
    const stummel: Kurve = [
      p,
      { x: p.x + s * W * 0.03, y: p.y - W * 0.01 },
      { x: p.x + s * W * 0.06, y: p.y - W * 0.03 },
      { x: p.x + s * W * 0.075, y: p.y - W * 0.045 },
    ];
    dornen += verjuengt(stummel, W * 0.018, W * 0.004, 8) + ' ';
  }
  return { holz, dornen, risse };
}
