/**
 * Pflanzen: Silberner Blütenbaum.
 * Schlanker, geflochtener Stamm, Äste schwingen erst nach außen, dann nach oben,
 * feine Zweige mit eingerollten Ranken, silbergrünes Laub und weiße Blüten.
 * Am Boden blühen kleine Frühblüher.
 */
import { astMalen } from './ast';
import type { Gestalt, Leinwand, Rahmen } from './rahmen';
import type { StilErgebnis } from './stil';
import {
  bluete,
  lerp,
  mandelBlatt,
  punktAuf,
  r1,
  ranke,
  winkelAuf,
  zweigKurve,
  zwischen,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export const GESTALT_PFLANZEN: Gestalt = { spreizung: 64, lang: 0.31, kurz: 0.25, boden: 0.8 };

export function pflanzenBaum(R: Rahmen, L: Leinwand, rnd: Zufall): StilErgebnis {
  const { W, boden } = R;
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const oben = { x: W / 2 + z(-3, 3), y: W * 0.5 };

  // --- Stamm: drei umeinander gedrehte Stränge ---
  const stamm: Kurve = [
    { x: W / 2, y: boden + 2 },
    { x: W / 2 - W * 0.025, y: boden - W * 0.1 },
    { x: W / 2 + W * 0.02, y: oben.y + W * 0.1 },
    oben,
  ];
  astMalen(L, stamm, W * 0.085, W * 0.036, rnd, { schritte: 26 });
  for (let s = 0; s < 3; s++) {
    const ph = (s * Math.PI * 2) / 3;
    const furche: Punkt[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const p = punktAuf(stamm, t * 0.97);
      const w = lerp(W * 0.085, W * 0.036, t) / 2;
      furche.push({ x: p.x + Math.sin(t * Math.PI * 3.2 + ph) * w * 0.85, y: p.y });
    }
    const d = furche.map((p, i) => `${i ? 'L' : 'M'}${r1(p.x)} ${r1(p.y)}`).join(' ');
    L.strich('rinde', d, 1.6, 0.6);
    L.strich('licht', furche.map((p, i) => `${i ? 'L' : 'M'}${r1(p.x - 1.6)} ${r1(p.y)}`).join(' '), 0.8, 0.5);
  }
  // weiche Gabelung
  astMalen(
    L,
    [
      { x: oben.x, y: oben.y + W * 0.07 },
      { x: oben.x, y: oben.y + W * 0.04 },
      oben,
      { x: oben.x, y: oben.y - W * 0.03 },
    ],
    W * 0.05,
    W * 0.02,
    rnd,
    { schritte: 8 },
  );

  // --- Wurzelanläufe ---
  for (const [s, weite, dicke] of [
    [-1, 0.17, 0.034],
    [1, 0.16, 0.034],
    [-1, 0.1, 0.026],
    [1, 0.11, 0.026],
  ] as const) {
    const start = { x: W / 2 + s * W * 0.02, y: boden - W * 0.05 };
    const ende = { x: W / 2 + s * W * (weite + z(-0.015, 0.015)), y: boden + W * z(0.008, 0.02) };
    astMalen(
      L,
      [start, { x: start.x + s * W * 0.03, y: boden - W * 0.005 }, { x: ende.x - s * W * 0.04, y: boden }, ende],
      W * dicke,
      W * 0.003,
      rnd,
      { schritte: 12 },
    );
  }

  // --- Laub und Blüten ---
  const laubBuschel = (p: Punkt, richtung: number, g: number, mitBluete: boolean) => {
    const n = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const w = richtung + z(-1.3, 1.3);
      L.flaeche(rnd() < 0.35 ? 'laubHell' : 'laub', mandelBlatt(p, w, g * z(0.75, 1.15)), 0.95);
    }
    if (mitBluete) {
      const b = bluete({ x: p.x + z(-2, 2), y: p.y - g * 0.3 }, g * 0.42, rnd() * 3);
      L.flaeche('akzentHell', b.blaetter);
      L.flaeche('akzent', b.mitte);
    }
  };

  /** Seitenzweige mit Ranken, Laub und Blüten */
  const seitenzweige = (k: Kurve, versatz: number, dicke: number) => {
    [0.3, 0.46, 0.6, 0.73, 0.86].forEach((t0, j) => {
      const t = t0 + z(-0.03, 0.03);
      const p = punktAuf(k, t);
      const grund = winkelAuf(k, t);
      const seite = (j + versatz) % 2 ? 1 : -1;
      const w = grund + seite * z(0.5, 0.85);
      const l = W * z(0.07, 0.1) * (1 - t * 0.45);
      const zk = zweigKurve(p, w, l, W * 0.014);
      astMalen(L, zk, W * lerp(dicke, 0.007, t) * 0.55, W * 0.0018, rnd, { schritte: 10 });
      const wEnde = winkelAuf(zk, 1);
      L.strich('ranke', ranke(zk[3], wEnde, W * 0.008, seite > 0 ? -1 : 1), 1.3);
      laubBuschel(punktAuf(zk, 0.8), wEnde, W * 0.032, rnd() < 0.45);
      // Gabel mit eigenem Laub
      const q = punktAuf(zk, z(0.45, 0.6));
      const w2 = w - seite * z(0.55, 0.8);
      const nk = zweigKurve(q, w2, l * z(0.4, 0.55), W * 0.008);
      astMalen(L, nk, W * 0.0045, W * 0.0013, rnd, { schritte: 6 });
      L.strich('ranke', ranke(nk[3], w2, W * 0.0058, seite > 0 ? 1 : -1), 1.1);
      laubBuschel(nk[3], w2, W * 0.026, rnd() < 0.3);
    });
  };

  // --- Hauptäste ---
  R.astSpitzen.forEach((spitze, i) => {
    const anteil = R.astAnteile[i];
    const s = Math.sign(anteil);
    const start = { x: oben.x + s * W * 0.008, y: oben.y + Math.abs(anteil) * W * 0.09 };
    const k: Kurve = [
      start,
      { x: start.x + (spitze.x - start.x) * 0.55, y: start.y - W * 0.02 },
      { x: spitze.x - (spitze.x - start.x) * 0.05, y: spitze.y + (start.y - spitze.y) * 0.45 },
      spitze,
    ];
    const mittig = Math.abs(anteil) < 0.2;
    // Laubwolke hinter der Astspitze für eine volle Krone
    for (let j = 0; j < 22; j++) {
      const a = rnd() * Math.PI * 2;
      const r = W * Math.sqrt(rnd()) * 0.085;
      L.flaeche(
        'laubHinten',
        mandelBlatt({ x: spitze.x + Math.cos(a) * r, y: spitze.y + Math.sin(a) * r * 0.8 }, rnd() * 6.3, W * 0.04),
        0.5,
      );
    }
    astMalen(L, k, W * (mittig ? 0.04 : 0.03), W * 0.007, rnd, { schritte: 22, rinde: 2 });
    seitenzweige(k, i, mittig ? 0.04 : 0.03);
    const wEnde = winkelAuf(k, 1);
    for (const s2 of [-1, 1] as const) {
      const tk = zweigKurve(spitze, wEnde + s2 * 0.5, W * 0.045, W * 0.008);
      astMalen(L, tk, W * 0.006, W * 0.0015, rnd, { schritte: 8 });
      L.strich('ranke', ranke(tk[3], wEnde + s2 * 0.5, W * 0.007, s2 > 0 ? -1 : 1), 1.2);
    }
  });

  // --- Mitteltrieb, wenn kein Ast genau in der Mitte steht ---
  if (R.astSpitzen.length % 2 === 0) {
    const spitze = { x: R.mitte.x + z(-2, 2), y: W * 0.24 };
    const k: Kurve = [
      { x: oben.x, y: oben.y + W * 0.02 },
      { x: oben.x + W * 0.01, y: W * 0.4 },
      { x: spitze.x - W * 0.01, y: W * 0.3 },
      spitze,
    ];
    astMalen(L, k, W * 0.032, W * 0.005, rnd, { schritte: 20, rinde: 2 });
    seitenzweige(k, 1, 0.03);
    for (const s2 of [-1, 1] as const) {
      const tk = zweigKurve(spitze, -Math.PI / 2 + s2 * 0.45, W * 0.04, W * 0.006);
      astMalen(L, tk, W * 0.005, W * 0.0013, rnd, { schritte: 8 });
      L.strich('ranke', ranke(tk[3], -Math.PI / 2 + s2 * 0.45, W * 0.006, s2 > 0 ? -1 : 1), 1.2);
      laubBuschel(tk[3], -Math.PI / 2, W * 0.03, true);
    }
  }

  // --- Moos am Stammfuß und Frühblüher am Boden ---
  for (let i = 0; i < 9; i++) {
    const s = rnd() < 0.5 ? -1 : 1;
    L.flaeche(
      'moos',
      `M${r1(W / 2 + s * z(0, W * 0.05) - 8)} ${r1(boden - z(0, W * 0.04))} q8 -${r1(z(3, 7))} 16 0 z`,
      0.8,
    );
  }
  for (let i = 0; i < 16; i++) {
    const s = i % 2 ? 1 : -1;
    const x = W / 2 + s * z(W * 0.06, W * 0.3);
    const p = { x, y: boden + z(-2, 5) };
    // Grashalme
    for (let g = 0; g < 3; g++)
      L.flaeche('laub', mandelBlatt(p, -Math.PI / 2 + z(-0.5, 0.5), W * z(0.02, 0.035)), 0.75);
    if (rnd() < 0.5) {
      const stiel = { x: x + z(-3, 3), y: p.y - W * z(0.025, 0.04) };
      L.strich(
        'ranke',
        `M${r1(x)} ${r1(p.y)} Q${r1(x + 2)} ${r1((p.y + stiel.y) / 2)} ${r1(stiel.x)} ${r1(stiel.y)}`,
        0.8,
        0.8,
      );
      const b = bluete(stiel, W * 0.008, rnd() * 3);
      L.flaeche('akzentHell', b.blaetter, 0.9);
      L.flaeche('akzent', b.mitte);
    }
  }
  return {};
}
