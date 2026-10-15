/**
 * Form des Lebensbaums – reine Geometrie, ohne Zeichnen.
 * Angelehnt an alte Wappenbäume: schlanker, leicht gedrehter Stamm, Äste, die erst nach außen
 * und dann nach oben schwingen, feine Zweige mit eingerollten Ranken, sichtbare Wurzelanläufe.
 *
 * Alles in Pixeln für eine gegebene Breite. Ein fester Startwert (seed) sorgt dafür, dass
 * jeder Kategorie-Baum ein bisschen anders aussieht, aber bei jedem Öffnen gleich bleibt.
 */

export type Punkt = { x: number; y: number };

export type Rune = { x: number; y: number; winkel: number; d: string };

export type BaumForm = {
  breite: number;
  hoehe: number;
  /** Mitte des Runenrings */
  mitte: Punkt;
  ringRadius: number;
  /** Erdboden (y) */
  boden: number;
  /** gefüllte Holzflächen: Stamm, Äste, Zweige, Wurzelanläufe */
  holz: string;
  /** feine eingerollte Ranken an den Zweigenden (Linien) */
  ranken: string;
  /** Rindenrillen am Stamm (Linien) */
  rinde: string;
  /** Schattenwurzeln unter der Erde (Linien) */
  schatten: string;
  moos: { x: number; y: number; rx: number; ry: number }[];
  /** hängender Moosbart am Stamm (Flächen) */
  bart: string;
  /** Spitze jedes Hauptasts – dort sitzt der Knopf der Gruppe */
  astSpitzen: Punkt[];
  sternPlaetze: Punkt[];
  /** Knopf der Schattenwurzeln */
  wurzelPlatz: Punkt;
  /** Astloch mit Augen – kleines verstecktes Detail */
  augen: Punkt;
  runen: Rune[];
};

