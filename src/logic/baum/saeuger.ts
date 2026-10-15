/**
 * Säugetiere: Uralter Baumhirte.
 * Eine massige, knorrige Eiche mit tiefen Rindenfurchen und einem Gesicht im Stamm:
 * schwere Brauen, tief liegende Augen, lange Nase, Mundfalte und ein Bart aus Moos.
 * Krumme, ausladende Äste mit Eichenlaub und Eicheln, mächtige Wurzeln.
 */
import { astMalen } from './ast';
import type { Gestalt, Leinwand, Rahmen } from './rahmen';
import type { StilErgebnis } from './stil';
import {
  eichel,
  eichenBlatt,
  ellipse,
  lerp,
  punktAuf,
  r1,
  schattenSeite,
  verjuengt,
  winkelAuf,
  zweigKurve,
  zwischen,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export const GESTALT_SAEUGER: Gestalt = { spreizung: 68, lang: 0.3, kurz: 0.24, boden: 0.82 };

export function saeugerBaum(R: Rahmen, L: Leinwand, rnd: Zufall): StilErgebnis {
  const { W, boden } = R;
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const cx = W / 2;
  const oben = { x: cx + z(-3, 3), y: W * 0.5 };

  const laubBuschel = (p: Punkt, richtung: number, g: number, n: number, eicheln: boolean) => {
    for (let i = 0; i < n; i++) {
      const w = richtung + z(-1.5, 1.5);
      L.flaeche(rnd() < 0.3 ? 'laubHell' : 'laub', eichenBlatt(p, w, g * z(0.8, 1.2)));
      if (rnd() < 0.5)
        L.strich('ader', `M${r1(p.x)} ${r1(p.y)} l${r1(Math.cos(w) * g * 0.8)} ${r1(Math.sin(w) * g * 0.8)}`, 0.5, 0.5);
    }
    if (eicheln) {
      for (let i = 0; i < 2; i++) {
        const e = eichel({ x: p.x + z(-g * 0.4, g * 0.4), y: p.y + z(0, g * 0.3) }, g * 0.28);
        L.flaeche('akzent', e.frucht);
        L.flaeche('holzSchatten', e.kappe, 0.95);
      }
    }
  };

  // --- Mächtige Wurzeln ---
  for (let i = 0; i < 7; i++) {
    const s = i % 2 ? 1 : -1;
    const weite = W * (0.08 + Math.floor(i / 2) * 0.07 + z(0, 0.03));
    const start = { x: cx + s * W * z(0.02, 0.05), y: boden - W * z(0.06, 0.1) };
    const ende = { x: cx + s * weite, y: boden + W * z(0.01, 0.025) };
    astMalen(
      L,
      [
        start,
        { x: start.x + s * W * 0.04, y: boden - W * 0.02 },
        { x: ende.x - s * W * 0.05, y: boden - W * 0.005 },
        ende,
      ],
      W * z(0.04, 0.06),
      W * 0.004,
      rnd,
      { schritte: 14, rau: 0.15, rinde: 2 },
    );
  }

  // --- Stamm: breit, knorrig, tiefe Furchen ---
  const stamm: Kurve = [
    { x: cx, y: boden + 2 },
    { x: cx - W * 0.03, y: boden - W * 0.12 },
    { x: cx + W * 0.025, y: oben.y + W * 0.12 },
    oben,
  ];
  astMalen(L, stamm, W * 0.2, W * 0.1, rnd, { schritte: 30, rau: 0.1, rinde: 16, wellig: 0.3, schatten: 0.6 });

  // --- Gesicht ---
  const fy = boden - W * 0.215;
  const augenAbstand = W * 0.03;
  // Augenhöhlen
  for (const s of [-1, 1]) {
    L.flaeche('dunkel', ellipse(cx + s * augenAbstand, fy, W * 0.02, W * 0.011, s * 0.12), 0.85);
    // Falten um die Augen
    for (let f = 0; f < 3; f++) {
      const y = fy + W * (0.014 + f * 0.007);
      L.strich(
        'rinde',
        `M${r1(cx + s * (augenAbstand - W * 0.022))} ${r1(y)} Q${r1(cx + s * augenAbstand)} ${r1(y + W * 0.006)} ${r1(cx + s * (augenAbstand + W * 0.024))} ${r1(y - W * 0.004)}`,
        0.8,
        0.6,
      );
    }
    // schwere Braue
    const braue: Kurve = [
      { x: cx + s * W * 0.006, y: fy - W * 0.022 },
      { x: cx + s * W * 0.02, y: fy - W * 0.032 },
      { x: cx + s * W * 0.045, y: fy - W * 0.028 },
      { x: cx + s * W * 0.06, y: fy - W * 0.012 },
    ];
    L.flaeche('holz', verjuengt(braue, W * 0.018, W * 0.007, 10, 0.2, rnd));
    L.flaeche('holzSchatten', schattenSeite(braue, W * 0.018, W * 0.007, 10), 0.5);
    L.strich(
      'licht',
      `M${r1(braue[0].x)} ${r1(braue[0].y - W * 0.006)} Q${r1(braue[1].x)} ${r1(braue[1].y - W * 0.006)} ${r1(braue[2].x)} ${r1(braue[2].y - W * 0.004)}`,
      1,
      0.55,
    );
    // Moosbüschel auf den Brauen
    for (let m = 0; m < 4; m++) {
      const p = punktAuf(braue, z(0.1, 0.9));
      L.flaeche('moos', ellipse(p.x, p.y - W * 0.008, W * z(0.006, 0.01), W * 0.004), 0.9);
    }
  }
  // Nase: langer, knorriger Grat
  const nase: Kurve = [
    { x: cx, y: fy - W * 0.012 },
    { x: cx + W * 0.002, y: fy + W * 0.02 },
    { x: cx + W * 0.008, y: fy + W * 0.045 },
    { x: cx + W * 0.004, y: fy + W * 0.066 },
  ];
  L.flaeche('holz', verjuengt(nase, W * 0.014, W * 0.024, 10, 0.15, rnd));
  L.flaeche('holzSchatten', schattenSeite(nase, W * 0.014, W * 0.024, 10), 0.7);
  L.strich(
    'licht',
    `M${r1(cx - W * 0.004)} ${r1(fy)} Q${r1(cx - W * 0.003)} ${r1(fy + W * 0.035)} ${r1(cx - W * 0.006)} ${r1(fy + W * 0.06)}`,
    1.1,
    0.7,
  );
  L.flaeche('dunkel', ellipse(cx - W * 0.006, fy + W * 0.07, W * 0.005, W * 0.003), 0.7);
  L.flaeche('dunkel', ellipse(cx + W * 0.012, fy + W * 0.069, W * 0.005, W * 0.003), 0.7);
  // Mundfalte
  L.strich(
    'dunkel',
    `M${r1(cx - W * 0.03)} ${r1(fy + W * 0.083)} Q${r1(cx)} ${r1(fy + W * 0.098)} ${r1(cx + W * 0.032)} ${r1(fy + W * 0.08)}`,
    2,
    0.75,
  );
  // Bart aus Moos
  for (let i = 0; i < 22; i++) {
    const x0 = cx + (i - 10.5) * W * 0.0042 + z(-1, 1);
    const y0 = fy + W * 0.088 + Math.abs(i - 10.5) * W * -0.0012;
    const l = W * z(0.06, 0.15) * (1 - Math.abs(i - 10.5) / 16);
    L.flaeche(
      'moos',
      verjuengt(
        [
          { x: x0, y: y0 },
          { x: x0 + z(-5, 5), y: y0 + l * 0.35 },
          { x: x0 + z(-6, 6), y: y0 + l * 0.7 },
          { x: x0 + z(-4, 4), y: y0 + l },
        ],
        W * z(0.007, 0.012),
        W * 0.0012,
        10,
      ),
      0.92,
    );
  }

  // --- Krumme Äste ---
  R.astSpitzen.forEach((spitze, i) => {
    const anteil = R.astAnteile[i];
    const s = Math.sign(anteil) || (i % 2 ? 1 : -1);
    const start = { x: oben.x + s * W * 0.025, y: oben.y + Math.abs(anteil) * W * 0.06 };
    // Knie: erst weit nach außen, dann geknickt nach oben
    const knie = {
      x: lerp(start.x, spitze.x, 0.55) + s * W * z(0.02, 0.05),
      y: lerp(start.y, spitze.y, 0.35) + W * z(-0.01, 0.02),
    };
    const k1: Kurve = [
      start,
      { x: lerp(start.x, knie.x, 0.5), y: start.y - W * 0.015 },
      { x: knie.x - s * W * 0.02, y: knie.y + W * 0.01 },
      knie,
    ];
    const k2: Kurve = [
      knie,
      { x: knie.x + s * W * 0.015, y: knie.y - W * 0.03 },
      { x: spitze.x - s * W * 0.02, y: spitze.y + W * 0.05 },
      spitze,
    ];
    // dunkle Laubmasse hinter der Krone
    for (let j = 0; j < 16; j++) {
      const a = rnd() * Math.PI * 2;
      const r = W * Math.sqrt(rnd()) * 0.1;
      L.flaeche(
        'laubHinten',
        eichenBlatt({ x: spitze.x + Math.cos(a) * r, y: spitze.y + Math.sin(a) * r * 0.75 }, rnd() * 6.3, W * 0.05),
        0.6,
      );
    }
    astMalen(L, k1, W * 0.075, W * 0.045, rnd, { schritte: 16, rau: 0.14, rinde: 6, wellig: 0.25 });
    astMalen(L, k2, W * 0.045, W * 0.014, rnd, { schritte: 16, rau: 0.14, rinde: 4, wellig: 0.25 });
    // Moospolster auf der Oberseite
    for (let m = 0; m < 5; m++) {
      const p = punktAuf(k1, z(0.1, 0.9));
      L.flaeche(
        'moos',
        ellipse(p.x, p.y - W * 0.017, W * z(0.01, 0.02), W * z(0.004, 0.007), winkelAuf(k1, 0.5)),
        0.85,
      );
    }
    // krumme Seitenäste mit Laub
    [
      [k1, 0.7],
      [k2, 0.3],
      [k2, 0.6],
      [k2, 0.85],
    ].forEach(([k, t], j) => {
      const kk = k as Kurve;
      const p = punktAuf(kk, t as number);
      const seite = (j + i) % 2 ? 1 : -1;
      const w = winkelAuf(kk, t as number) + seite * z(0.5, 0.95);
      const l = W * z(0.06, 0.09);
      const mitte = zweigKurve(p, w, l * 0.5, W * 0.004);
      const ende = zweigKurve(mitte[3], w - seite * z(0.3, 0.6), l * 0.55, W * 0.006);
      astMalen(L, mitte, W * 0.016, W * 0.009, rnd, { schritte: 8, rau: 0.1 });
      astMalen(L, ende, W * 0.009, W * 0.003, rnd, { schritte: 8 });
      laubBuschel(ende[3], winkelAuf(ende, 1), W * 0.04, 5 + Math.floor(rnd() * 3), rnd() < 0.5);
      laubBuschel(mitte[3], w + seite * 1.2, W * 0.032, 3, false);
    });
    // Laub um die Astspitze
    laubBuschel(spitze, -Math.PI / 2, W * 0.042, 6, true);
  });

  // --- Moos und Farn am Fuß ---
  for (let i = 0; i < 14; i++) {
    const s = rnd() < 0.5 ? -1 : 1;
    L.flaeche(
      'moos',
      ellipse(cx + s * z(0, W * 0.11), boden - z(0, W * 0.05), W * z(0.012, 0.03), W * z(0.004, 0.009)),
      0.85,
    );
  }
  for (let i = 0; i < 8; i++) {
    const s = i % 2 ? 1 : -1;
    const p = { x: cx + s * z(W * 0.16, W * 0.32), y: boden + z(0, 4) };
    const w = -Math.PI / 2 + s * z(0.2, 0.7);
    const l = W * z(0.05, 0.08);
    L.strich(
      'ranke',
      `M${r1(p.x)} ${r1(p.y)} q${r1(Math.cos(w) * l * 0.5)} ${r1(Math.sin(w) * l * 0.6)} ${r1(Math.cos(w) * l)} ${r1(Math.sin(w) * l)}`,
      1,
      0.8,
    );
    for (let f = 1; f < 8; f++) {
      const q = { x: p.x + Math.cos(w) * l * (f / 8), y: p.y + Math.sin(w) * l * (f / 8) };
      for (const fs of [-1, 1]) {
        L.flaeche(
          'laub',
          ellipse(
            q.x + Math.cos(w + fs * 1.2) * W * 0.008,
            q.y + Math.sin(w + fs * 1.2) * W * 0.008,
            W * 0.009 * (1 - f / 10),
            W * 0.003,
            w + fs * 1.2,
          ),
          0.8,
        );
      }
    }
  }

  return { augen: { punkt: { x: cx, y: fy }, abstand: augenAbstand, groesse: W * 0.0075 } };
}
