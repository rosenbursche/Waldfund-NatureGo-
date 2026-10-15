/**
 * Zeichen-Werkzeuge für die Lebensbäume – reine Geometrie (SVG-Pfade als Text), ohne Zeichnen.
 * Alle Bäume werden aus denselben Bausteinen gebaut: verjüngte Äste mit Schattenseite,
 * Lichtkante und Rindenfurchen, dazu Blätter, Federn, Pilzhüte, Blüten …
 */

export type Punkt = { x: number; y: number };
export type Kurve = [Punkt, Punkt, Punkt, Punkt];
export type Zufall = () => number;

/** kleiner Zufallsgenerator mit Startwert (mulberry32) – gleicher Startwert, gleicher Baum */
export function zufall(seed: number): Zufall {
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

export const r1 = (n: number) => Math.round(n * 10) / 10;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const zwischen = (rnd: Zufall, a: number, b: number) => lerp(a, b, rnd());

export function punktAuf([p0, p1, p2, p3]: Kurve, t: number): Punkt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

export function richtungAuf([p0, p1, p2, p3]: Kurve, t: number): Punkt {
  const u = 1 - t;
  const x = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const y = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}

export const winkelAuf = (k: Kurve, t: number) => {
  const d = richtungAuf(k, t);
  return Math.atan2(d.y, d.x);
};

const zuPfad = (punkte: Punkt[], schliessen = false) =>
  punkte.map((p, i) => `${i ? 'L' : 'M'}${r1(p.x)} ${r1(p.y)}`).join(' ') + (schliessen ? ' Z' : '');

export const linie = ([p0, p1, p2, p3]: Kurve) =>
  `M${r1(p0.x)} ${r1(p0.y)} C${r1(p1.x)} ${r1(p1.y)} ${r1(p2.x)} ${r1(p2.y)} ${r1(p3.x)} ${r1(p3.y)}`;

/** sanftes "Rauschen" aus wenigen Sinuswellen – für knorrige Umrisse */
function welle(rnd: Zufall) {
  const f = [zwischen(rnd, 5, 9), zwischen(rnd, 11, 19), zwischen(rnd, 23, 37)];
  const ph = [rnd() * 6.3, rnd() * 6.3, rnd() * 6.3];
  return (t: number) =>
    Math.sin(t * f[0] + ph[0]) * 0.55 + Math.sin(t * f[1] + ph[1]) * 0.3 + Math.sin(t * f[2] + ph[2]) * 0.15;
}

/** Seitenvektor (senkrecht zur Kurve), immer zur rechten Bildseite bzw. nach unten zeigend */
function schattenNormale(d: Punkt): Punkt {
  const n = { x: -d.y, y: d.x };
  return n.x < -0.15 || (Math.abs(n.x) <= 0.15 && n.y < 0) ? { x: -n.x, y: -n.y } : n;
}

/**
 * Fläche entlang einer Kurve, die sich von w0 auf w1 verjüngt.
 * `rau` (0–0.4) macht den Umriss knorrig – für alte Eichen.
 */
export function verjuengt(k: Kurve, w0: number, w1: number, schritte = 18, rau = 0, rnd?: Zufall): string {
  const links: Punkt[] = [];
  const rechts: Punkt[] = [];
  const wl = rau && rnd ? welle(rnd) : null;
  const wr = rau && rnd ? welle(rnd) : null;
  for (let i = 0; i <= schritte; i++) {
    const t = i / schritte;
    const p = punktAuf(k, t);
    const d = richtungAuf(k, t);
    const w = lerp(w0, w1, t) / 2;
    const al = wl ? 1 + rau * wl(t) : 1;
    const ar = wr ? 1 + rau * wr(t) : 1;
    links.push({ x: p.x - d.y * w * al, y: p.y + d.x * w * al });
    rechts.push({ x: p.x + d.y * w * ar, y: p.y - d.x * w * ar });
  }
  return zuPfad([...links, ...rechts.reverse()], true);
}

/** Schattenseite eines Asts: Streifen auf der lichtabgewandten Seite (Licht kommt von links oben) */
export function schattenSeite(k: Kurve, w0: number, w1: number, schritte = 16, von = 0.05, bis = 0.95): string {
  const innen: Punkt[] = [];
  const aussen: Punkt[] = [];
  for (let i = 0; i <= schritte; i++) {
    const t = i / schritte;
    const p = punktAuf(k, t);
    const n = schattenNormale(richtungAuf(k, t));
    const w = lerp(w0, w1, t) / 2;
    innen.push({ x: p.x + n.x * w * von, y: p.y + n.y * w * von });
    aussen.push({ x: p.x + n.x * w * bis, y: p.y + n.y * w * bis });
  }
  return zuPfad([...innen, ...aussen.reverse()], true);
}

/** feine helle Kante auf der Lichtseite (Linie) */
export function lichtKante(k: Kurve, w0: number, w1: number, von = 0, bis = 0.85, schritte = 12): string {
  const p: Punkt[] = [];
  for (let i = 0; i <= schritte; i++) {
    const t = lerp(von, bis, i / schritte);
    const q = punktAuf(k, t);
    const n = schattenNormale(richtungAuf(k, t));
    const w = lerp(w0, w1, t) / 2;
    p.push({ x: q.x - n.x * w * 0.6, y: q.y - n.y * w * 0.6 });
  }
  return zuPfad(p);
}

/** Rindenfurchen: unregelmäßige Linien entlang des Asts */
export function rindenLinien(k: Kurve, w0: number, w1: number, anzahl: number, rnd: Zufall, wellig = 0.15): string {
  const teile: string[] = [];
  for (let j = 0; j < anzahl; j++) {
    const f = zwischen(rnd, -0.75, 0.75);
    const a = zwischen(rnd, 0, 0.55);
    const b = Math.min(1, a + zwischen(rnd, 0.15, 0.5));
    const ph = rnd() * 6;
    const p: Punkt[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = lerp(a, b, i / 8);
      const q = punktAuf(k, t);
      const d = richtungAuf(k, t);
      const w = lerp(w0, w1, t) / 2;
      const o = f + Math.sin(t * 20 + ph) * wellig;
      p.push({ x: q.x - d.y * w * o, y: q.y + d.x * w * o });
    }
    teile.push(zuPfad(p));
  }
  return teile.join(' ');
}

/** eingerollte Ranke (Spirale) am Ende eines Zweigs */
export function ranke(p: Punkt, richtung: number, groesse: number, drehsinn: 1 | -1): string {
  const pkt: Punkt[] = [p];
  let x = p.x;
  let y = p.y;
  let w = richtung;
  for (let i = 0; i < 9; i++) {
    const schritt = groesse * (1 - i / 11);
    w += drehsinn * 0.62;
    x += Math.cos(w) * schritt;
    y += Math.sin(w) * schritt;
    pkt.push({ x, y });
  }
  return zuPfad(pkt);
}

/** Kurve von p aus in Richtung w (Bogenmaß) mit Länge l, leicht nach oben gebogen */
export function zweigKurve(p: Punkt, w: number, l: number, biegung: number): Kurve {
  const ende = { x: p.x + Math.cos(w) * l, y: p.y + Math.sin(w) * l - biegung };
  return [
    p,
    { x: p.x + Math.cos(w) * l * 0.4, y: p.y + Math.sin(w) * l * 0.4 },
    { x: ende.x - Math.cos(w) * l * 0.25, y: ende.y - Math.sin(w) * l * 0.1 },
    ende,
  ];
}

/** Punkte einer Form drehen und verschieben */
function setzen(punkte: [number, number][], p: Punkt, w: number, s: number): Punkt[] {
  const c = Math.cos(w);
  const si = Math.sin(w);
  return punkte.map(([x, y]) => ({ x: p.x + (x * c - y * si) * s, y: p.y + (x * si + y * c) * s }));
}

/** Kreis/Ellipse als Pfad */
export function ellipse(cx: number, cy: number, rx: number, ry: number, w = 0): string {
  const p: [number, number][] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    p.push([Math.cos(a) * rx, Math.sin(a) * ry]);
  }
  return zuPfad(setzen(p, { x: cx, y: cy }, w, 1), true);
}

