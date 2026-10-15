import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { baumById } from '@/data/baumarten';
import { zufall } from '@/logic/lichtung';
import type { Detail } from '@/logic/lichtungDetails';
import type { Stimmung } from '@/logic/tageszeit';
import type { Umgebung } from '@/data/tierSeiten';

import { Baum3D } from './Baum3D';
import { blattTextur } from './blattTexturen';
import {
  BLUETE,
  FELS,
  farnGeometrie,
  grasGeometrie,
  HALM,
  instanzen,
  windMaterial,
  windWeiter,
} from './LichtungDetails';
import { FORM, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Lebensraum hinter dem Tier auf der Artenseite (Hero): ein Waldrand.
 * Vorne Wiese mit Gras und Blumen, dahinter eine Hecke aus Sträuchern, dann zwei Reihen
 * Laubbäume aus dem Baum-Generator, alles im Nebel der aktuellen Tageszeit.
 *
 * Kamera der Bühne (mit Umgebung): bei (0, 1,7, 7,2), schaut auf (0, 1,1, 0). Das Tier steht in der Mitte;
 * +z ist vorn (zur Kamera), −z ist hinten (Waldrand).
 */

// Farben der Umgebung (gedämpft, wie auf der Lichtung)
const FARBE = {
  wiese: '#2E4430',
  wieseHell: '#3C5A3A',
  waldboden: '#1A2620',
  gras: ['#3D5A45', '#4A6B48', '#33503C', '#5A7346', '#56703F'],
  blume: ['#D9E0E6', '#E9C46A', '#B79CE0', '#C7D6E8', '#E8B86A'],
  farn: ['#2F5338', '#3A6240', '#294A33'],
  hecke: ['#22402C', '#2A4A30', '#1E3826', '#30543A'],
  beere: '#8E2F2F',
  stein: ['#4B514C', '#585E57'],
};

/** Bäume am Waldrand: heimische Laubbäume (passt zum Lebensraum Waldrand/Hecke) */
const WALDRAND_BAEUME = ['rotbuche', 'stieleiche', 'hainbuche', 'sandbirke', 'bergahorn', 'vogelkirsche'];

export function Lebensraum3D({ stimmung, ruhig }: { umgebung: Umgebung; stimmung: Stimmung; ruhig: boolean }) {
  const gruppe = useRef<THREE.Group>(null);
  const teile = useMemo(() => baueWaldrand(), []);
  const baeume = useMemo(() => baumPlaetze(), []);

  // Deko soll das Drehen des Tiers nicht stören
  useEffect(() => {
    gruppe.current?.traverse((o) => {
      o.raycast = () => {};
    });
  }, [teile]);

  useFrame((_, dt) => {
    if (!ruhig) windWeiter(dt);
  });

  return (
    <group ref={gruppe}>
      <mesh geometry={teile.boden} material={teile.bodenMaterial} />
      {teile.meshes.map((m) => (
        <primitive key={m.uuid} object={m} />
      ))}
      {baeume.map((b, i) => (
        <Baum3D
          key={i}
          id={`umgebung-${i}`}
          modell={baumById[b.id].modell}
          gefunden
          position={[b.x, 0, b.z]}
          skala={b.skala}
          drehung={b.drehung}
          ruhig={ruhig}
          antippbar={false}
        />
      ))}
      <Schwebelichter anteil={stimmung.gluehwuermchen} farbe={stimmung.licht} ruhig={ruhig} />
    </group>
  );
}

/** Zwei Baumreihen hinter der Hecke, die Mitte etwas lichter (dort steht das Tier im Bild) */
function baumPlaetze() {
  const rnd = zufall(4711);
  const liste: { id: string; x: number; z: number; skala: number; drehung: number }[] = [];
  for (const [z0, anzahl, skala] of [
    [-8.5, 9, 1.5],
    [-13.5, 13, 2],
  ] as const) {
    for (let i = 0; i < anzahl; i++) {
      const breite = z0 < -10 ? 34 : 26;
      const x = -breite / 2 + (breite * (i + 0.5)) / anzahl + (rnd() - 0.5) * 1.6;
      liste.push({
        id: WALDRAND_BAEUME[Math.floor(rnd() * WALDRAND_BAEUME.length)],
        x,
        z: z0 + (rnd() - 0.5) * 1.8,
        skala: skala * (0.8 + rnd() * 0.4),
        drehung: rnd() * Math.PI * 2,
      });
    }
  }
  return liste;
}

/** Streut Details in eine Fläche; `passt` entscheidet, ob ein Punkt erlaubt ist */
function streue(
  startwert: number,
  anzahl: number,
  passt: (x: number, z: number) => boolean,
  groesse: [number, number],
): Detail[] {
  const rnd = zufall(startwert);
  const liste: Detail[] = [];
  let versuche = 0;
  while (liste.length < anzahl && versuche++ < anzahl * 40) {
    const x = (rnd() - 0.5) * 24;
    const z = 5.5 - rnd() * 13;
    if (!passt(x, z)) continue;
    liste.push({
      x,
      z,
      groesse: groesse[0] + rnd() * (groesse[1] - groesse[0]),
      drehung: rnd() * Math.PI * 2,
      neigung: (rnd() - 0.5) * 0.4,
      ton: rnd(),
    });
  }
  return liste;
}

/** Boden: Wiese vorne, nach hinten dunkler Waldboden, sanfte Wellen */
function bodenGeometrie() {
  const g = new THREE.CircleGeometry(30, 64, 0, Math.PI * 2);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  const wiese = new THREE.Color(FARBE.wiese);
  const hell = new THREE.Color(FARBE.wieseHell);
  const wald = new THREE.Color(FARBE.waldboden);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, Math.sin(x * 0.4) * Math.cos(z * 0.35) * 0.08 + (z < -4 ? (-z - 4) * 0.04 : 0));
    // 0 = Wiese, 1 = Waldboden (Übergang an der Hecke)
    const t = Math.min(1, Math.max(0, (-z - 2.5) / 3));
    c.copy(wiese)
      .lerp(hell, Math.max(0, Math.sin(x * 0.7 + z * 0.5)) * 0.4)
      .lerp(wald, t);
    farben.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  g.computeVertexNormals();
  return g;
}

