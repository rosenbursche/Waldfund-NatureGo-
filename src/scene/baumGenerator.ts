import * as THREE from 'three';

import type { BaumModell } from '@/data/typen';
import { zufall } from '@/logic/lichtung';

import type { BlattArt } from './blattTexturen';

/**
 * Baut fein verästelte Bäume aus Code: Stamm mit Wurzelanläufen, Hauptäste, Zweige, Zweiglein
 * und daran hunderte Blatt- bzw. Nadelbüschel.
 *
 * Jede Kronenform hat einen eigenen Bauplan (Abgangswinkel, Biegung, Knorrigkeit, Rindenmuster):
 * Buche rund und glatt, Eiche knorrig und breit, Fichte mit hängenden Quirlästen, Tanne waagerecht
 * mit flacher Spitze, Kiefer mit hohem, rötlichem Stamm und Schirmkrone, Birke weiß mit hängenden Zweigen.
 *
 * Ergebnis: eine Holz-Geometrie (Rinde als Graustufen in den Eckpunkten, Farbe kommt vom Material)
 * und eine Liste von Blatt-Matrizen für ein InstancedMesh.
 */

type Rinde = 'glatt' | 'furchen' | 'birke' | 'schuppen' | 'kiefer';

type Bauplan = {
  /** Höhe des astfreien Stammes (Anteil der Baumhöhe) */
  stamm: number;
  /** durchgehender Leittrieb bis zur Spitze (Nadelbäume, Birke) statt Aufteilung in Hauptäste */
  leittrieb: boolean;
  /** Hauptäste (ohne Leittrieb) bzw. Äste je Quirl (mit Leittrieb) */
  aeste: number;
  /** Abgangswinkel der Hauptäste von der Senkrechten (Bogenmaß) */
  winkel: number;
  /** Abgangswinkel der feineren Zweige vom Mutterast */
  zweigWinkel: number;
  /** + wächst nach oben, − hängt (für Zweige) */
  biegung: number;
  /** Zufallsknicke */
  knorrig: number;
  /** Verzweigungstiefe */
  ebenen: number;
  /** Stammradius als Anteil der Höhe */
  dicke: number;
  /** Astlänge über der Höhe (0 = Kronenansatz, 1 = Spitze), nur mit Leittrieb */
  kronenForm?: (t: number) => number;
  /** Länge der Hauptäste als Anteil der Höhe */
  astLaenge: number;
  blattArt: BlattArt;
  /** Blattbüschel je Längeneinheit Zweig */
  blattDichte: number;
  blattGroesse: number;
  rinde: Rinde;
};