// ---------- Blattformen (Ansatz am Punkt p, zeigt in Richtung w, Länge l) ----------

/** schmales Mandelblatt (Weide/Silberlinde) */
export function mandelBlatt(p: Punkt, w: number, l: number): string {
  const q: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    q.push([t, Math.sin(t * Math.PI) * 0.22]);
  }
  for (let i = 8; i >= 0; i--) {
    const t = i / 8;
    q.push([t, -Math.sin(t * Math.PI) * 0.18]);
  }
  return zuPfad(setzen(q, p, w, l), true);
}

/** Eichenblatt mit gebuchteten Lappen */
export function eichenBlatt(p: Punkt, w: number, l: number): string {
  const q: [number, number][] = [[0, 0]];
  const lappen = 4;
  for (let i = 1; i <= lappen * 2; i++) {
    const t = i / (lappen * 2);
    const breit = Math.sin(Math.min(1, t * 1.15) * Math.PI) * 0.34 + 0.04;
    q.push([t, i % 2 ? breit : breit * 0.5]);
  }
  q.push([1.04, 0]);
  for (let i = lappen * 2; i >= 1; i--) {
    const t = i / (lappen * 2);
    const breit = Math.sin(Math.min(1, t * 1.15) * Math.PI) * 0.34 + 0.04;
    q.push([t, -(i % 2 ? breit : breit * 0.5)]);
  }
  return zuPfad(setzen(q, p, w, l), true);
}

