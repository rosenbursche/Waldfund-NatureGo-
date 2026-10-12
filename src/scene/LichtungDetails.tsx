import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import {
  AUSSTATTUNG,
  straeucherPlaetze,
  streuen,
  trittsteine,
  TUEMPEL,
  WEG,
  wegX,
  type Detail,
} from '@/logic/lichtungDetails';
import { zufall } from '@/logic/lichtung';
import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { blattTextur } from './blattTexturen';
import { FORM, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Die vielen kleinen Dinge, die die Lichtung lebendig machen:
 * welliger Waldboden, Gras, Farne, Moospolster, Blumen, Steine, Pilzgruppen, Weg mit Trittsteinen,
 * Tümpel mit Schilf und Seerosenblättern, Holzstapel, Laterne, umgestürzter Stamm,
 * dichter Wald am Horizont, Mond und Lichtstrahlen.
 *
 * Leistung: Gleichartiges wird als InstancedMesh gezeichnet (ein Zeichenaufruf für hunderte Halme).
 * Gras und Farne wiegen sich im Wind über einen kleinen Zusatz im Shader.
 */

// Farben der Details (gedämpft, passend zur Dämmerung)
const FARBE = {
  boden: '#17241D',
  bodenHell: '#26392D',
  lichtung: '#2A3D30',
  erde: '#2B2620',
  sand: '#55503F',
  gras: ['#3D5A45', '#4A6B48', '#33503C', '#5A7346'],
  farn: ['#2F5338', '#3A6240', '#294A33'],
  moos: ['#3E5E3A', '#4C6B3E', '#344F33'],
  blume: ['#D9E0E6', '#E9C46A', '#B79CE0', '#C7D6E8'],
  stein: ['#4B514C', '#585E57', '#3F4541'],
  pilz: ['#9C3A2C', '#6B4A2E', '#A0783C', '#D8CFB8'],
  stiel: '#E8E2D2',
  holz: '#5A4030',
  holzHell: '#8A6A4A',
  rinde: '#3A2C22',
  wasser: '#0E1B1E',
  schilf: '#5A6B3E',
  kolben: '#4A3424',
  seerose: '#365A3A',
  wald: ['#13211B', '#172820', '#1B2C23'],
  laub: ['#5A3E2A', '#6B4A2E', '#7A5A30', '#4E3A26', '#3E4A2E'],
  zapfen: '#4A3424',
  punkte: '#EFE6CF',
};

/** Gemeinsamer Wind für alle Pflanzen (wird einmal pro Bild weitergezählt) */
const WIND = { value: 0 };

const windMaterialien = new Map<string, THREE.MeshLambertMaterial>();

/** Mattes Material, das Pflanzen-Instanzen sanft im Wind wiegt (je höher der Punkt, desto mehr) */
function windMaterial(staerke: number): THREE.MeshLambertMaterial {
  const schluessel = String(staerke);
  let m = windMaterialien.get(schluessel);
  if (m) return m;
  m = new THREE.MeshLambertMaterial({ color: '#ffffff', flatShading: true, side: THREE.DoubleSide });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.zeit = WIND;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float zeit;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float phase = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5;
          float h = max(position.y, 0.0);
          transformed.x += sin(zeit * 1.4 + phase) * ${staerke.toFixed(3)} * h * h;
          transformed.z += cos(zeit * 1.1 + phase) * ${(staerke * 0.6).toFixed(3)} * h * h;
        #endif`,
      );
  };
  windMaterialien.set(schluessel, m);
  return m;
}

// ---------- Geometrien (einmal gebaut, von allen geteilt) ----------

/** Grasbüschel: fünf schmale, schräge Halme */
function grasGeometrie() {
  const teile = Array.from({ length: 5 }, (_, i) => {
    const h = new THREE.ConeGeometry(0.022, 0.42 - (i % 2) * 0.1, 3);
    h.translate(0, (0.42 - (i % 2) * 0.1) / 2, 0);
    h.rotateZ((i - 2) * 0.22);
    h.rotateY(i * 1.3);
    return h;
  });
  return mergeGeometries(teile);
}

/** Farn: sieben gebogene Wedel, die nach außen fallen */
function farnGeometrie() {
  const wedel = Array.from({ length: 7 }, (_, i) => {
    const w = new THREE.PlaneGeometry(0.16, 0.75, 1, 5);
    w.translate(0, 0.375, 0);
    const pos = w.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pos.count; k++) {
      const t = pos.getY(k) / 0.75; // 0 = Ansatz, 1 = Spitze
      pos.setX(k, pos.getX(k) * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.05)));
      pos.setZ(k, t * t * 0.32); // Wedel biegt sich nach außen
    }
    w.rotateX(-0.75);
    w.rotateY((i / 7) * Math.PI * 2);
    return w;
  });
  return mergeGeometries(wedel);
}

