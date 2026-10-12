import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { zufall } from '@/logic/lichtung';

/**
 * Fein gebaute Teile der Hütte, jeweils zu einer Geometrie zusammengefügt (ein Zeichenaufruf):
 * Blockwände aus einzelnen Rundstämmen mit überstehenden Ecken, Schindeldach in Reihen,
 * Sockel und Kamin aus unregelmäßigen Feldsteinen, Brettertür.
 * Helligkeitsunterschiede stecken als Graustufen in den Eckpunkten, die Farbe kommt vom Material.
 */

/** Graustufe auf alle Eckpunkte einer Geometrie legen */
function toenen(g: THREE.BufferGeometry, ton: number) {
  const n = g.attributes.position.count;
  const farben = new Float32Array(n * 3).fill(ton);
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  return g;
}

/** Für mergeGeometries müssen alle Teile dieselben Attribute haben (uv brauchen wir nicht) */
function vereinheitlichen(g: THREE.BufferGeometry) {
  const ohneIndex = g.index ? g.toNonIndexed() : g;
  ohneIndex.deleteAttribute('uv');
  return ohneIndex;
}

/**
 * Blockhauswände: Rundstämme liegen abwechselnd auf Front/Rückseite und Seiten,
 * an den Ecken stehen sie über (wie bei echten Blockhäusern verkämmt).
 */
export function blockwand(breite: number, hoehe: number, tiefe: number, startwert = 3): THREE.BufferGeometry {
  const rnd = zufall(startwert);
  const r = 0.085;
  const teile: THREE.BufferGeometry[] = [];
  const lagen = Math.round(hoehe / (r * 2));
  for (let i = 0; i < lagen; i++) {
    // Front/Rückseite und Seiten liegen um einen halben Stamm versetzt übereinander
    for (const seite of [0, 1]) {
      const y = r + i * r * 2 + seite * r;
      if (y > hoehe) continue;
      const laenge = seite === 0 ? breite + 0.3 : tiefe + 0.3;
      for (const vorn of [-1, 1]) {
        const g = new THREE.CylinderGeometry(r * (0.92 + rnd() * 0.14), r, laenge + (rnd() - 0.5) * 0.08, 7, 1);
        g.rotateZ(Math.PI / 2);
        if (seite === 1) g.rotateY(Math.PI / 2);
        if (seite === 0) g.translate((rnd() - 0.5) * 0.04, y, (vorn * tiefe) / 2);
        else g.translate((vorn * breite) / 2, y, (rnd() - 0.5) * 0.04);
        teile.push(toenen(vereinheitlichen(g), 0.78 + rnd() * 0.3));
        // Stirnseiten der Stämme an den Ecken heller (Hirnholz mit Jahresringen angedeutet)
        for (const ende of [-1, 1]) {
          const kappe = new THREE.CircleGeometry(r * 0.9, 7);
          if (seite === 0) {
            kappe.rotateY((ende * Math.PI) / 2);
            kappe.translate((ende * laenge) / 2 + ende * 0.002, y, (vorn * tiefe) / 2);
          } else {
            kappe.rotateY(ende > 0 ? 0 : Math.PI);
            kappe.translate((vorn * breite) / 2, y, (ende * laenge) / 2 + ende * 0.002);
          }
          teile.push(toenen(vereinheitlichen(kappe), 1.35 + rnd() * 0.15));
        }
      }
    }
  }
  // Füllung zwischen den Stämmen (Moos/Lehm), damit man nicht durch die Ritzen schaut
  const kern = new THREE.BoxGeometry(breite - 0.02, hoehe, tiefe - 0.02);
  kern.translate(0, hoehe / 2, 0);
  teile.push(toenen(vereinheitlichen(kern), 0.55));
  return mergeGeometries(teile);
}