const BAUPLAENE: Record<BaumModell['krone'], Bauplan> = {
  // Buche: glatter, grauer Stamm, steil aufstrebende Äste, dichte runde Krone
  rund: {
    stamm: 0.38,
    leittrieb: false,
    aeste: 4,
    winkel: 0.55,
    zweigWinkel: 0.75,
    biegung: 0.15,
    knorrig: 0.12,
    ebenen: 3,
    dicke: 0.045,
    astLaenge: 0.42,
    blattArt: 'laub',
    blattDichte: 15,
    blattGroesse: 0.78,
    rinde: 'glatt',
  },
  // Eiche: kurzer, dicker Stamm, knorrige, weit ausladende Äste
  ausladend: {
    stamm: 0.3,
    leittrieb: false,
    aeste: 5,
    winkel: 0.95,
    zweigWinkel: 0.85,
    biegung: 0.05,
    knorrig: 0.42,
    ebenen: 3,
    dicke: 0.06,
    astLaenge: 0.45,
    blattArt: 'laub',
    blattDichte: 15,
    blattGroesse: 0.76,
    rinde: 'furchen',
  },
  oval: {
    stamm: 0.35,
    leittrieb: false,
    aeste: 4,
    winkel: 0.45,
    zweigWinkel: 0.7,
    biegung: 0.12,
    knorrig: 0.18,
    ebenen: 3,
    dicke: 0.042,
    astLaenge: 0.4,
    blattArt: 'laub',
    blattDichte: 15,
    blattGroesse: 0.72,
    rinde: 'furchen',
  },
  saeule: {
    stamm: 0.18,
    leittrieb: false,
    aeste: 5,
    winkel: 0.22,
    zweigWinkel: 0.45,
    biegung: 0.2,
    knorrig: 0.1,
    ebenen: 3,
    dicke: 0.035,
    astLaenge: 0.5,
    blattArt: 'laub',
    blattDichte: 16,
    blattGroesse: 0.62,
    rinde: 'furchen',
  },
  // Birke: schlanker weißer Stamm mit Leittrieb, feine hängende Zweige
  haengend: {
    stamm: 0.3,
    leittrieb: true,
    aeste: 2,
    winkel: 0.8,
    zweigWinkel: 0.7,
    biegung: -1.6,
    knorrig: 0.15,
    ebenen: 2,
    dicke: 0.028,
    astLaenge: 0.32,
    kronenForm: (t) => 0.45 + Math.sin(Math.PI * Math.min(1, t * 1.1)) * 0.6,
    blattArt: 'birke',
    blattDichte: 13,
    blattGroesse: 0.6,
    rinde: 'birke',
  },
  // Fichte: gerader Stamm bis zur Spitze, Quirläste leicht hängend, unten lang, oben kurz
  kegel: {
    stamm: 0.1,
    leittrieb: true,
    aeste: 5,
    winkel: 1.75,
    zweigWinkel: 0.9,
    biegung: -0.35,
    knorrig: 0.06,
    ebenen: 2,
    dicke: 0.035,
    astLaenge: 0.3,
    kronenForm: (t) => Math.max(0.06, 1 - t),
    blattArt: 'nadel',
    blattDichte: 5,
    blattGroesse: 0.55,
    rinde: 'schuppen',
  },
  // Tanne: Äste waagerecht, Spitze abgeflacht ("Storchennest" bei alten Tannen)
  'kegel-flach': {
    stamm: 0.1,
    leittrieb: true,
    aeste: 5,
    winkel: 1.55,
    zweigWinkel: 0.95,
    biegung: 0.05,
    knorrig: 0.05,
    ebenen: 2,
    dicke: 0.04,
    astLaenge: 0.32,
    kronenForm: (t) => Math.max(0.22, 1 - t * 0.85),
    blattArt: 'nadel',
    blattDichte: 5,
    blattGroesse: 0.55,
    rinde: 'glatt',
  },
  // Kiefer: hoher, astfreier Stamm, oben rötlich, lockere Schirmkrone aus Nadelbüscheln
  schirm: {
    stamm: 0.6,
    leittrieb: false,
    aeste: 5,
    winkel: 0.85,
    zweigWinkel: 0.8,
    biegung: 0.2,
    knorrig: 0.35,
    ebenen: 3,
    dicke: 0.035,
    astLaenge: 0.34,
    blattArt: 'kiefer',
    blattDichte: 11,
    blattGroesse: 0.7,
    rinde: 'kiefer',
  },
};

/** Gesamthöhe eines Baums mit Modellhöhe 1 (passt zur bisherigen Szene) */
export const BAUM_GRUNDHOEHE = 4.3;

type Ast = { punkte: THREE.Vector3[]; radien: number[]; ebene: number };

export type BaumDaten = {
  holz: THREE.BufferGeometry;
  /** 16 Zahlen je Blattbüschel (Matrix) */
  blaetter: Float32Array;
  /** 3 Zahlen je Blattbüschel (leichte Helligkeitsunterschiede) */
  blattFarben: Float32Array;
  anzahl: number;
  blattArt: BlattArt;
  hoehe: number;
};

const OBEN = new THREE.Vector3(0, 1, 0);
const H1 = new THREE.Vector3();
const H2 = new THREE.Vector3();
const Q = new THREE.Quaternion();
const M = new THREE.Matrix4();
const S = new THREE.Vector3();

