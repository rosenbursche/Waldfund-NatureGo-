/**
 * Vögel: Federbaum im Wind.
 * Schlanker, heller Stamm mit Birkenzeichnung, Äste vom Wind nach rechts gebogen,
 * Federn statt Blätter, ein Nest mit Eiern und Vögel, die auf den Zweigen sitzen.
 */
import { astMalen } from './ast';
import type { Gestalt, Leinwand, Rahmen } from './rahmen';
import type { StilErgebnis } from './stil';
import {
  ellipse,
  feder,
  lerp,
  mandelBlatt,
  punktAuf,
  r1,
  richtungAuf,
  vogelSilhouette,
  winkelAuf,
  zweigKurve,
  zwischen,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export const GESTALT_VOEGEL: Gestalt = { spreizung: 56, lang: 0.32, kurz: 0.25, boden: 0.8 };

/** Wind schiebt alles leicht nach rechts */
const WIND = 0.35;

export function vogelBaum(R: Rahmen, L: Leinwand, rnd: Zufall): StilErgebnis {
  const { W, boden } = R;
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const oben = { x: W / 2 + W * 0.025, y: W * 0.5 };

  /** Birkenzeichnung: dunkle Querstriche auf hellem Holz */
  const birke = (k: Kurve, w0: number, w1: number, anzahl: number) => {
    for (let i = 0; i < anzahl; i++) {
      const t = rnd();
      const p = punktAuf(k, t);
      const d = richtungAuf(k, t);
      const w = lerp(w0, w1, t);
      const f = z(-0.3, 0.3);
      const c = { x: p.x - d.y * w * f, y: p.y + d.x * w * f };
      L.flaeche(
        'dunkel',
        ellipse(c.x, c.y, w * z(0.12, 0.32), Math.max(0.6, w * 0.035), Math.atan2(d.y, d.x) + Math.PI / 2),
        0.75,
      );
    }
  };

  const federn = (p: Punkt, richtung: number, l: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const w = lerp(richtung, 0, WIND * 0.6) + z(-0.5, 0.5);
      const f = feder(p, w, l * z(0.8, 1.15));
      L.flaeche(rnd() < 0.4 ? 'laubHell' : 'laub', f.fahne, 0.95);
      L.strich('ader', f.kiel, 0.6, 0.7);
    }
  };

  // --- Stamm ---
  const stamm: Kurve = [
    { x: W / 2, y: boden + 2 },
    { x: W / 2 - W * 0.012, y: boden - W * 0.12 },
    { x: W / 2 + W * 0.035, y: oben.y + W * 0.12 },
    oben,
  ];
  astMalen(L, stamm, W * 0.064, W * 0.03, rnd, { schritte: 26, rinde: 3 });
  birke(stamm, W * 0.064, W * 0.03, 34);
  // dunkle, rissige Borke am Stammfuß (wie bei alten Birken)
  for (let i = 0; i < 6; i++) {
    const p = punktAuf(stamm, z(0, 0.15));
    L.flaeche('dunkel', ellipse(p.x + z(-W * 0.02, W * 0.02), p.y, W * z(0.006, 0.014), W * z(0.012, 0.025)), 0.7);
  }

  // --- Wurzelanläufe ---
  for (const [s, weite] of [
    [-1, 0.13],
    [1, 0.12],
    [-1, 0.07],
    [1, 0.08],
  ] as const) {
    const start = { x: W / 2 + s * W * 0.015, y: boden - W * 0.035 };
    const ende = { x: W / 2 + s * W * weite, y: boden + W * 0.012 };
    astMalen(
      L,
      [start, { x: start.x + s * W * 0.025, y: boden - W * 0.004 }, { x: ende.x - s * W * 0.03, y: boden }, ende],
      W * 0.022,
      W * 0.002,
      rnd,
      { schritte: 10 },
    );
  }

  // --- Äste ---
  const sitzplaetze: { p: Punkt; s: 1 | -1 }[] = [];
  R.astSpitzen.forEach((spitze, i) => {
    const anteil = R.astAnteile[i];
    const s = Math.sign(anteil);
    const start = { x: oben.x + s * W * 0.006, y: oben.y + Math.abs(anteil) * W * 0.1 };
    const k: Kurve = [
      start,
      { x: start.x + (spitze.x - start.x) * 0.45 + W * 0.03 * WIND, y: start.y - W * 0.04 },
      { x: spitze.x + W * 0.04 * WIND, y: spitze.y + (start.y - spitze.y) * 0.5 },
      spitze,
    ];
    // Federwolke hinter der Spitze
    for (let j = 0; j < 9; j++) {
      const a = rnd() * Math.PI * 2;
      const r = W * Math.sqrt(rnd()) * 0.07;
      L.flaeche(
        'laubHinten',
        feder({ x: spitze.x + Math.cos(a) * r, y: spitze.y + Math.sin(a) * r }, rnd() * 6.3, W * 0.06).fahne,
        0.45,
      );
    }
    astMalen(L, k, W * 0.026, W * 0.006, rnd, { schritte: 22, rinde: 1 });
    birke(k, W * 0.026, W * 0.006, 10);
    // Seitenzweige mit Federn
    [0.32, 0.5, 0.66, 0.82].forEach((t0, j) => {
      const t = t0 + z(-0.03, 0.03);
      const p = punktAuf(k, t);
      const seite = (j + i) % 2 ? 1 : -1;
      const w = winkelAuf(k, t) + seite * z(0.55, 0.9);
      const zk = zweigKurve(p, w, W * z(0.06, 0.09) * (1 - t * 0.4), W * 0.006);
      astMalen(L, zk, W * 0.008, W * 0.0018, rnd, { schritte: 8 });
      federn(zk[3], winkelAuf(zk, 1), W * 0.055, 2 + Math.floor(rnd() * 2));
      if (j === 1 || j === 2) sitzplaetze.push({ p: punktAuf(zk, 0.55), s: seite > 0 ? -1 : 1 });
    });
    // Federkrone über der Astspitze
    for (const a of [-0.55, -0.15, 0.25]) federn(spitze, -Math.PI / 2 + a + s * 0.15, W * 0.07, 1);

    // Nest im ersten Ast
    if (i === 0) {
      const p = punktAuf(k, 0.52);
      const b = W * 0.06;
      L.flaeche('akzentHell', ellipse(p.x - b * 0.18, p.y - b * 0.22, b * 0.13, b * 0.17, -0.3));
      L.flaeche('akzentHell', ellipse(p.x + b * 0.05, p.y - b * 0.26, b * 0.13, b * 0.17, 0.1));
      L.flaeche('akzentHell', ellipse(p.x + b * 0.27, p.y - b * 0.2, b * 0.12, b * 0.16, 0.4));
      L.flaeche(
        'holzSchatten',
        `M${r1(p.x - b * 0.55)} ${r1(p.y - b * 0.2)} Q${r1(p.x)} ${r1(p.y + b * 0.55)} ${r1(p.x + b * 0.55)} ${r1(p.y - b * 0.2)} Q${r1(p.x)} ${r1(p.y - b * 0.05)} ${r1(p.x - b * 0.55)} ${r1(p.y - b * 0.2)} Z`,
      );
      for (let n = 0; n < 9; n++) {
        const y = p.y - b * 0.15 + n * b * 0.05;
        const breite = b * 0.55 * Math.sqrt(1 - ((n * 0.05) / 0.4) ** 2);
        L.strich(
          'rinde',
          `M${r1(p.x - breite)} ${r1(y + z(-2, 2))} Q${r1(p.x)} ${r1(y + b * 0.08)} ${r1(p.x + breite)} ${r1(y + z(-2, 2))}`,
          0.8,
          0.8,
        );
      }
      for (let n = 0; n < 4; n++) {
        const a = z(-0.6, 0.6);
        L.strich(
          'ranke',
          `M${r1(p.x + z(-b * 0.5, b * 0.5))} ${r1(p.y - b * 0.15)} l${r1(Math.cos(a) * b * 0.4)} ${r1(Math.sin(a) * b * 0.2)}`,
          0.7,
          0.7,
        );
      }
    }
  });

  // --- Vögel auf den Zweigen ---
  const anzahlVoegel = Math.min(3, sitzplaetze.length);
  for (let i = 0; i < anzahlVoegel; i++) {
    const { p, s } = sitzplaetze[Math.floor((i * sitzplaetze.length) / anzahlVoegel + 1) % sitzplaetze.length];
    L.flaeche('dunkel', vogelSilhouette(p, W * z(0.028, 0.036), s));
  }

  // --- Gras am Boden, ein paar gefallene Federn ---
  for (let i = 0; i < 26; i++) {
    const s = i % 2 ? 1 : -1;
    const p = { x: W / 2 + s * z(W * 0.04, W * 0.32), y: boden + z(-1, 5) };
    L.flaeche('laub', mandelBlatt(p, -Math.PI / 2 + z(-0.4, 0.6), W * z(0.02, 0.04)), 0.6);
  }
  for (let i = 0; i < 3; i++) {
    const f = feder(
      { x: W / 2 + z(-W * 0.25, W * 0.25), y: boden + z(2, 6) },
      z(-0.3, 0.3) + (rnd() < 0.5 ? Math.PI : 0),
      W * 0.05,
    );
    L.flaeche('laubHell', f.fahne, 0.85);
    L.strich('ader', f.kiel, 0.5, 0.6);
  }
  return {};
}