function baueWaldrand() {
  const mitteFrei = (x: number, z: number) => Math.hypot(x, z) > 1.05; // dort stehen die Hufe
  const wiese = (x: number, z: number) => z > -4 && z < 5 && mitteFrei(x, z);
  const gras = streue(11, 1100, wiese, [0.6, 1.3]);
  const blumen = streue(12, 160, (x, z) => wiese(x, z) && Math.abs(x) > 0.6, [0.8, 1.2]);
  const farne = streue(13, 70, (x, z) => z < -3 && z > -5, [0.9, 1.6]);
  const hecke = streue(14, 70, (x, z) => z < -4 && z > -6.5, [0.5, 1]);
  const steine = streue(15, 14, (x, z) => wiese(x, z) && Math.hypot(x, z) > 1.8, [0.1, 0.28]);
  const beeren = hecke.filter((_, i) => i % 3 === 0);

  const meshes: THREE.Object3D[] = [
    instanzen(grasGeometrie(), windMaterial(0.5), gras, () => {}, FARBE.gras),
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
    instanzen(farnGeometrie(), windMaterial(0.25), farne, () => {}, FARBE.farn),
    // Hecke: dunkler Kern, darüber viele gemalte Blattzweige (wie bei den Bäumen)
    instanzen(FORM.kugelFein, matt(FARBE.hecke[2]), hecke, (d, o) => {
      o.position.y = d.groesse * 0.5;
      o.scale.set(d.groesse * 1.2, d.groesse * 0.85, d.groesse * 0.95);
    }),
    heckenLaub(hecke),
    // Beeren an einigen Sträuchern
    instanzen(BLUETE, matt(FARBE.beere), beeren, (d, o) => {
      o.position.set(d.x + d.groesse * 0.6, d.groesse * 0.8, d.z + d.groesse * 0.7);
      o.scale.setScalar(0.9);
    }),
    instanzen(
      FELS,
      new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      steine,
      (d, o) => {
        o.position.y = d.groesse * 0.2;
        o.scale.set(d.groesse * 1.2, d.groesse * 0.6, d.groesse);
      },
      FARBE.stein,
    ),
  ];

  return { boden: bodenGeometrie(), bodenMaterial: new THREE.MeshLambertMaterial({ vertexColors: true }), meshes };
}