/** Feder: Fahne als Fläche, dazu Kiel und Äste als Linien */
export function feder(p: Punkt, w: number, l: number): { fahne: string; kiel: string } {
  const q: [number, number][] = [[0.12, 0]];
  for (let i = 0; i <= 10; i++) {
    const t = 0.12 + (i / 10) * 0.88;
    q.push([t, Math.sin(((t - 0.12) / 0.88) * Math.PI) ** 0.7 * 0.17 + (i === 10 ? 0 : 0.01)]);
  }
  for (let i = 10; i >= 0; i--) {
    const t = 0.12 + (i / 10) * 0.88;
    q.push([t, -(Math.sin(((t - 0.12) / 0.88) * Math.PI) ** 0.7) * 0.13]);
  }
  const kielPunkte = setzen(
    [
      [0, 0],
      [1, 0],
    ],
    p,
    w,
    l,
  );
  const aeste: string[] = [zuPfad(kielPunkte)];
  for (let i = 1; i < 7; i++) {
    const t = 0.15 + i * 0.12;
    const b = Math.sin(((t - 0.12) / 0.88) * Math.PI) ** 0.7;
    aeste.push(
      zuPfad(
        setzen(
          [
            [t, 0],
            [t + 0.08, b * 0.16],
          ],
          p,
          w,
          l,
        ),
      ),
      zuPfad(
        setzen(
          [
            [t, 0],
            [t + 0.08, -b * 0.12],
          ],
          p,
          w,
          l,
        ),
      ),
    );
  }
  return { fahne: zuPfad(setzen(q, p, w, l), true), kiel: aeste.join(' ') };
}

/** fünfblättrige Blüte (Mitte als eigener Kreis) */
export function bluete(p: Punkt, r: number, w = 0): { blaetter: string; mitte: string } {
  const teile: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = w + (i / 5) * Math.PI * 2;
    teile.push(ellipse(p.x + Math.cos(a) * r * 0.62, p.y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.33, a));
  }
  return { blaetter: teile.join(' '), mitte: ellipse(p.x, p.y, r * 0.24, r * 0.24) };
}

/** Eichel: Frucht und Hütchen */
export function eichel(p: Punkt, g: number): { frucht: string; kappe: string } {
  return {
    frucht: ellipse(p.x, p.y + g * 0.55, g * 0.42, g * 0.62),
    kappe: `M${r1(p.x - g * 0.5)} ${r1(p.y + g * 0.15)} Q${r1(p.x)} ${r1(p.y - g * 0.45)} ${r1(p.x + g * 0.5)} ${r1(p.y + g * 0.15)} Z`,
  };
}

export type HutForm = 'kuppel' | 'schirm' | 'glocke' | 'trichter';

/**
 * Pilzhut über dem Punkt p (p = Hutunterseite Mitte), Breite b.
 * Liefert Hut, Lamellen (Linien) und Tupfen.
 */