/**
 * Satteldach aus Holzschindeln in versetzten Reihen; First läuft entlang x.
 * Jede Dachseite wird in eigenen Koordinaten gebaut (x entlang des Firsts, y = von der Fläche weg,
 * z = von der Traufe hinauf zum First) und dann mit einer Matrix auf ihre Seite gelegt.
 */
export function schindeldach(laenge: number, tiefe: number, firstHoehe: number, startwert = 5): THREE.BufferGeometry {
  const rnd = zufall(startwert);
  const teile: THREE.BufferGeometry[] = [];
  const halb = tiefe / 2 + 0.22; // Dachüberstand
  const schraeg = Math.hypot(halb, firstHoehe);
  const reihen = Math.ceil(schraeg / 0.15);
  for (const seite of [-1, 1]) {
    // Basis: X entlang First (bei seite +1 gespiegelt, damit die Flächen richtig herum zeigen),
    // Y = Flächennormale nach außen, Z = Richtung Traufe → First
    const X = new THREE.Vector3(seite > 0 ? -1 : 1, 0, 0);
    const Y = new THREE.Vector3(0, halb, seite * firstHoehe).divideScalar(schraeg);
    const Z = new THREE.Vector3(0, firstHoehe, -seite * halb).divideScalar(schraeg);
    const lage = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(0, 0, seite * halb);

    const platte = new THREE.BoxGeometry(laenge + 0.4, 0.05, schraeg);
    platte.translate(0, -0.02, schraeg / 2);
    teile.push(toenen(vereinheitlichen(platte.applyMatrix4(lage)), 0.45));

    for (let r = 0; r < reihen; r++) {
      const versatz = r % 2 === 0 ? 0 : 0.11;
      for (let x = -laenge / 2 - 0.2 + versatz; x < laenge / 2 + 0.2 - 0.1; x += 0.22) {
        const w = 0.19 + rnd() * 0.05;
        const sch = new THREE.BoxGeometry(w, 0.022, 0.24);
        // untere Kante steht etwas ab (Schuppen-Look), jede Schindel minimal verdreht
        sch.rotateX(0.12);
        sch.rotateY((rnd() - 0.5) * 0.06);
        sch.translate(x + w / 2, 0.03, Math.min(schraeg - 0.12, r * 0.15 + 0.12));
        teile.push(toenen(vereinheitlichen(sch.applyMatrix4(lage)), 0.68 + rnd() * 0.5));
      }
    }
  }
  // Firstbalken
  const first = new THREE.CylinderGeometry(0.075, 0.075, laenge + 0.5, 7);
  first.rotateZ(Math.PI / 2);
  first.translate(0, firstHoehe + 0.05, 0);
  teile.push(toenen(vereinheitlichen(first), 0.5));
  // Giebeldreiecke (Bretter), vorne und hinten an den Stirnseiten
  for (const ende of [-1, 1]) {
    const form = new THREE.Shape();
    form.moveTo(-tiefe / 2, 0);
    form.lineTo(tiefe / 2, 0);
    form.lineTo(0, firstHoehe * (tiefe / 2 / halb));
    form.closePath();
    const giebel = new THREE.ShapeGeometry(form);
    giebel.rotateY(ende > 0 ? Math.PI / 2 : -Math.PI / 2);
    giebel.translate((ende * laenge) / 2, 0, 0);
    teile.push(toenen(vereinheitlichen(giebel), 0.8));
  }
  return mergeGeometries(teile);
}