/** Blattzweige rund um jeden Heckenstrauch: ein InstancedMesh mit gemalter Laub-Textur */
const ZWEIGE_JE_STRAUCH = 26;
const ZWEIG = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);

function heckenLaub(hecke: Detail[]) {
  const rnd = zufall(77);
  const zweige: Detail[] = [];
  const lagen: { x: number; y: number; z: number; rx: number; ry: number; s: number }[] = [];
  for (const d of hecke) {
    for (let k = 0; k < ZWEIGE_JE_STRAUCH; k++) {
      // Punkt auf einem gedrückten Ellipsoid um den Strauch
      const w = rnd() * Math.PI * 2;
      const h = rnd() * 0.9 + 0.1;
      const r = Math.sqrt(1 - (h - 0.5) * (h - 0.5) * 3.2);
      lagen.push({
        x: d.x + Math.cos(w) * r * d.groesse * 1.15,
        y: h * d.groesse * 1.1,
        z: d.z + Math.sin(w) * r * d.groesse * 0.95,
        rx: (rnd() - 0.5) * 1.6,
        ry: w + Math.PI / 2 + (rnd() - 0.5),
        s: d.groesse * (0.55 + rnd() * 0.3),
      });
      zweige.push({ ...d, ton: rnd() });
    }
  }
  const mat = new THREE.MeshLambertMaterial({
    color: '#ffffff',
    map: blattTextur('laub'),
    alphaTest: 0.5,
    side: THREE.DoubleSide,
  });
  let i = 0;
  return instanzen(
    ZWEIG,
    mat,
    zweige,
    (_, o) => {
      const l = lagen[i++];
      o.position.set(l.x, l.y, l.z);
      o.rotation.set(l.rx, l.ry, 0);
      o.scale.setScalar(l.s);
    },
    FARBE.hecke,
  );
}

/** Glühwürmchen bzw. Lichtstaub, der über der Wiese schwebt (je nach Tageszeit) */
const LICHTER = 18;

function Schwebelichter({ anteil, farbe, ruhig }: { anteil: number; farbe: string; ruhig: boolean }) {
  const punkte = useRef<THREE.Points>(null);
  const basis = useMemo(() => {
    const rnd = zufall(99);
    return Array.from({ length: LICHTER }, () => ({
      x: (rnd() - 0.5) * 9,
      y: 0.4 + rnd() * 2,
      z: -3 + rnd() * 5,
      p: rnd() * 10,
    }));
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(LICHTER * 3), 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: farbe,
        size: 0.12,
        transparent: true,
        opacity: 0.8 * anteil,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [farbe, anteil],
  );

  useFrame(({ clock }) => {
    const p = punkte.current;
    if (!p) return;
    const t = ruhig ? 0 : clock.elapsedTime;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    basis.forEach((b, i) => {
      pos.setXYZ(
        i,
        b.x + Math.sin(t * 0.3 + b.p) * 0.5,
        b.y + Math.sin(t * 0.7 + b.p * 2) * 0.25,
        b.z + Math.cos(t * 0.25 + b.p) * 0.5,
      );
    });
    pos.needsUpdate = true;
  });

  if (anteil < 0.15) return null;
  return <points ref={punkte} geometry={geo} material={mat} raycast={() => {}} />;
}