export function pilzHut(
  p: Punkt,
  b: number,
  form: HutForm,
  rnd: Zufall,
): { hut: string; lamellen: string; tupfen: string } {
  const h = b / 2;
  let hut: string;
  if (form === 'kuppel')
    hut = `M${r1(p.x - h)} ${r1(p.y)} C${r1(p.x - h)} ${r1(p.y - b * 0.62)} ${r1(p.x + h)} ${r1(p.y - b * 0.62)} ${r1(p.x + h)} ${r1(p.y)} Q${r1(p.x)} ${r1(p.y + b * 0.08)} ${r1(p.x - h)} ${r1(p.y)} Z`;
  else if (form === 'schirm')
    hut = `M${r1(p.x - h * 1.15)} ${r1(p.y + b * 0.02)} Q${r1(p.x - h * 0.7)} ${r1(p.y - b * 0.3)} ${r1(p.x)} ${r1(p.y - b * 0.34)} Q${r1(p.x + h * 0.7)} ${r1(p.y - b * 0.3)} ${r1(p.x + h * 1.15)} ${r1(p.y + b * 0.02)} Q${r1(p.x)} ${r1(p.y - b * 0.06)} ${r1(p.x - h * 1.15)} ${r1(p.y + b * 0.02)} Z ${ellipse(p.x, p.y - b * 0.34, b * 0.08, b * 0.05)}`;
  else if (form === 'glocke')
    hut = `M${r1(p.x - h * 0.8)} ${r1(p.y + b * 0.04)} C${r1(p.x - h * 0.75)} ${r1(p.y - b * 0.5)} ${r1(p.x - h * 0.2)} ${r1(p.y - b * 0.8)} ${r1(p.x)} ${r1(p.y - b * 0.82)} C${r1(p.x + h * 0.2)} ${r1(p.y - b * 0.8)} ${r1(p.x + h * 0.75)} ${r1(p.y - b * 0.5)} ${r1(p.x + h * 0.8)} ${r1(p.y + b * 0.04)} Q${r1(p.x)} ${r1(p.y - b * 0.06)} ${r1(p.x - h * 0.8)} ${r1(p.y + b * 0.04)} Z`;
  else
    hut = `M${r1(p.x - h)} ${r1(p.y - b * 0.36)} Q${r1(p.x)} ${r1(p.y - b * 0.22)} ${r1(p.x + h)} ${r1(p.y - b * 0.36)} L${r1(p.x + b * 0.1)} ${r1(p.y)} L${r1(p.x - b * 0.1)} ${r1(p.y)} Z`;

  // Lamellen fächerförmig unter dem Hut
  const lam: string[] = [];
  const breiteUnten = form === 'glocke' ? h * 0.75 : form === 'trichter' ? h * 0.9 : h;
  const yUnten = form === 'trichter' ? p.y - b * 0.12 : p.y;
  for (let i = 0; i <= 8; i++) {
    const x = lerp(p.x - breiteUnten * 0.9, p.x + breiteUnten * 0.9, i / 8);
    lam.push(`M${r1(p.x + (x - p.x) * 0.15)} ${r1(yUnten + b * 0.03)} L${r1(x)} ${r1(yUnten - b * 0.01)}`);
  }
  // Tupfen auf dem Hut
  const tupfen: string[] = [];
  if (form !== 'trichter') {
    const n = 3 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const a = lerp(-2.6, -0.5, rnd());
      const rr = zwischen(rnd, 0.35, 0.8);
      const hoehe = form === 'glocke' ? b * 0.7 : form === 'kuppel' ? b * 0.45 : b * 0.28;
      tupfen.push(ellipse(p.x + Math.cos(a) * h * rr, p.y - b * 0.05 + Math.sin(a) * hoehe * rr, b * 0.035, b * 0.025));
    }
  }
  return { hut, lamellen: lam.join(' '), tupfen: tupfen.join(' ') };
}

/** kleiner sitzender Vogel (Silhouette) auf einem Zweig bei p, Blick nach links (s=1) oder rechts (s=-1) */
export function vogelSilhouette(p: Punkt, g: number, s: 1 | -1): string {
  const pkt: [number, number][] = [
    [0, 0],
    [-0.25, -0.05],
    [-0.45, -0.35],
    [-0.42, -0.6],
    [-0.62, -0.72],
    [-0.4, -0.78],
    [-0.28, -0.95],
    [-0.1, -0.9],
    [0.2, -0.55],
    [0.55, -0.35],
    [1.05, 0.05],
    [0.6, -0.1],
    [0.3, 0.02],
  ];
  return zuPfad(
    pkt.map(([x, y]) => ({ x: p.x + x * g * -s, y: p.y + y * g })),
    true,
  );
}

/** Pfad eines Sterns mit `zacken` Spitzen um (cx, cy) */
export function sternPfad(cx: number, cy: number, aussen: number, innen: number, zacken = 7): string {
  const teile: Punkt[] = [];
  for (let i = 0; i < zacken * 2; i++) {
    const r = i % 2 ? innen : aussen;
    const w = -Math.PI / 2 + (i * Math.PI) / zacken;
    teile.push({ x: cx + Math.cos(w) * r, y: cy + Math.sin(w) * r });
  }
  return zuPfad(teile, true);
}
