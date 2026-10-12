import * as THREE from 'three';

/**
 * Blatt- und Nadeltexturen, im Code gemalt (keine Bilddateien, funktioniert offline).
 * Weiß/Grau mit Durchsichtigkeit – die Farbe kommt vom Material, so lassen sich
 * Jahreszeiten und Silhouetten (nicht gefundene Arten) mit derselben Textur zeigen.
 *
 * - laub:   Zweigstück mit mehreren ovalen Blättern und Mittelrippe (Buche, Eiche, Ahorn …)
 * - birke:  kleine, rautenförmige Blätter an einem hängenden Zweiglein
 * - nadel:  Fichten-/Tannenzweig mit kurzen Nadeln zu beiden Seiten
 * - kiefer: Büschel langer Nadeln, fächerförmig
 * - fernbaum: ganze Fichte als Umriss mit hängenden Ästen (für den Wald am Horizont)
 */
export type BlattArt = 'laub' | 'birke' | 'nadel' | 'kiefer' | 'fernbaum';

const N = 128;
const cache = new Map<BlattArt, THREE.DataTexture>();

/** Abstand eines Punktes zu einer Strecke (für Zweige, Rippen und Nadeln) */
function abstandZuStrecke(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

type Blatt = { x: number; y: number; w: number; laenge: number; breite: number; spitz: number };
type Strich = { ax: number; ay: number; bx: number; by: number; dicke: number; hell: number };

/** Malt Blätter (Ellipsen mit Rippe) und Striche (Zweige, Nadeln) in ein Graustufenbild mit Alpha */
function malen(blaetter: Blatt[], striche: Strich[]): THREE.DataTexture {
  const daten = new Uint8Array(N * N * 4);
  for (let py = 0; py < N; py++) {
    for (let px = 0; px < N; px++) {
      const x = (px + 0.5) / N;
      // DataTexture: Zeile 0 liegt unten (v = 0) – deshalb y direkt aus der Zeile, ohne Umdrehen
      const y = (py + 0.5) / N;
      let hell = -1;
      for (const s of striche) {
        // schneller Vortest: liegt der Punkt überhaupt in der Nähe der Strecke?
        if (x < Math.min(s.ax, s.bx) - s.dicke || x > Math.max(s.ax, s.bx) + s.dicke) continue;
        if (y < Math.min(s.ay, s.by) - s.dicke || y > Math.max(s.ay, s.by) + s.dicke) continue;
        if (abstandZuStrecke(x, y, s.ax, s.ay, s.bx, s.by) < s.dicke) hell = Math.max(hell, s.hell);
      }
      for (const b of blaetter) {
        // in das Blatt-Koordinatensystem drehen: u entlang, v quer
        const dx = x - b.x;
        const dy = y - b.y;
        const u = dx * Math.cos(b.w) + dy * Math.sin(b.w);
        const v = -dx * Math.sin(b.w) + dy * Math.cos(b.w);
        if (u < 0 || u > b.laenge) continue;
        // Blattumriss: breiteste Stelle bei ~40 %, zur Spitze spitz zulaufend
        const t = u / b.laenge;
        const halb = b.breite * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), b.spitz);
        if (Math.abs(v) > halb) continue;
        // Mittelrippe dunkler, Rand etwas heller, Seitennerven angedeutet
        const rippe = Math.abs(v) < 0.006 ? 0.72 : 1;
        const nerv = Math.abs(Math.sin((u * 60 - Math.abs(v) * 40) * 1.0)) < 0.12 ? 0.9 : 1;
        const rand = 0.86 + 0.14 * (Math.abs(v) / (halb || 1));
        hell = Math.max(hell, Math.min(1, rippe * nerv * rand));
      }
      const i = (py * N + px) * 4;
      if (hell < 0) {
        daten[i + 3] = 0;
        continue;
      }
      const g = Math.round(hell * 255);
      daten[i] = g;
      daten[i + 1] = g;
      daten[i + 2] = g;
      daten[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(daten, N, N, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

/** fester Zufall, damit die Texturen immer gleich aussehen */
function folge(saat: number) {
  let s = saat;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function laubBild() {
  const r = folge(11);
  const blaetter: Blatt[] = [];
  const striche: Strich[] = [{ ax: 0.5, ay: 0.02, bx: 0.52, by: 0.8, dicke: 0.012, hell: 0.45 }];
  // Blätter wechselständig am Zweig, nach außen gerichtet
  for (let i = 0; i < 7; i++) {
    const y = 0.12 + i * 0.105;
    const seite = i % 2 === 0 ? 1 : -1;
    const w = Math.PI / 2 - seite * (0.75 + r() * 0.35);
    blaetter.push({ x: 0.5 + seite * 0.01, y, w, laenge: 0.3 - i * 0.012, breite: 0.085, spitz: 0.9 });
  }
  blaetter.push({ x: 0.52, y: 0.78, w: Math.PI / 2, laenge: 0.2, breite: 0.07, spitz: 0.9 });
  return malen(blaetter, striche);
}

function birkeBild() {
  const blaetter: Blatt[] = [];
  const striche: Strich[] = [];
  // drei hängende Zweiglein mit kleinen Rautenblättern
  for (const [x0, laenge] of [
    [0.3, 0.85],
    [0.52, 0.95],
    [0.74, 0.8],
  ] as const) {
    striche.push({ ax: x0, ay: 0.98, bx: x0 + 0.03, by: 0.98 - laenge, dicke: 0.006, hell: 0.4 });
    for (let i = 0; i < 6; i++) {
      const y = 0.9 - i * (laenge / 6.5);
      const seite = i % 2 === 0 ? 1 : -1;
      blaetter.push({ x: x0 + 0.005 * i, y, w: -Math.PI / 2 + seite * 0.9, laenge: 0.11, breite: 0.045, spitz: 0.6 });
    }
  }
  return malen(blaetter, striche);
}

function nadelBild() {
  const r = folge(23);
  const striche: Strich[] = [{ ax: 0.5, ay: 0.02, bx: 0.5, by: 0.98, dicke: 0.014, hell: 0.5 }];
  // Seitenzweige
  for (let i = 0; i < 4; i++) {
    const y = 0.2 + i * 0.18;
    for (const seite of [-1, 1])
      striche.push({ ax: 0.5, ay: y, bx: 0.5 + seite * 0.28, by: y + 0.16, dicke: 0.008, hell: 0.5 });
  }
  // dichte, kurze Nadeln an Haupt- und Seitenzweigen
  const zweige = [...striche];
  for (const z of zweige) {
    const n = Math.round(Math.hypot(z.bx - z.ax, z.by - z.ay) / 0.018);
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const x = z.ax + (z.bx - z.ax) * t;
      const y = z.ay + (z.by - z.ay) * t;
      const w = Math.atan2(z.by - z.ay, z.bx - z.ax);
      for (const seite of [-1, 1]) {
        const nw = w + seite * (0.9 + r() * 0.3);
        const l = 0.05 + r() * 0.02;
        striche.push({
          ax: x,
          ay: y,
          bx: x + Math.cos(nw) * l,
          by: y + Math.sin(nw) * l,
          dicke: 0.005,
          hell: 0.8 + r() * 0.2,
        });
      }
    }
  }
  return malen([], striche);
}

function kieferBild() {
  const r = folge(5);
  const striche: Strich[] = [{ ax: 0.5, ay: 0.02, bx: 0.5, by: 0.3, dicke: 0.016, hell: 0.45 }];
  // lange Nadeln, paarweise, fächerförmig nach oben
  for (let i = 0; i < 46; i++) {
    const w = Math.PI / 2 + (r() - 0.5) * 2.4;
    const l = 0.45 + r() * 0.25;
    const y0 = 0.15 + r() * 0.15;
    striche.push({
      ax: 0.5,
      ay: y0,
      bx: 0.5 + Math.cos(w) * l,
      by: y0 + Math.sin(w) * l * 0.95,
      dicke: 0.005,
      hell: 0.75 + r() * 0.25,
    });
  }
  return malen([], striche);
}

function fernbaumBild() {
  const r = folge(41);
  const striche: Strich[] = [{ ax: 0.5, ay: 0.0, bx: 0.5, by: 0.99, dicke: 0.014, hell: 0.6 }];
  // Astquirle: unten lang und hängend, nach oben kürzer; dicht, damit ein geschlossener Umriss entsteht
  for (let y = 0.08; y < 0.96; y += 0.03 + r() * 0.015) {
    const laenge = (1 - y) * 0.42 * (0.8 + r() * 0.4);
    for (const seite of [-1, 1]) {
      const bx = 0.5 + seite * laenge;
      const by = y - laenge * (0.25 + r() * 0.2);
      striche.push({ ax: 0.5, ay: y, bx, by, dicke: 0.018, hell: 0.7 });
      // Nadelbüschel hängen vom Ast herab, unregelmäßig lang
      const n = 4 + Math.round(laenge * 30);
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n;
        const x = 0.5 + (bx - 0.5) * t;
        const yy = y + (by - y) * t;
        const l = 0.03 + r() * 0.06 * (1 - t * 0.5);
        striche.push({
          ax: x,
          ay: yy,
          bx: x + seite * (r() - 0.3) * 0.03,
          by: yy - l,
          dicke: 0.012,
          hell: 0.75 + r() * 0.25,
        });
      }
    }
  }
  return malen([], striche);
}

export function blattTextur(art: BlattArt): THREE.DataTexture {
  let t = cache.get(art);
  if (!t) {
    t =
      art === 'laub'
        ? laubBild()
        : art === 'birke'
          ? birkeBild()
          : art === 'nadel'
            ? nadelBild()
            : art === 'fernbaum'
              ? fernbaumBild()
              : kieferBild();
    cache.set(art, t);
  }
  return t;
}