/** Eine senkrecht zu `d` stehende Achse */
function quer(d: THREE.Vector3, ziel: THREE.Vector3) {
  ziel.set(0, 1, 0);
  if (Math.abs(d.y) > 0.9) ziel.set(1, 0, 0);
  return ziel.cross(d).normalize();
}

class Wachstum {
  aeste: Ast[] = [];
  blaetter: number[] = [];
  farben: number[] = [];
  constructor(
    readonly plan: Bauplan,
    readonly hoehe: number,
    readonly rnd: () => number,
    readonly kronenMitte: THREE.Vector3,
  ) {}

  /** Lässt einen Ast wachsen und verzweigt ihn weiter */
  ast(start: THREE.Vector3, richtung: THREE.Vector3, laenge: number, radius: number, ebene: number) {
    const { plan, rnd } = this;
    const schrittLaenge = ebene === 0 ? 0.14 : ebene === 1 ? 0.22 : 0.32;
    const schritte = Math.max(2, Math.round(laenge / schrittLaenge));
    const punkte = [start.clone()];
    const radien = [radius];
    const p = start.clone();
    const d = richtung.clone().normalize();
    const stammAst = ebene === 0 && plan.leittrieb;
    for (let i = 1; i <= schritte; i++) {
      const k = plan.knorrig * (stammAst ? 0.2 : ebene === 0 ? 0.22 : 1);
      d.x += (rnd() - 0.5) * k;
      d.z += (rnd() - 0.5) * k;
      d.y += (rnd() - 0.5) * k * 0.4;
      // Zweige streben zum Licht (biegung > 0) oder hängen durch (biegung < 0)
      if (ebene > 0) d.y += plan.biegung * (laenge / schritte) * (ebene / plan.ebenen);
      d.normalize();
      p.addScaledVector(d, laenge / schritte);
      punkte.push(p.clone());
      radien.push(radius * (1 - (i / schritte) * 0.78));
    }
    this.aeste.push({ punkte, radien, ebene });

    if (ebene < plan.ebenen) this.verzweigen(punkte, radien, laenge, ebene);
    if (ebene >= plan.ebenen - 1) this.belauben(punkte, laenge, ebene);
  }

  verzweigen(punkte: THREE.Vector3[], radien: number[], laenge: number, ebene: number) {
    const { plan, rnd, hoehe } = this;
    const letzte = punkte.length - 1;
    const d = new THREE.Vector3();

    // Stamm ohne Leittrieb: teilt sich am Ende in mehrere Hauptäste (Laubbäume, Kiefer)
    if (ebene === 0 && !plan.leittrieb) {
      d.subVectors(punkte[letzte], punkte[letzte - 1]).normalize();
      for (let k = 0; k < plan.aeste; k++) {
        const um = (k / plan.aeste) * Math.PI * 2 + rnd() * 0.6;
        const neu = d
          .clone()
          .applyAxisAngle(quer(d, H1), plan.winkel * (0.75 + rnd() * 0.5))
          .applyAxisAngle(d, um);
        const l = hoehe * plan.astLaenge * (0.8 + rnd() * 0.4);
        this.ast(punkte[letzte], neu, l, radien[letzte] * 0.72, 1);
      }
      // ein Ast setzt den Stamm nach oben fort (sonst wirkt die Krone hohl)
      this.ast(punkte[letzte], d.clone(), hoehe * plan.astLaenge * 0.9, radien[letzte] * 0.65, 1);
      return;
    }

    // Leittrieb: Quirle von Ästen rundum, Länge nach Kronenform
    if (ebene === 0) {
      const ab = hoehe * plan.stamm;
      let quirl = 0;
      for (let y = ab; y < hoehe * 0.97; y += 0.2 + rnd() * 0.08) {
        const t = (y - ab) / (hoehe - ab);
        const i = Math.min(letzte, Math.round((y / hoehe) * letzte));
        const n = plan.aeste + (rnd() > 0.5 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          const um = (k / n) * Math.PI * 2 + quirl * 0.7 + rnd() * 0.4;
          const neu = OBEN.clone()
            .applyAxisAngle(H1.set(1, 0, 0), plan.winkel + (rnd() - 0.5) * 0.25)
            .applyAxisAngle(OBEN, um);
          const l = hoehe * plan.astLaenge * (plan.kronenForm?.(t) ?? 1) * (0.85 + rnd() * 0.3);
          this.ast(punkte[i], neu, l, Math.max(0.012, radien[i] * 0.35), 1);
        }
        quirl++;
      }
      return;
    }

    // feinere Zweige entlang des Astes, wechselnd rundum
    const n = Math.max(2, Math.round(laenge * (ebene === 1 ? 2.6 : 3.2)));
    for (let k = 0; k < n; k++) {
      const t = 0.3 + (k / n) * 0.65 + rnd() * 0.05;
      const i = Math.min(letzte - 1, Math.max(1, Math.round(t * letzte)));
      d.subVectors(punkte[i + 1], punkte[i]).normalize();
      const um = k * 2.4 + rnd();
      const neu = d
        .clone()
        .applyAxisAngle(quer(d, H2), plan.zweigWinkel * (0.7 + rnd() * 0.5))
        .applyAxisAngle(d, um);
      this.ast(
        punkte[i],
        neu,
        laenge * (0.45 + rnd() * 0.25) * (1 - t * 0.4),
        Math.max(0.006, radien[i] * 0.55),
        ebene + 1,
      );
    }
  }