/** Pilzhut: halbe Kugel */
const HUT = new THREE.SphereGeometry(1, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
const STIEL = new THREE.CylinderGeometry(0.16, 0.22, 1, 6);
const BLUETE = new THREE.IcosahedronGeometry(0.05, 0);
const HALM = new THREE.CylinderGeometry(0.008, 0.01, 1, 3);
const PLATTE = new THREE.CylinderGeometry(1, 1.05, 0.12, 7);
const SCHEIBE = new THREE.CircleGeometry(1, 10);
/** Laubblatt: flache Raute */
const BLATT = (() => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -1, 0.45, 0, 0, 0, 0, 1, -0.45, 0, 0], 3));
  g.setIndex([0, 2, 1, 0, 3, 2]);
  g.computeVertexNormals();
  return g;
})();

/** Feldstein: verbeulte Kugel mit weichen Kanten und Kerben (statt glatter Low-Poly-Form) */
const FELS = (() => {
  const g = new THREE.IcosahedronGeometry(1, 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const beule = 1 + Math.sin(v.x * 3.1 + v.y * 1.7) * 0.12 + Math.sin(v.z * 4.3 - v.x * 2.2) * 0.08;
    // unten abgeflacht, als läge er auf dem Boden
    v.multiplyScalar(beule);
    if (v.y < -0.3) v.y = -0.3 + (v.y + 0.3) * 0.3;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
})();

/** Zwei gekreuzte Karten (Unterkante am Boden) für entfernte Bäume */
const FERNBAUM = mergeGeometries([
  new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0),
  new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0).rotateY(Math.PI / 2),
]);

// ---------- Hilfen ----------

const HILFE = new THREE.Object3D();
const FARB_HILFE = new THREE.Color();

/** Baut ein InstancedMesh aus einer Liste von Details. `farben` = Palette, `ton` wählt daraus. */
function instanzen(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  liste: Detail[],
  setzen: (d: Detail, o: THREE.Object3D) => void,
  farben?: string[],
) {
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, liste.length));
  mesh.count = liste.length;
  liste.forEach((d, i) => {
    HILFE.position.set(d.x, 0, d.z);
    HILFE.rotation.set(0, d.drehung, 0);
    HILFE.scale.setScalar(d.groesse);
    setzen(d, HILFE);
    HILFE.updateMatrix();
    mesh.setMatrixAt(i, HILFE.matrix);
    if (farben) mesh.setColorAt(i, FARB_HILFE.set(farben[Math.floor(d.ton * farben.length) % farben.length]));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false; // Instanzen liegen überall – nicht anhand der Grundform wegschneiden
  return mesh;
}

/** Höhe des Bodens: Lichtung flach, ab dem Waldrand sanfte Hügel */
export function bodenHoehe(x: number, z: number): number {
  const r = Math.hypot(x, z);
  if (r < 14) return 0;
  const f = (r - 14) / 22;
  return f * f * 3 + Math.sin(x * 0.21) * Math.cos(z * 0.17) * 0.6 * Math.min(1, f * 2);
}

/** Welliger Waldboden mit Farbflecken (Moos, Laub, Erde) – Farben stecken in den Eckpunkten */
function bodenGeometrie() {
  const g = new THREE.PlaneGeometry(96, 96, 64, 64);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const dunkel = new THREE.Color(FARBE.boden);
  const hell = new THREE.Color(FARBE.bodenHell);
  const moos = new THREE.Color(FARBE.lichtung);
  const erde = new THREE.Color(FARBE.erde);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, bodenHoehe(x, z));
    const r = Math.hypot(x, z);
    // "Rauschen" aus überlagerten Wellen: unregelmäßige Flecken ohne Bilddatei
    const fleck = (Math.sin(x * 0.9 + z * 0.4) + Math.sin(x * 0.37 - z * 1.1) + Math.sin(z * 0.6 + 1.7)) / 3;
    c.copy(dunkel).lerp(hell, 0.5 + fleck * 0.5);
    if (fleck < -0.45) c.lerp(erde, 0.5);
    // moosig-hellere Lichtung um die Hütte, weicher Übergang zum Wald
    const lichtung = 1 - THREE.MathUtils.smoothstep(r, 4.5, 7.5);
    c.lerp(moos, lichtung * 0.8);
    farben.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  g.computeVertexNormals();
  return g;
}