/** Ring bzw. Fläche aus unregelmäßigen Feldsteinen (Sockel) */
export function steinsockel(breite: number, tiefe: number, hoehe: number, startwert = 9): THREE.BufferGeometry {
  const rnd = zufall(startwert);
  const teile: THREE.BufferGeometry[] = [];
  const umfang = 2 * (breite + tiefe);
  const schritt = 0.2;
  for (let lage = 0; lage < Math.max(1, Math.round(hoehe / 0.12)); lage++) {
    for (let d = (lage % 2) * 0.1; d < umfang; d += schritt) {
      let x: number;
      let z: number;
      if (d < breite) [x, z] = [-breite / 2 + d, tiefe / 2];
      else if (d < breite + tiefe) [x, z] = [breite / 2, tiefe / 2 - (d - breite)];
      else if (d < 2 * breite + tiefe) [x, z] = [breite / 2 - (d - breite - tiefe), -tiefe / 2];
      else [x, z] = [-breite / 2, -tiefe / 2 + (d - 2 * breite - tiefe)];
      const s = new THREE.DodecahedronGeometry(1, 0);
      s.scale(0.1 + rnd() * 0.04, 0.065 + rnd() * 0.02, 0.09 + rnd() * 0.03);
      s.rotateY(rnd() * Math.PI);
      s.translate(x, 0.06 + lage * 0.12, z);
      teile.push(toenen(vereinheitlichen(s), 0.75 + rnd() * 0.4));
    }
  }
  const kern = new THREE.BoxGeometry(breite, hoehe, tiefe);
  kern.translate(0, hoehe / 2, 0);
  teile.push(toenen(vereinheitlichen(kern), 0.6));
  return mergeGeometries(teile);
}

/** Kamin aus versetzt gemauerten Steinen, oben mit Abdeckplatte */
export function kamin(breite: number, hoehe: number, startwert = 13): THREE.BufferGeometry {
  const rnd = zufall(startwert);
  const teile: THREE.BufferGeometry[] = [];
  const h = 0.11;
  for (let lage = 0; lage * h < hoehe; lage++) {
    const versatz = lage % 2 === 0 ? 0 : breite / 4;
    for (const seite of [0, 1, 2, 3]) {
      for (let k = 0; k < 2; k++) {
        const s = new THREE.BoxGeometry(breite / 2 - 0.01, h - 0.012, 0.07);
        s.translate(
          -breite / 4 + k * (breite / 2) + (seite % 2 === 0 ? versatz : -versatz) * 0.3,
          0,
          breite / 2 - 0.03,
        );
        s.rotateY((seite * Math.PI) / 2);
        s.translate(0, h / 2 + lage * h, 0);
        teile.push(toenen(vereinheitlichen(s), 0.7 + rnd() * 0.4));
      }
    }
  }
  const kern = new THREE.BoxGeometry(breite - 0.06, hoehe, breite - 0.06);
  kern.translate(0, hoehe / 2, 0);
  teile.push(toenen(vereinheitlichen(kern), 0.4));
  const deckel = new THREE.BoxGeometry(breite + 0.08, 0.05, breite + 0.08);
  deckel.translate(0, hoehe + 0.03, 0);
  teile.push(toenen(vereinheitlichen(deckel), 0.9));
  return mergeGeometries(teile);
}

/** Brettertür mit Querleisten und einem Z-Balken */
export function tuer(breite: number, hoehe: number, startwert = 17): THREE.BufferGeometry {
  const rnd = zufall(startwert);
  const teile: THREE.BufferGeometry[] = [];
  const bretter = 4;
  for (let i = 0; i < bretter; i++) {
    const b = new THREE.BoxGeometry(breite / bretter - 0.008, hoehe, 0.04);
    b.translate(-breite / 2 + (i + 0.5) * (breite / bretter), hoehe / 2, 0);
    teile.push(toenen(vereinheitlichen(b), 0.75 + rnd() * 0.3));
  }
  for (const y of [0.18, hoehe - 0.18]) {
    const q = new THREE.BoxGeometry(breite, 0.07, 0.03);
    q.translate(0, y, 0.035);
    teile.push(toenen(vereinheitlichen(q), 0.6));
  }
  const z = new THREE.BoxGeometry(Math.hypot(breite, hoehe - 0.36) - 0.05, 0.07, 0.03);
  z.rotateZ(Math.atan2(hoehe - 0.36, breite));
  z.translate(0, hoehe / 2, 0.035);
  teile.push(toenen(vereinheitlichen(z), 0.6));
  return mergeGeometries(teile);
}
