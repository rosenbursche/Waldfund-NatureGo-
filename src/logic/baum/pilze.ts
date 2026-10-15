/**
 * Pilze: Myzelbaum.
 * Ein dicker, faseriger Pilzstiel mit Knolle und Manschette; die Äste sind Stiele,
 * die in Hüten verschiedener Form enden (Kuppel, Schirm, Glocke, Trichter) – unter jedem Hut
 * sitzt der Knopf der Gruppe. Baumschwämme am Stamm, kleine Pilze am Boden,
 * leuchtende Myzelfäden im Erdreich.
 */
import { astMalen } from './ast';
import type { Gestalt, Leinwand, Rahmen } from './rahmen';
import type { StilErgebnis } from './stil';
import {
  ellipse,
  lerp,
  pilzHut,
  punktAuf,
  r1,
  winkelAuf,
  zweigKurve,
  zwischen,
  type HutForm,
  type Kurve,
  type Punkt,
  type Zufall,
} from './werkzeug';

export const GESTALT_PILZE: Gestalt = { spreizung: 62, lang: 0.3, kurz: 0.23, boden: 0.81 };

const FORMEN: HutForm[] = ['kuppel', 'schirm', 'glocke', 'trichter'];

export function pilzBaum(R: Rahmen, L: Leinwand, rnd: Zufall): StilErgebnis {
  const { W, boden } = R;
  const z = (a: number, b: number) => zwischen(rnd, a, b);
  const oben = { x: W / 2 + z(-2, 2), y: W * 0.47 };

  const hutMalen = (p: Punkt, b: number, form: HutForm) => {
    const h = pilzHut(p, b, form, rnd);
    // dunkle Unterseite, dann Hut, Lamellen, Tupfen, Leuchtpunkte am Rand
    L.flaeche('laubHinten', ellipse(p.x, p.y + b * 0.01, b * 0.46, b * 0.07), 0.9);
    L.flaeche('laub', h.hut);
    L.strich('ader', h.lamellen, Math.max(0.5, b * 0.012), 0.7);
    L.flaeche('akzentHell', h.tupfen, 0.9);
    // Lichtkante auf der Hutoberseite
    L.strich(
      'licht',
      `M${r1(p.x - b * 0.4)} ${r1(p.y - b * 0.12)} Q${r1(p.x - b * 0.3)} ${r1(p.y - b * 0.36)} ${r1(p.x - b * 0.05)} ${r1(p.y - b * 0.4)}`,
      Math.max(0.6, b * 0.02),
      form === 'kuppel' ? 0.55 : 0,
    );
    for (let i = 0; i < 4; i++) {
      const x = lerp(p.x - b * 0.4, p.x + b * 0.4, (i + 0.5) / 4);
      L.flaeche('leuchten', ellipse(x, p.y + b * 0.02, b * 0.018, b * 0.018), 0.9);
    }
  };

  const kleinerPilz = (fuss: Punkt, hoehe: number, b: number, neigung: number, form: HutForm) => {
    const kopf = { x: fuss.x + Math.sin(neigung) * hoehe, y: fuss.y - Math.cos(neigung) * hoehe };
    astMalen(
      L,
      [fuss, { x: fuss.x, y: fuss.y - hoehe * 0.4 }, { x: kopf.x, y: kopf.y + hoehe * 0.3 }, kopf],
      b * 0.28,
      b * 0.2,
      rnd,
      { schritte: 8 },
    );
    hutMalen(kopf, b, form);
  };

  // --- Myzel: leuchtende Fäden über und im Boden ---
  for (let i = 0; i < 12; i++) {
    const s = i % 2 ? 1 : -1;
    const l = W * z(0.12, 0.36);
    let x = W / 2 + s * W * 0.04;
    let y = boden + z(-2, 3);
    let d = `M${r1(x)} ${r1(y)}`;
    const ph = rnd() * 6;
    for (let j = 1; j <= 10; j++) {
      x += (s * l) / 10;
      y += Math.sin(j * 1.3 + ph) * 2.2 + z(-0.6, 1.4);
      d += ` L${r1(x)} ${r1(y)}`;
      if (rnd() < 0.25) L.strich('leuchten', `M${r1(x)} ${r1(y)} l${r1(s * z(4, 12))} ${r1(z(-6, 6))}`, 0.6, 0.6);
    }
    L.strich('leuchten', d, z(0.6, 1.2), 0.75);
  }

  // --- Stiel mit Knolle ---
  const stamm: Kurve = [
    { x: W / 2, y: boden - W * 0.045 },
    { x: W / 2 - W * 0.018, y: boden - W * 0.13 },
    { x: W / 2 + W * 0.015, y: oben.y + W * 0.12 },
    oben,
  ];
  L.flaeche('holz', ellipse(W / 2, boden - W * 0.03, W * 0.07, W * 0.045));
  L.flaeche('holzSchatten', ellipse(W / 2 + W * 0.02, boden - W * 0.025, W * 0.045, W * 0.035), 0.5);
  astMalen(L, stamm, W * 0.095, W * 0.06, rnd, { schritte: 24, rinde: 7, wellig: 0.05, schatten: 0.35 });
  // runder Abschluss oben, aus dem die Stiele wachsen
  L.flaeche('holz', ellipse(oben.x, oben.y, W * 0.032, W * 0.022));
  // Knollen-Saum (Scheide)
  L.strich(
    'ader',
    `M${r1(W / 2 - W * 0.07)} ${r1(boden - W * 0.04)} Q${r1(W / 2)} ${r1(boden - W * 0.075)} ${r1(W / 2 + W * 0.07)} ${r1(boden - W * 0.04)}`,
    1.3,
    0.7,
  );
  // Manschette (Ring) am oberen Stiel
  const ringY = oben.y + W * 0.08;
  const rb = W * 0.06;
  let saum = `M${r1(W / 2 - rb * 0.6)} ${r1(ringY - W * 0.01)} L${r1(W / 2 + rb * 0.6)} ${r1(ringY - W * 0.01)}`;
  saum += ` L${r1(W / 2 + rb)} ${r1(ringY + W * 0.03)}`;
  for (let i = 8; i >= 0; i--) {
    const x = lerp(W / 2 - rb, W / 2 + rb, i / 8);
    saum += ` L${r1(x)} ${r1(ringY + W * 0.03 + (i % 2 ? W * 0.008 : 0))}`;
  }
  L.flaeche('laubHell', saum + ' Z', 0.95);
  for (let i = 0; i < 7; i++) {
    const x = lerp(W / 2 - rb * 0.55, W / 2 + rb * 0.55, i / 6);
    L.strich(
      'ader',
      `M${r1(x)} ${r1(ringY - W * 0.006)} L${r1(x + (x - W / 2) * 0.6)} ${r1(ringY + W * 0.03)}`,
      0.6,
      0.6,
    );
  }

  // --- Baumschwämme am Stiel ---
  for (let i = 0; i < 4; i++) {
    const s = i % 2 ? 1 : -1;
    const t = lerp(0.18, 0.62, i / 3);
    const p = punktAuf(stamm, t);
    const breiteStamm = lerp(W * 0.095, W * 0.06, t) / 2;
    const x0 = p.x + s * breiteStamm * 0.8;
    const tiefe = W * z(0.045, 0.065);
    const hoehe = W * z(0.018, 0.026);
    const schwamm = `M${r1(x0)} ${r1(p.y - hoehe)} Q${r1(x0 + s * tiefe * 1.1)} ${r1(p.y - hoehe * 0.9)} ${r1(x0 + s * tiefe)} ${r1(p.y)} Q${r1(x0 + s * tiefe * 0.5)} ${r1(p.y + hoehe * 0.5)} ${r1(x0)} ${r1(p.y + hoehe * 0.2)} Z`;
    L.flaeche('laub', schwamm);
    for (let r = 1; r <= 3; r++) {
      const f = r / 4;
      L.strich(
        'ader',
        `M${r1(x0)} ${r1(p.y - hoehe * (1 - f * 0.6))} Q${r1(x0 + s * tiefe * (1.1 - f * 0.5))} ${r1(p.y - hoehe * (0.9 - f * 0.5))} ${r1(x0 + s * tiefe * (1 - f * 0.45))} ${r1(p.y - hoehe * f * 0.2)}`,
        0.7,
        0.65,
      );
    }
    L.strich(
      'akzentHell',
      `M${r1(x0 + s * tiefe * 0.15)} ${r1(p.y + hoehe * 0.2)} Q${r1(x0 + s * tiefe * 0.7)} ${r1(p.y + hoehe * 0.35)} ${r1(x0 + s * tiefe)} ${r1(p.y)}`,
      1.2,
      0.7,
    );
  }

  // --- Äste: Stiele mit Hüten ---
  R.astSpitzen.forEach((spitze, i) => {
    const anteil = R.astAnteile[i];
    const s = Math.sign(anteil);
    const start = { x: oben.x + s * W * 0.015, y: oben.y + Math.abs(anteil) * W * 0.06 };
    const hutUnten = { x: spitze.x, y: spitze.y - W * 0.045 };
    const k: Kurve = [
      start,
      { x: start.x + (spitze.x - start.x) * 0.5, y: start.y - W * 0.01 },
      { x: spitze.x, y: spitze.y + (start.y - spitze.y) * 0.3 },
      hutUnten,
    ];
    astMalen(L, k, W * 0.036, W * 0.018, rnd, { schritte: 22, rinde: 5, wellig: 0.05 });
    // kleine Pilze, die aus dem Stiel sprießen
    for (const t of [0.45, 0.7]) {
      if (rnd() < 0.3) continue;
      const p = punktAuf(k, t);
      const w = winkelAuf(k, t) - s * 0.9 - (s === 0 ? 0.9 : 0);
      const zk = zweigKurve(p, w, W * z(0.03, 0.045), W * 0.01);
      astMalen(L, zk, W * 0.008, W * 0.006, rnd, { schritte: 6 });
      hutMalen(zk[3], W * z(0.03, 0.042), FORMEN[Math.floor(rnd() * 3)]);
    }
    hutMalen(
      hutUnten,
      W * (Math.abs(anteil) < 0.2 ? 0.12 : 0.14 + (i % 2) * 0.02),
      FORMEN[(i + Math.floor(rnd() * 4)) % 4],
    );
  });

  // --- Pilzgruppe am Boden ---
  for (let i = 0; i < 9; i++) {
    const s = i % 2 ? 1 : -1;
    const x = W / 2 + s * z(W * 0.09, W * 0.3);
    kleinerPilz(
      { x, y: boden + z(0, 4) },
      W * z(0.025, 0.05),
      W * z(0.03, 0.05),
      z(-0.25, 0.25),
      FORMEN[Math.floor(rnd() * 3)],
    );
  }
  return {};
}