/** Sandiger Weg als Band entlang wegX, mit ausgefransten Rändern */
function wegGeometrie() {
  const punkte: number[] = [];
  const index: number[] = [];
  const schritte = 40;
  for (let i = 0; i <= schritte; i++) {
    const z = WEG.von + ((WEG.bis - WEG.von) * i) / schritte;
    const breite = WEG.breite * (0.8 + Math.sin(i * 1.7) * 0.12) * (1 - (i / schritte) * 0.3);
    const x = wegX(z);
    punkte.push(x - breite, 0.012, z, x + breite, 0.012, z);
    if (i > 0) {
      const a = (i - 1) * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(punkte, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

// ---------- Komponente ----------

type Props = { startwert: number; stimmung: Stimmung; ruhig: boolean };

export function LichtungDetails({ startwert, stimmung, ruhig }: Props) {
  const gruppe = useRef<THREE.Group>(null);

  const teile = useMemo(() => baueTeile(startwert), [startwert]);

  // Details sollen Tipps nicht abfangen (Bäume und Runensteine dahinter bleiben antippbar)
  useEffect(() => {
    gruppe.current?.traverse((o) => {
      o.raycast = () => {};
    });
  }, [teile]);

  useFrame((_, dt) => {
    if (!ruhig) WIND.value += dt;
  });

  return (
    <group ref={gruppe}>
      <mesh geometry={teile.boden} material={teile.bodenMaterial} />
      <mesh geometry={teile.weg} material={matt(FARBE.sand)} />
      {teile.meshes.map((m) => (
        <primitive key={m.uuid} object={m} />
      ))}
      <Tuempel ruhig={ruhig} mond={stimmung.sterne} />
      <Ausstattung fenster={stimmung.fenster} ruhig={ruhig} />
      <Himmelslicht stimmung={stimmung} ruhig={ruhig} />
    </group>
  );
}

/** Alle Instanzen einmal pro Naturraum aufbauen */
function baueTeile(s: number) {
  const gras = streuen(s + 1, 900, 2.2, 15, { haufen: 1.2, groesse: [0.7, 1.4] });
  const farne = streuen(s + 2, 70, 5, 14, { haufen: 1.6, rand: 0.3, groesse: [0.8, 1.6] });
  const moos = streuen(s + 3, 90, 3, 13, { haufen: 1, groesse: [0.15, 0.4] });
  const blumen = streuen(s + 4, 180, 2.6, 10, { haufen: 0.9, groesse: [0.8, 1.3] });
  const steine = streuen(s + 5, 45, 2.8, 15, { rand: 0.2, groesse: [0.1, 0.42] });
  const pilze = streuen(s + 6, 36, 4.5, 12, { haufen: 0.45, rand: 0.2, groesse: [0.08, 0.17] });
  const straeucher = straeucherPlaetze(s);
  const tritt = trittsteine(s + 8);
  // erst hinter der Kamerabahn (Abstand 17), sonst stünden Bäume direkt vor der Linse
  const laub = streuen(s + 10, 650, 2.4, 15, { haufen: 1.8, groesse: [0.06, 0.11] });
  const zweige = streuen(s + 11, 90, 3, 14, { groesse: [0.3, 0.8] });
  const zapfen = streuen(s + 12, 80, 4.5, 14, { haufen: 1.2, groesse: [0.05, 0.08] });
  const fliegenpilzPunkte = punkteAufFliegenpilzen(pilze, s + 13);
  const ring = hexenring(s + 14);
  const grosseSteine = steine.filter((d) => d.groesse > 0.28);
  const ferneBaeume = streuen(s + 9, 190, 19.5, 42, { groesse: [0.8, 1.5] });

  const meshes: THREE.Object3D[] = [
    instanzen(grasGeometrie(), windMaterial(0.5), gras, () => {}, FARBE.gras),
    instanzen(farnGeometrie(), windMaterial(0.25), farne, () => {}, FARBE.farn),
    instanzen(
      FORM.kugelFein,
      matt('#ffffff'),
      moos,
      (d, o) => o.scale.set(d.groesse * 1.6, d.groesse * 0.35, d.groesse),
      FARBE.moos,
    ),
    // Blumen: Stängel und Blüte teilen sich die Position
    instanzen(
      HALM,
      windMaterial(0.9),
      blumen,
      (d, o) => {
        o.position.y = 0.12 * d.groesse;
        o.scale.set(1, 0.24 * d.groesse, 1);
      },
      [FARBE.gras[1]],
    ),
    instanzen(
      BLUETE,
      windMaterial(0.9),
      blumen,
      (d, o) => {
        o.position.y = 0.24 * d.groesse;
        o.scale.setScalar(d.groesse * 0.8);
      },
      FARBE.blume,
    ),
    instanzen(
      FELS,
      new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      [...steine, ...tritt.map((t) => ({ ...t, ton: 0.4 }))],
      (d, o) => {
        const flach = d.groesse < 0.3 && Math.abs(d.x - wegX(d.z)) < WEG.breite + 0.1;
        o.position.y = flach ? 0.01 : d.groesse * 0.25;
        o.scale.set(d.groesse * 1.2, d.groesse * (flach ? 0.18 : 0.7), d.groesse);
        o.rotation.x = d.neigung;
      },
      FARBE.stein,
    ),
    // Pilze: Stiel und Hut
    instanzen(STIEL, matt(FARBE.stiel), pilze, (d, o) => {
      o.position.y = d.groesse * 0.5;
      o.scale.set(d.groesse * 0.8, d.groesse, d.groesse * 0.8);
      o.rotation.z = d.neigung * 0.4;
    }),
    instanzen(
      HUT,
      matt('#ffffff'),
      pilze,
      (d, o) => {
        o.position.y = d.groesse * 0.95;
        o.scale.set(d.groesse * 0.65, d.groesse * 0.4, d.groesse * 0.65);
        o.rotation.z = d.neigung * 0.4;
      },
      FARBE.pilz,
    ),
    // weiße Tupfen auf den roten Hüten (Fliegenpilz)
    instanzen(BLUETE, matt(FARBE.punkte), fliegenpilzPunkte, (d, o) => {
      o.position.y = d.neigung;
      o.scale.setScalar(d.groesse);
    }),
    // Hexenring: kleine helle Pilze im Kreis
    instanzen(STIEL, matt(FARBE.stiel), ring, (d, o) => {
      o.position.y = d.groesse * 0.5;
      o.scale.set(d.groesse * 0.7, d.groesse, d.groesse * 0.7);
    }),
    instanzen(HUT, matt(FARBE.pilz[3]), ring, (d, o) => {
      o.position.y = d.groesse * 0.95;
      o.scale.set(d.groesse * 0.55, d.groesse * 0.35, d.groesse * 0.55);
    }),
    // Moospolster oben auf den großen Steinen
    instanzen(
      FORM.kugelFein,
      matt('#ffffff'),
      grosseSteine,
      (d, o) => {
        o.position.y = d.groesse * 0.62;
        o.scale.set(d.groesse * 0.8, d.groesse * 0.22, d.groesse * 0.7);
      },
      FARBE.moos,
    ),
    // Falllaub, Zweige und Zapfen am Boden
    instanzen(
      BLATT,
      new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }),
      laub,
      (d, o) => {
        o.position.y = 0.02 + d.ton * 0.01;
        o.rotation.set(d.neigung * 0.6, d.drehung, d.neigung * 0.4);
      },
      FARBE.laub,
    ),
    instanzen(FORM.stamm, matt(FARBE.rinde), zweige, (d, o) => {
      o.position.y = 0.025;
      o.rotation.set(Math.PI / 2, d.drehung, 0);
      o.scale.set(0.025, d.groesse, 0.025);
    }),
    instanzen(FORM.kegel, matt(FARBE.zapfen), zapfen, (d, o) => {
      o.position.y = d.groesse * 0.45;
      o.rotation.set(Math.PI / 2, d.drehung, 0);
      o.scale.set(d.groesse * 0.45, d.groesse, d.groesse * 0.45);
    }),
    // niedrige Sträucher (Polster aus Laub)
    instanzen(
      FORM.kugelFein,
      matt('#ffffff'),
      straeucher,
      (d, o) => {
        o.position.y = d.groesse * 0.45;
        o.scale.set(d.groesse * 1.3, d.groesse, d.groesse * 1.1);
      },
      FARBE.farn,
    ),
    // Wald am Horizont: gemalte Fichten-Umrisse auf den Hügeln (zwei gekreuzte Karten je Baum), im Nebel verschwimmend
    instanzen(
      FERNBAUM,
      new THREE.MeshLambertMaterial({
        color: '#ffffff',
        map: blattTextur('fernbaum'),
        alphaTest: 0.5,
        side: THREE.DoubleSide,
      }),
      ferneBaeume,
      (d, o) => {
        o.position.y = bodenHoehe(d.x, d.z) - 0.1;
        o.scale.set(3.4 * d.groesse, 8 * d.groesse, 3.4 * d.groesse);
      },
      FARBE.wald,
    ),
  ];

  return {
    boden: bodenGeometrie(),
    bodenMaterial: new THREE.MeshLambertMaterial({ vertexColors: true }),
    weg: wegGeometrie(),
    meshes,
  };
}

/** Weiße Tupfen auf den roten Pilzhüten. `neigung` trägt hier die Höhe (y). */
function punkteAufFliegenpilzen(pilze: Detail[], startwert: number): Detail[] {
  const rnd = zufall(startwert);
  const liste: Detail[] = [];
  for (const p of pilze) {
    // nur Hüte in der ersten Farbe der Palette (rot)
    if (Math.floor(p.ton * FARBE.pilz.length) % FARBE.pilz.length !== 0) continue;
    for (let i = 0; i < 6; i++) {
      const w = rnd() * Math.PI * 2;
      const phi = 0.25 + rnd() * 0.9; // vom Scheitel Richtung Rand
      liste.push({
        x: p.x + Math.sin(phi) * Math.cos(w) * p.groesse * 0.65,
        z: p.z + Math.sin(phi) * Math.sin(w) * p.groesse * 0.65,
        neigung: p.groesse * 0.95 + Math.cos(phi) * p.groesse * 0.4,
        groesse: p.groesse * 0.12,
        drehung: 0,
        ton: 0,
      });
    }
  }
  return liste;
}

/** Pilze im Kreis um die Mitte des Hexenrings */
function hexenring(startwert: number): Detail[] {
  const rnd = zufall(startwert);
  const h = AUSSTATTUNG.hexenring;
  return Array.from({ length: 16 }, (_, i) => {
    const w = (i / 16) * Math.PI * 2 + (rnd() - 0.5) * 0.25;
    const r = h.r * (0.92 + rnd() * 0.16);
    return {
      x: h.x + Math.cos(w) * r,
      z: h.z + Math.sin(w) * r,
      groesse: 0.07 + rnd() * 0.05,
      drehung: 0,
      neigung: 0,
      ton: 0,
    };
  });
}

// ---------- Tümpel ----------

const WASSER = new THREE.MeshPhongMaterial({ color: FARBE.wasser, specular: colors.fog, shininess: 90 });

function Tuempel({ ruhig, mond }: { ruhig: boolean; mond: number }) {
  const spiegel = useRef<THREE.Sprite>(null);
  const spiegelMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: colors.moon,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const schilf = useMemo(() => {
    const rnd = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const liste: Detail[] = [];
    for (let i = 0; i < 46; i++) {
      // Schilf nur am hinteren und rechten Ufer, vorne bleibt der Blick aufs Wasser frei
      const w = -Math.PI * 0.9 + (i / 46) * Math.PI * 1.4 + rnd(i) * 0.1;
      const r = 1.02 + Math.abs(rnd(i + 7)) * 0.25;
      liste.push({
        x: TUEMPEL.x + Math.cos(w) * TUEMPEL.rx * r,
        z: TUEMPEL.z + Math.sin(w) * TUEMPEL.rz * r,
        groesse: 0.7 + Math.abs(rnd(i + 3)) * 0.6,
        drehung: 0,
        neigung: rnd(i + 5) * 0.3,
        ton: Math.abs(rnd(i + 9)),
      });
    }
    const blaetter: Detail[] = [
      [0.3, 0.2],
      [-0.25, -0.1],
      [0.05, 0.35],
      [-0.45, 0.25],
      [0.5, -0.2],
    ].map(([dx, dz], i) => ({
      x: TUEMPEL.x + dx * TUEMPEL.rx,
      z: TUEMPEL.z + dz * TUEMPEL.rz,
      groesse: 0.13 + i * 0.015,
      drehung: i * 1.3,
      neigung: 0,
      ton: 0,
    }));
    return [
      instanzen(
        HALM,
        windMaterial(0.35),
        liste,
        (d, o) => {
          o.position.y = 0.55 * d.groesse;
          o.scale.set(2.2, 1.1 * d.groesse, 2.2);
          o.rotation.set(d.neigung, 0, d.neigung * 0.5);
        },
        [FARBE.schilf],
      ),
      instanzen(
        STIEL,
        windMaterial(0.35),
        liste.filter((_, i) => i % 3 === 0),
        (d, o) => {
          o.position.y = 1.0 * d.groesse;
          o.scale.set(0.12, 0.2, 0.12);
          o.rotation.set(d.neigung, 0, d.neigung * 0.5);
        },
        [FARBE.kolben],
      ),
      instanzen(SCHEIBE, matt(FARBE.seerose), blaetter, (_, o) => {
        o.position.y = 0.035;
        o.rotation.x = -Math.PI / 2;
      }),
    ];
  }, []);

  useFrame(({ clock }) => {
    const s = spiegel.current;
    if (!s) return;
    const t = ruhig ? 0 : clock.elapsedTime;
    (s.material as THREE.SpriteMaterial).opacity = (0.08 + 0.22 * mond) * (0.75 + Math.sin(t * 1.7) * 0.25);
    s.position.x = TUEMPEL.x - 0.2 + Math.sin(t * 0.4) * 0.12;
  });

  return (
    <group>
      {/* schlammiger Uferrand, dann das Wasser */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[TUEMPEL.x, 0.015, TUEMPEL.z]}
        scale={[TUEMPEL.rx * 1.18, TUEMPEL.rz * 1.22, 1]}
        material={matt(FARBE.erde)}
        geometry={SCHEIBE}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[TUEMPEL.x, 0.025, TUEMPEL.z]}
        scale={[TUEMPEL.rx, TUEMPEL.rz, 1]}
        material={WASSER}
        geometry={SCHEIBE}
      />
      <sprite
        ref={spiegel}
        material={spiegelMat}
        position={[TUEMPEL.x - 0.2, 0.06, TUEMPEL.z + 0.1]}
        scale={[1.1, 0.35, 1]}
      />
      {schilf.map((m) => (
        <primitive key={m.uuid} object={m} />
      ))}
    </group>
  );
}

// ---------- Holzstapel, Hackklotz, Laterne, umgestürzter Stamm, Baumstümpfe ----------

function Ausstattung({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  const a = AUSSTATTUNG;
  const licht = useRef<THREE.Sprite>(null);
  const lichtMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: colors.amber,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  useFrame(({ clock }) => {
    if (!licht.current) return;
    const t = ruhig ? 0 : clock.elapsedTime;
    const flackern = 0.85 + Math.sin(t * 9) * 0.06 + Math.sin(t * 23) * 0.04;
    (licht.current.material as THREE.SpriteMaterial).opacity = (0.35 + 0.65 * fenster) * flackern;
  });

  return (
    <>
      {/* Holzstapel: drei Lagen Scheite, Stirnseiten hell */}
      <group position={[a.holzstapel.x, 0, a.holzstapel.z]} rotation={[0, a.holzstapel.drehung, 0]}>
        {[0, 1, 2].flatMap((lage) =>
          [0, 1, 2, 3].slice(lage).map((i) => (
            <group
              key={`${lage}-${i}`}
              position={[(i - 1.5 + lage * 0.5) * 0.24 - lage * 0.12, 0.12 + lage * 0.21, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <mesh geometry={FORM.stamm} material={matt(FARBE.holz)} scale={[0.12, 0.9, 0.12]} />
              <mesh
                geometry={SCHEIBE}
                material={matt(FARBE.holzHell)}
                position={[0, 0.451, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={0.1}
              />
            </group>
          )),
        )}
      </group>
      {/* Hackklotz mit Jahresringen */}
      <group position={[a.hackklotz.x, 0, a.hackklotz.z]}>
        <mesh geometry={FORM.stamm} material={matt(FARBE.rinde)} position={[0, 0.2, 0]} scale={[0.28, 0.4, 0.28]} />
        <mesh
          geometry={SCHEIBE}
          material={matt(FARBE.holzHell)}
          position={[0, 0.401, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.22}
        />
      </group>
      {/* Laterne am Pfahl neben dem Weg */}
      <group position={[a.laterne.x, 0, a.laterne.z]}>
        <mesh geometry={FORM.stamm} material={matt(FARBE.rinde)} position={[0, 0.7, 0]} scale={[0.06, 1.4, 0.06]} />
        <mesh
          geometry={FORM.kiste}
          material={matt(FARBE.rinde)}
          position={[-0.15, 1.36, 0]}
          scale={[0.34, 0.04, 0.04]}
        />
        <mesh
          geometry={FORM.kiste}
          material={matt(colors.amber)}
          position={[-0.28, 1.2, 0]}
          scale={[0.12, 0.18, 0.12]}
        />
        <mesh geometry={FORM.kegel} material={matt(FARBE.rinde)} position={[-0.28, 1.33, 0]} scale={[0.1, 0.08, 0.1]} />
        <sprite ref={licht} material={lichtMat} position={[-0.28, 1.2, 0]} scale={[1.3, 1.3, 1]} />
      </group>
      {/* umgestürzter, bemooster Stamm mit Baumpilzen */}
      <group position={[a.stamm.x, 0.28, a.stamm.z]} rotation={[0, a.stamm.drehung, Math.PI / 2]}>
        <mesh geometry={FORM.stamm} material={matt(FARBE.rinde)} scale={[0.3, 3.2, 0.3]} />
        <mesh
          geometry={FORM.kugelFein}
          material={matt(FARBE.moos[0])}
          position={[0.2, 0.4, 0]}
          scale={[0.14, 0.9, 0.24]}
        />
        <mesh
          geometry={FORM.kugelFein}
          material={matt(FARBE.moos[1])}
          position={[0.22, -0.9, 0.05]}
          scale={[0.12, 0.5, 0.2]}
        />
        {[-0.3, 0.1, 0.55].map((y, i) => (
          <mesh
            key={i}
            geometry={HUT}
            material={matt(FARBE.pilz[2])}
            position={[0.05, y, 0.3]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[0.14 - i * 0.02, 0.07, 0.1]}
          />
        ))}
      </group>
      {/* Baumstümpfe */}
      {a.stuempfe.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]}>
          <mesh geometry={FORM.stamm} material={matt(FARBE.rinde)} position={[0, 0.17, 0]} scale={[0.32, 0.34, 0.32]} />
          <mesh
            geometry={SCHEIBE}
            material={matt(FARBE.holzHell)}
            position={[0, 0.341, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.25}
          />
          <mesh
            geometry={FORM.kugelFein}
            material={matt(FARBE.moos[2])}
            position={[0.2, 0.12, 0.1]}
            scale={[0.16, 0.12, 0.2]}
          />
        </group>
      ))}
      {/* Zaun aus gespaltenen Stangen hinter der Hütte */}
      <group position={[0, 0, a.zaun.z]}>
        {Array.from({ length: 7 }, (_, i) => {
          const x = a.zaun.von + ((a.zaun.bis - a.zaun.von) * i) / 6;
          return (
            <mesh
              key={i}
              geometry={FORM.stamm}
              material={matt(FARBE.holz)}
              position={[x, 0.42, (i % 2) * 0.05]}
              rotation={[0, 0, (i % 3) * 0.04 - 0.04]}
              scale={[0.05, 0.84, 0.05]}
            />
          );
        })}
        {[0.35, 0.68].map((y, i) => (
          <mesh
            key={y}
            geometry={FORM.stamm}
            material={matt(FARBE.holzHell)}
            position={[0, y, 0.04]}
            rotation={[0, 0, Math.PI / 2 + (i === 0 ? 0.02 : -0.03)]}
            scale={[0.035, a.zaun.bis - a.zaun.von + 0.2, 0.035]}
          />
        ))}
      </group>
      {/* Bank neben der Tür */}
      <group position={[a.bank.x, 0, a.bank.z]}>
        <mesh geometry={FORM.kiste} material={matt(FARBE.holzHell)} position={[0, 0.34, 0]} scale={[0.9, 0.06, 0.28]} />
        {[-0.36, 0.36].map((x) => (
          <mesh
            key={x}
            geometry={FORM.kiste}
            material={matt(FARBE.holz)}
            position={[x, 0.16, 0]}
            scale={[0.08, 0.32, 0.24]}
          />
        ))}
      </group>
      {/* Regentonne mit Metallreifen und Wasser */}
      <group position={[a.regentonne.x, 0, a.regentonne.z]}>
        <mesh geometry={FORM.stamm} material={matt(FARBE.holz)} position={[0, 0.32, 0]} scale={[0.26, 0.64, 0.26]} />
        {[0.12, 0.5].map((y) => (
          <mesh
            key={y}
            geometry={FORM.stamm}
            material={matt(FARBE.stein[2])}
            position={[0, y, 0]}
            scale={[0.27, 0.04, 0.27]}
          />
        ))}
        <mesh
          geometry={SCHEIBE}
          material={WASSER}
          position={[0, 0.6, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.21}
        />
      </group>
      {/* Wegweiser: Pfahl mit zwei Brettern (ohne Schrift) */}
      <group position={[a.wegweiser.x, 0, a.wegweiser.z]} rotation={[0, 0.4, 0]}>
        <mesh geometry={FORM.stamm} material={matt(FARBE.rinde)} position={[0, 0.65, 0]} scale={[0.06, 1.3, 0.06]} />
        <mesh
          geometry={FORM.kiste}
          material={matt(FARBE.holzHell)}
          position={[0.22, 1.12, 0]}
          rotation={[0, 0, 0.06]}
          scale={[0.5, 0.12, 0.03]}
        />
        <mesh
          geometry={FORM.kiste}
          material={matt(FARBE.holz)}
          position={[-0.2, 0.9, 0]}
          rotation={[0, 0.5, -0.05]}
          scale={[0.46, 0.11, 0.03]}
        />
        <mesh
          geometry={FORM.kugelFein}
          material={matt(FARBE.moos[1])}
          position={[0, 0.06, 0]}
          scale={[0.18, 0.08, 0.18]}
        />
      </group>
      {/* Steinplatte vor der Tür */}
      <mesh geometry={PLATTE} material={matt(FARBE.stein[1])} position={[-0.45, 0.04, 1.3]} scale={[0.45, 0.5, 0.3]} />
    </>
  );
}

// ---------- Mond und Lichtstrahlen ----------

const STRAHL = new THREE.CylinderGeometry(0.08, 0.5, 16, 8, 1, true);
STRAHL.translate(0, -8, 0); // Ursprung oben, Strahl fällt nach unten

/** Wo die Lichtstrahlen auf den Boden treffen */
const STRAHL_ZIELE: [number, number][] = [
  [1.5, 2.6],
  [-2.2, 1.2],
  [3.2, -0.8],
  [-0.6, -3.4],
  [0.4, 5.2],
];

/** Drehung der Strahlen und wo ihr Fuß relativ zum Kopf liegt (je tiefer die Sonne, desto schräger) */
function strahlLage(lichtHoehe: number) {
  const neigung = 0.35 + (1 - lichtHoehe) * 0.35;
  const drehung = new THREE.Euler(-0.3 * neigung, 0, neigung);
  const fuss = new THREE.Vector3(0, -16, 0).applyEuler(drehung);
  return { drehung, fuss };
}

function Himmelslicht({ stimmung, ruhig }: { stimmung: Stimmung; ruhig: boolean }) {
  const strahlen = useRef<(THREE.Mesh | null)[]>([]);
  const nacht = stimmung.sterne;
  // Lichtfarbe: tagsüber Sonne, nachts kühler Mond
  const mats = useMemo(
    () =>
      STRAHL_ZIELE.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: stimmung.licht,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false,
          }),
      ),
    [stimmung.licht],
  );
  const mondMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: colors.moon, transparent: true, opacity: nacht, fog: false }),
    [nacht],
  );
  const hofMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: colors.moon,
        transparent: true,
        opacity: 0.45 * nacht,
        depthWrite: false,
        fog: false,
      }),
    [nacht],
  );

  // Strahlen fallen schräg aus Richtung des Lichts (wie in Atmosphaere: von links hinten oben)
  const lage = useMemo(() => strahlLage(stimmung.lichtHoehe), [stimmung.lichtHoehe]);
  useFrame(({ clock }) => {
    const t = ruhig ? 0 : clock.elapsedTime;
    strahlen.current.forEach((s, i) => {
      if (!s) return;
      // sehr zart: mehrere Strahlen überlagern sich, nachts nur ein Hauch Mondlicht
      const grund = (0.006 + 0.012 * Math.min(1, stimmung.lichtStaerke)) * (1 - 0.6 * nacht);
      (s.material as THREE.MeshBasicMaterial).opacity = grund * (0.6 + 0.4 * Math.sin(t * 0.35 + i * 1.9));
    });
  });

  return (
    <>
      {nacht > 0.05 && (
        <group position={[-34, 30, -46]}>
          <mesh material={mondMat}>
            <sphereGeometry args={[2, 16, 12]} />
          </mesh>
          <sprite material={hofMat} scale={[16, 16, 1]} />
        </group>
      )}
      {STRAHL_ZIELE.map(([x, z], i) => (
        <mesh
          key={i}
          ref={(m) => {
            strahlen.current[i] = m;
          }}
          geometry={STRAHL}
          material={mats[i]}
          // Kopf oben im Himmel, Fuß genau auf dem Zielpunkt am Boden
          position={[x - lage.fuss.x, -lage.fuss.y, z - lage.fuss.z]}
          rotation={lage.drehung}
        />
      ))}
    </>
  );
}