  /** Blatt- oder Nadelbüschel entlang der feinsten Zweige */
  belauben(punkte: THREE.Vector3[], laenge: number, ebene: number) {
    const { plan, rnd, kronenMitte } = this;
    const nadel = plan.blattArt === 'nadel';
    const anteilAb = nadel ? 0.1 : ebene === plan.ebenen ? 0.25 : 0.6;
    const anzahl = Math.max(1, Math.round(laenge * plan.blattDichte * (1 - anteilAb)));
    const d = new THREE.Vector3();
    const normale = new THREE.Vector3();
    const pos = new THREE.Vector3();
    for (let k = 0; k < anzahl; k++) {
      const t = anteilAb + (1 - anteilAb) * ((k + rnd()) / anzahl);
      const f = t * (punkte.length - 1);
      const i = Math.min(punkte.length - 2, Math.floor(f));
      pos.lerpVectors(punkte[i], punkte[i + 1], f - i);
      d.subVectors(punkte[i + 1], punkte[i]).normalize();
      const g = plan.blattGroesse * (0.75 + rnd() * 0.5);

      if (nadel) {
        // Nadelzweig liegt entlang des Astes, Fläche zeigt nach außen/oben; Textur-Unterkante = Ansatz
        normale.subVectors(pos, kronenMitte).setY(1.2).normalize();
        const seite = H1.crossVectors(d, normale).normalize();
        const flaeche = H2.crossVectors(seite, d).normalize();
        M.makeBasis(seite, d, flaeche)
          .setPosition(pos)
          .scale(S.set(g, g, g));
      } else if (plan.blattArt === 'birke') {
        // Birkenzweiglein hängen: Textur-Oberkante am Zweig, Rest baumelt nach unten
        const achse = H1.copy(d)
          .lerp(new THREE.Vector3(0, -1, 0), 0.75)
          .normalize()
          .negate();
        normale.subVectors(pos, kronenMitte).setY(0).normalize();
        const seite = H2.crossVectors(achse, normale).normalize();
        const flaeche = new THREE.Vector3().crossVectors(seite, achse);
        M.makeBasis(seite, achse, flaeche)
          .setPosition(pos.clone().addScaledVector(achse, -g))
          .scale(S.set(g, g, g));
      } else {
        // Laubbüschel: Fläche nach außen gedreht (weiche Beleuchtung der Krone), zufällig verdreht
        normale.subVectors(pos, kronenMitte).normalize();
        normale.x += (rnd() - 0.5) * 0.9;
        normale.y += (rnd() - 0.5) * 0.9 + 0.2;
        normale.z += (rnd() - 0.5) * 0.9;
        normale.normalize();
        Q.setFromUnitVectors(H1.set(0, 0, 1), normale);
        Q.multiply(new THREE.Quaternion().setFromAxisAngle(H2.set(0, 0, 1), rnd() * Math.PI * 2));
        M.compose(pos.clone().addScaledVector(normale, 0.04), Q, S.set(g, g, g));
      }
      this.blaetter.push(...M.elements);
      const hell = 0.82 + rnd() * 0.3;
      this.farben.push(hell, hell * (0.97 + rnd() * 0.06), hell * (0.92 + rnd() * 0.08));
    }
  }
}