/** kleiner Zufallsgenerator mit Startwert (mulberry32) */
function zufall(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Startwert aus einem Text, z. B. der Kategorie */
export function seedAus(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Kurve = [Punkt, Punkt, Punkt, Punkt];

function punktAuf([p0, p1, p2, p3]: Kurve, t: number): Punkt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function richtungAuf([p0, p1, p2, p3]: Kurve, t: number): Punkt {
  const u = 1 - t;
  const x = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const y = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}

/** Fläche entlang einer Kurve, die sich von w0 auf w1 verjüngt */
export function verjuengt(k: Kurve, w0: number, w1: number, schritte = 18): string {
  const links: Punkt[] = [];
  const rechts: Punkt[] = [];
  for (let i = 0; i <= schritte; i++) {
    const t = i / schritte;
    const p = punktAuf(k, t);
    const d = richtungAuf(k, t);
    const w = lerp(w0, w1, t) / 2;
    links.push({ x: p.x - d.y * w, y: p.y + d.x * w });
    rechts.push({ x: p.x + d.y * w, y: p.y - d.x * w });
  }
  const pfad = [...links, ...rechts.reverse()].map((p, i) => `${i ? 'L' : 'M'}${r1(p.x)} ${r1(p.y)}`);
  return pfad.join(' ') + ' Z';
}

const linie = ([p0, p1, p2, p3]: Kurve) =>
  `M${r1(p0.x)} ${r1(p0.y)} C${r1(p1.x)} ${r1(p1.y)} ${r1(p2.x)} ${r1(p2.y)} ${r1(p3.x)} ${r1(p3.y)}`;

/** eingerollte Ranke (Spirale) am Ende eines Zweigs */
export function ranke(p: Punkt, richtung: number, groesse: number, drehsinn: 1 | -1): string {
  let d = `M${r1(p.x)} ${r1(p.y)}`;
  let x = p.x;
  let y = p.y;
  let w = richtung;
  for (let i = 0; i < 9; i++) {
    const schritt = groesse * (1 - i / 11);
    w += drehsinn * 0.62;
    x += Math.cos(w) * schritt;
    y += Math.sin(w) * schritt;
    d += ` L${r1(x)} ${r1(y)}`;
  }
  return d;
}

/** Gerade von p aus in Richtung w (Bogenmaß) mit Länge l, als Kurve mit leichter Biegung nach oben */
export function zweigKurve(p: Punkt, w: number, l: number, biegung: number): Kurve {
  const ende = { x: p.x + Math.cos(w) * l, y: p.y + Math.sin(w) * l - biegung };
  return [
    p,
    { x: p.x + Math.cos(w) * l * 0.4, y: p.y + Math.sin(w) * l * 0.4 },
    { x: ende.x - Math.cos(w) * l * 0.25, y: ende.y - Math.sin(w) * l * 0.1 },
    ende,
  ];
}

/** zufällige, runenartige Zeichen aus wenigen Strichen (eigene Erfindung, keine echte Schrift) */
function runenZeichen(rnd: () => number, g: number): string {
  const teile: string[] = [];
  const P = (x: number, y: number) => `${r1(x * g)} ${r1(y * g)}`;
  if (rnd() < 0.75) teile.push(`M${P(0, -6)} L${P(0, 6)}`); // Stamm
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
  if (rnd() < 0.3) teile.push(`M${P(-1.2, -9)} L${P(1.2, -9)}`); // kleiner Akzent
  return teile.join(' ');
}

export function baumForm(breite: number, anzahlAeste: number, anzahlSterne: number, seed: number): BaumForm {
  const rnd = zufall(seed);
  const z = (a: number, b: number) => lerp(a, b, rnd());
  const W = breite;
  const hoehe = W * 1.1;
  const mitte = { x: W / 2, y: W * 0.56 };
  const ringRadius = W * 0.47;
  const boden = W * 0.8;
  const stammOben = { x: W / 2 + z(-3, 3), y: W * 0.5 };

  const holz: string[] = [];
  const ranken: string[] = [];
  const rinde: string[] = [];
  const schatten: string[] = [];
  const moos: BaumForm['moos'] = [];
  const bart: string[] = [];

  // --- Stamm: leicht gedreht, unten breit ---
  const stamm: Kurve = [
    { x: W / 2, y: boden + 2 },
    { x: W / 2 - W * 0.025, y: boden - W * 0.1 },
    { x: W / 2 + W * 0.02, y: stammOben.y + W * 0.1 },
    stammOben,
  ];
  holz.push(verjuengt(stamm, W * 0.085, W * 0.036, 24));
  // weiche Gabelung, damit die Äste ohne Kante aus dem Stamm wachsen
  holz.push(
    verjuengt(
      [
        { x: stammOben.x, y: stammOben.y + W * 0.07 },
        { x: stammOben.x, y: stammOben.y + W * 0.04 },
        { x: stammOben.x, y: stammOben.y },
        { x: stammOben.x, y: stammOben.y - W * 0.03 },
      ],
      W * 0.05,
      W * 0.02,
      8,
    ),
  );
  for (let i = 0; i < 5; i++) {
    const v = (i - 2) * W * 0.011 + z(-1, 1);
    rinde.push(
      linie([
        { x: W / 2 + v * 1.4, y: boden - W * 0.01 },
        { x: W / 2 + v - W * 0.02, y: boden - W * 0.1 },
        { x: W / 2 + v * 0.6 + W * 0.018, y: stammOben.y + W * 0.11 },
        { x: stammOben.x + v * 0.5, y: stammOben.y + W * z(0.03, 0.08) },
      ]),
    );
  }

  // --- Wurzelanläufe über der Erde ---
  for (const [s, weite, dicke] of [
    [-1, 0.17, 0.034],
    [1, 0.16, 0.034],
    [-1, 0.1, 0.026],
    [1, 0.11, 0.026],
  ] as const) {
    const start = { x: W / 2 + s * W * 0.02, y: boden - W * 0.05 };
    const ende = { x: W / 2 + s * W * (weite + z(-0.015, 0.015)), y: boden + W * z(0.008, 0.02) };
    holz.push(
      verjuengt(
        [start, { x: start.x + s * W * 0.03, y: boden - W * 0.005 }, { x: ende.x - s * W * 0.04, y: boden }, ende],
        W * dicke,
        W * 0.003,
      ),
    );
  }

  // --- Schattenwurzeln unter der Erde ---
  const wurzelPlatz = { x: W / 2, y: W * 0.915 };
  for (let i = 0; i < 9; i++) {
    const s = i % 2 ? 1 : -1;
    const weite = (Math.floor(i / 2) + 0.3) * W * 0.06;
    const start = { x: W / 2 + s * z(0, W * 0.025), y: boden + W * 0.004 };
    const ende = { x: W / 2 + s * weite + z(-6, 6), y: W * z(0.97, 1.07) };
    const k: Kurve = [
      start,
      { x: start.x + s * weite * z(0.5, 0.9), y: boden + W * z(0.02, 0.06) },
      { x: ende.x - s * weite * z(-0.2, 0.3), y: ende.y - W * z(0.05, 0.1) },
      ende,
    ];
    schatten.push(verjuengt(k, W * z(0.006, 0.014), W * 0.001, 14));
    // feine Seitenwurzel
    const q = punktAuf(k, z(0.4, 0.6));
    schatten.push(
      verjuengt(zweigKurve(q, Math.PI / 2 + s * z(0.3, 0.9), W * z(0.03, 0.06), -W * 0.01), W * 0.004, W * 0.0008, 6),
    );
  }

  // --- Moos: Polster am Stammfuß und ein hängender Bart wie bei einem uralten Baumhirten ---
  for (let i = 0; i < 9; i++) {
    const s = rnd() < 0.5 ? -1 : 1;
    moos.push({
      x: W / 2 + s * z(0, W * 0.05),
      y: boden - z(0, W * 0.05),
      rx: z(W * 0.012, W * 0.03),
      ry: z(W * 0.004, W * 0.008),
    });
  }
  for (let i = 0; i < 9; i++) {
    const x0 = W / 2 + (i - 4) * W * 0.0075 + z(-1.5, 1.5);
    const y0 = boden - W * z(0.19, 0.22);
    const l = W * z(0.04, 0.1);
    bart.push(
      verjuengt(
        [
          { x: x0, y: y0 },
          { x: x0 + z(-4, 4), y: y0 + l * 0.35 },
          { x: x0 + z(-5, 5), y: y0 + l * 0.7 },
          { x: x0 + z(-3, 3), y: y0 + l },
        ],
        W * z(0.006, 0.011),
        W * 0.0012,
        10,
      ),
    );
  }

  /** Seitenzweige entlang eines Asts – jeder gabelt sich und endet in eingerollten Ranken */
  function seitenzweige(k: Kurve, versatz: number, dicke: number) {
    [0.3, 0.46, 0.6, 0.73, 0.86].forEach((t0, j) => {
      const t = t0 + z(-0.03, 0.03);
      const p = punktAuf(k, t);
      const d = richtungAuf(k, t);
      const grund = Math.atan2(d.y, d.x);
      const seite = (j + versatz) % 2 ? 1 : -1;
      const w = grund + seite * z(0.5, 0.85);
      const l = W * z(0.07, 0.1) * (1 - t * 0.45);
      const zk = zweigKurve(p, w, l, W * 0.014);
      holz.push(verjuengt(zk, W * lerp(dicke, 0.007, t) * 0.55, W * 0.0018, 10));
      const ew = richtungAuf(zk, 1);
      ranken.push(ranke(zk[3], Math.atan2(ew.y, ew.x), W * 0.008, seite > 0 ? -1 : 1));
      // Gabel
      const q = punktAuf(zk, z(0.45, 0.6));
      const w2 = w - seite * z(0.55, 0.8);
      const nk = zweigKurve(q, w2, l * z(0.4, 0.55), W * 0.008);
      holz.push(verjuengt(nk, W * 0.0045, W * 0.0013, 6));
      ranken.push(ranke(nk[3], w2, W * 0.0058, seite > 0 ? 1 : -1));
    });
  }

  // --- Hauptäste: einer je Gruppe ---
  const N = Math.max(1, anzahlAeste);
  const spreizung = (Math.min(64, 22 + N * 10) * Math.PI) / 180;
  const astSpitzen: Punkt[] = [];
  for (let i = 0; i < N; i++) {
    const anteil = N === 1 ? 0 : lerp(-1, 1, i / (N - 1));
    const a = anteil * spreizung;
    const r = W * (N >= 4 && i % 2 ? 0.25 : 0.31);
    const spitze = { x: mitte.x + Math.sin(a) * r, y: mitte.y + W * 0.01 - Math.cos(a) * r };
    astSpitzen.push(spitze);
    const s = Math.sign(anteil);
    const start = { x: stammOben.x + s * W * 0.008, y: stammOben.y + Math.abs(anteil) * W * 0.09 };
    const k: Kurve = [
      start,
      { x: start.x + (spitze.x - start.x) * 0.55, y: start.y - W * 0.02 },
      { x: spitze.x - (spitze.x - start.x) * 0.05, y: spitze.y + (start.y - spitze.y) * 0.45 },
      spitze,
    ];
    const mittig = Math.abs(anteil) < 0.2;
    holz.push(verjuengt(k, W * (mittig ? 0.04 : 0.03), W * 0.007, 22));

    seitenzweige(k, i, mittig ? 0.04 : 0.03);

    // zwei Triebe über der Astspitze
    const dEnde = richtungAuf(k, 1);
    const wEnde = Math.atan2(dEnde.y, dEnde.x);
    for (const s2 of [-1, 1] as const) {
      const tk = zweigKurve(spitze, wEnde + s2 * 0.5, W * 0.045, W * 0.008);
      holz.push(verjuengt(tk, W * 0.006, W * 0.0015, 8));
      ranken.push(ranke(tk[3], wEnde + s2 * 0.5, W * 0.007, s2 > 0 ? -1 : 1));
    }
  }

  // --- Mitteltrieb bis unter die Sterne, wenn kein Ast genau in der Mitte steht ---
  if (N % 2 === 0) {
    const oben = { x: mitte.x + z(-2, 2), y: W * 0.24 };
    const k: Kurve = [
      { x: stammOben.x, y: stammOben.y + W * 0.02 },
      { x: stammOben.x + W * 0.01, y: W * 0.4 },
      { x: oben.x - W * 0.01, y: W * 0.3 },
      oben,
    ];
    holz.push(verjuengt(k, W * 0.032, W * 0.005, 20));
    seitenzweige(k, 1, 0.03);
    for (const s2 of [-1, 1] as const) {
      const tk = zweigKurve(oben, -Math.PI / 2 + s2 * 0.45, W * 0.04, W * 0.006);
      holz.push(verjuengt(tk, W * 0.005, W * 0.0013, 8));
      ranken.push(ranke(tk[3], -Math.PI / 2 + s2 * 0.45, W * 0.006, s2 > 0 ? -1 : 1));
    }
  }

  // --- Sterne auf einem Bogen über der Krone ---
  const sternPlaetze: Punkt[] = [];
  const sw = (Math.min(58, 14 * anzahlSterne) * Math.PI) / 180;
  for (let i = 0; i < anzahlSterne; i++) {
    const a = anzahlSterne === 1 ? 0 : lerp(-sw, sw, i / (anzahlSterne - 1));
    const r = W * 0.415;
    sternPlaetze.push({ x: mitte.x + Math.sin(a) * r, y: mitte.y - Math.cos(a) * r });
  }

  // --- Runenring, unten offen: dort brechen die Wurzeln hindurch ---
  const runen: Rune[] = [];
  const anzahlRunen = 44;
  const luecke = (26 * Math.PI) / 180;
  const g = W / 300;
  for (let k = 0; k < anzahlRunen; k++) {
    const phi = -Math.PI / 2 + (k / anzahlRunen) * Math.PI * 2;
    const vonUnten = Math.abs(((phi - Math.PI / 2 + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const d = runenZeichen(rnd, g);
    if (vonUnten < luecke) continue;
    runen.push({
      x: r1(mitte.x + Math.cos(phi) * ringRadius),
      y: r1(mitte.y + Math.sin(phi) * ringRadius),
      winkel: r1((phi * 180) / Math.PI + 90),
      d,
    });
  }

  return {
    breite: W,
    hoehe,
    mitte,
    ringRadius,
    boden,
    holz: holz.join(' '),
    ranken: ranken.join(' '),
    rinde: rinde.join(' '),
    schatten: schatten.join(' '),
    moos,
    bart: bart.join(' '),
    astSpitzen,
    sternPlaetze,
    wurzelPlatz,
    augen: { x: W / 2 - W * 0.004, y: boden - W * 0.245 },
    runen,
  };
}

/** Pfad eines Sterns mit `zacken` Spitzen um (cx, cy) */
export function sternPfad(cx: number, cy: number, aussen: number, innen: number, zacken = 7): string {
  const teile: string[] = [];
  for (let i = 0; i < zacken * 2; i++) {
    const r = i % 2 ? innen : aussen;
    const w = -Math.PI / 2 + (i * Math.PI) / zacken;
    teile.push(`${i ? 'L' : 'M'}${r1(cx + Math.cos(w) * r)} ${r1(cy + Math.sin(w) * r)}`);
  }
  return teile.join(' ') + ' Z';
}