/** Graustufe der Rinde an einer Stelle (u = rundum 0–1, y = Höhe, ebene = Ast-Tiefe) */
function rindenTon(rinde: Rinde, u: number, y: number, ebene: number, rnd: () => number, hoehe: number): number {
  const w = u * Math.PI * 2;
  switch (rinde) {
    case 'furchen': // tiefe Längsfurchen (Eiche)
      return 0.62 + 0.38 * Math.pow(Math.abs(Math.sin(w * 4 + Math.sin(y * 3) * 0.8)), 0.6) - rnd() * 0.08;
    case 'schuppen': // rötlich-graue Schuppen (Fichte)
      return 0.7 + 0.3 * Math.abs(Math.sin(w * 5 + y * 9)) * (0.6 + rnd() * 0.4);
    case 'birke': {
      // weiß mit schwarzen Querstreifen, unten rissig-dunkel (Borke am Stammfuß)
      if (ebene > 1) return 0.35;
      if (ebene === 0 && y < hoehe * 0.12) return 0.3 + rnd() * 0.25;
      const strich = Math.sin(y * 17 + Math.sin(w) * 0.6) > 0.82 && Math.sin(w * 3 + y * 5) > -0.2;
      return strich ? 0.12 : 0.9 + rnd() * 0.1;
    }
    case 'kiefer': {
      // unten dicke, dunkle Borke, oben die typische rötliche "Spiegelrinde"
      const oben = THREE.MathUtils.smoothstep(y, hoehe * 0.35, hoehe * 0.6);
      const borke = 0.42 + 0.2 * Math.abs(Math.sin(w * 3 + y * 6));
      return borke * (1 - oben) + (0.85 + rnd() * 0.15) * oben;
    }
    case 'glatt':
    default: // fast glatt, leicht fleckig (Buche, Tanne)
      return 0.85 + 0.15 * Math.sin(w * 2 + y * 4) * (0.5 + rnd() * 0.5);
  }
}

/** Ein Ast als Röhre mit Ringen; Ringe folgen dem Ast (parallel mitgeführter Querschnitt) */
function roehren(aeste: Ast[], plan: Bauplan, rnd: () => number, hoehe: number) {
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const t = new THREE.Vector3();
  const n = new THREE.Vector3();
  const b = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (const ast of aeste) {
    // feinste Zweige von Nadelbäumen verschwinden unter den Nadelkarten – dort keine Röhren (spart Leistung)
    if (ast.ebene >= 2 && plan.blattArt === 'nadel') continue;
    const seg = ast.ebene === 0 ? 10 : ast.ebene === 1 ? 5 : 3;
    const basis = pos.length / 3;
    const pts = ast.punkte;
    // Startquerschnitt
    t.subVectors(pts[1], pts[0]).normalize();
    quer(t, n);
    for (let i = 0; i < pts.length; i++) {
      const tNeu = v.subVectors(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]).normalize();
      // Querschnitt mitdrehen, damit die Röhre nicht verdreht
      n.sub(tNeu.clone().multiplyScalar(n.dot(tNeu))).normalize();
      t.copy(tNeu);
      b.crossVectors(t, n);
      let r = ast.radien[i];
      // Wurzelanlauf: der Stamm wird zum Boden hin breiter
      if (ast.ebene === 0 && pts[i].y < 0.45) r *= 1 + 0.9 * Math.pow(1 - pts[i].y / 0.45, 2);
      for (let k = 0; k <= seg; k++) {
        const u = k / seg;
        const w = u * Math.PI * 2;
        const cx = Math.cos(w);
        const sy = Math.sin(w);
        // leichte Unregelmäßigkeit im Querschnitt (keine perfekten Zylinder)
        const rr = r * (ast.ebene === 0 ? 1 + Math.sin(w * 3 + i) * 0.06 : 1);
        const nx = n.x * cx + b.x * sy;
        const ny = n.y * cx + b.y * sy;
        const nz = n.z * cx + b.z * sy;
        pos.push(pts[i].x + nx * rr, pts[i].y + ny * rr, pts[i].z + nz * rr);
        nor.push(nx, ny, nz);
        const g = rindenTon(plan.rinde, u, pts[i].y, ast.ebene, rnd, hoehe);
        col.push(g, g, g);
      }
      if (i > 0) {
        const a = basis + (i - 1) * (seg + 1);
        const c = basis + i * (seg + 1);
        for (let k = 0; k < seg; k++) idx.push(a + k, c + k, a + k + 1, a + k + 1, c + k, c + k + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

const fertig = new Map<string, BaumDaten>();

/**
 * Baum nach Bauplan erzeugen. `variante` (0, 1, 2 …) ergibt unterschiedliche Exemplare derselben Art;
 * gleiche Art + Variante wird nur einmal gebaut und dann wiederverwendet.
 */
export function baueBaum(modell: BaumModell, variante: number): BaumDaten {
  const schluessel = `${modell.krone}-${modell.hoehe}-${variante}`;
  const vorhanden = fertig.get(schluessel);
  if (vorhanden) return vorhanden;

  const plan = BAUPLAENE[modell.krone] ?? BAUPLAENE.oval;
  const hoehe = BAUM_GRUNDHOEHE * modell.hoehe;
  const rnd = zufall(1000 + variante * 7919 + modell.krone.length * 31);
  const kronenMitte = new THREE.Vector3(
    0,
    plan.leittrieb ? hoehe * 0.5 : hoehe * (plan.stamm + (1 - plan.stamm) * 0.45),
    0,
  );
  const w = new Wachstum(plan, hoehe, rnd, kronenMitte);

  const stammLaenge = plan.leittrieb ? hoehe : hoehe * plan.stamm;
  const neigung = new THREE.Vector3((rnd() - 0.5) * 0.08, 1, (rnd() - 0.5) * 0.08);
  w.ast(new THREE.Vector3(0, 0, 0), neigung, stammLaenge, hoehe * plan.dicke, 0);

  // Wurzelanläufe: kurze, dicke Wurzeln, die schräg in den Boden gehen
  const wurzeln = plan.leittrieb ? 4 : 5;
  for (let k = 0; k < wurzeln; k++) {
    const um = (k / wurzeln) * Math.PI * 2 + rnd() * 0.5;
    const r = hoehe * plan.dicke;
    const punkte = [0, 1, 2, 3].map((i) => {
      const a = (i / 3) * (0.16 + rnd() * 0.08) * modell.hoehe + r * 0.5;
      return new THREE.Vector3(Math.cos(um) * a, Math.max(-0.05, 0.14 - i * 0.07), Math.sin(um) * a);
    });
    w.aeste.push({ punkte, radien: [r * 0.55, r * 0.4, r * 0.25, r * 0.1], ebene: 1 });
  }

  const daten: BaumDaten = {
    holz: roehren(w.aeste, plan, rnd, hoehe),
    blaetter: new Float32Array(w.blaetter),
    blattFarben: new Float32Array(w.farben),
    anzahl: w.blaetter.length / 16,
    blattArt: plan.blattArt,
    hoehe,
  };
  fertig.set(schluessel, daten);
  return daten;
}
