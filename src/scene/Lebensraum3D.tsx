import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { baumById } from '@/data/baumarten';
import { zufall } from '@/logic/lichtung';
import type { Detail } from '@/logic/lichtungDetails';
import type { Stimmung } from '@/logic/tageszeit';
import type { Extra, Umgebung } from '@/data/tierSeiten';

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
 * Lebensraum hinter dem Tier auf der Artenseite (Hero), passend zum Tier:
 * - waldrand: vorne Wiese mit Gras und Blumen, dahinter Hecke, dann zwei Reihen Laubbäume
 * - wald: Waldboden mit Farnen und Unterholz, Bäume rundherum und dichter
 * - feld: Getreidereihen und Wiese, hinten eine Hecke, nur wenige Bäume
 * - ufer: Wiese am Ufer, Schilf, dahinter ein Wasserlauf, am anderen Ufer Weiden, Pappeln und Erlen
 * Dazu Extras wie Fuchsbau, Suhle, Biberburg, Kobel oder Laubnest. Alles im Nebel der aktuellen Tageszeit.
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
  acker: '#3A3524',
  getreide: ['#8A7A44', '#9A8A50', '#7A6C3C'],
  schilf: ['#5A6B3E', '#4E5E36'],
  kolben: '#4A3424',
  wasser: '#16282C',
  laub: ['#5A3E2A', '#6B4A2E', '#7A5A30', '#4E3A26'],
};

/** Bäume je Umgebung: heimische Arten, die dort typisch wachsen */
const BAEUME: Record<Umgebung, string[]> = {
  waldrand: ['rotbuche', 'stieleiche', 'hainbuche', 'sandbirke', 'bergahorn', 'vogelkirsche'],
  wald: ['rotbuche', 'stieleiche', 'traubeneiche', 'hainbuche', 'waldkiefer', 'bergahorn'],
  feld: ['stieleiche', 'vogelkirsche', 'feldahorn'],
  ufer: ['silberweide', 'salweide', 'zitterpappel', 'schwarzerle'],
};

export function Lebensraum3D({
  umgebung,
  stimmung,
  ruhig,
  extras = [],
}: {
  umgebung: Umgebung;
  stimmung: Stimmung;
  ruhig: boolean;
  extras?: Extra[];
}) {
  const gruppe = useRef<THREE.Group>(null);
  const teile = useMemo(() => baueUmgebung(umgebung), [umgebung]);
  const baeume = useMemo(() => baumPlaetze(umgebung), [umgebung]);

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
      {umgebung === 'ufer' && <Wasser />}
      {extras.includes('bau') && <Fuchsbau />}
      {extras.includes('suhle') && <Suhle />}
      {extras.includes('burg') && <Biberburg />}
      {extras.includes('kobel') && <Kobel />}
      {extras.includes('laubnest') && <Laubnest />}
      <Schwebelichter anteil={stimmung.gluehwuermchen} farbe={stimmung.licht} ruhig={ruhig} />
    </group>
  );
}

/** Baumreihen je Umgebung; die Mitte bleibt frei (dort steht das Tier im Bild) */
function baumPlaetze(umgebung: Umgebung) {
  const rnd = zufall(4711);
  const arten = BAEUME[umgebung];
  // [Abstand nach hinten, Anzahl, Größe, Breite der Reihe, Mitte frei bis |x|]
  const reihen: Record<Umgebung, [number, number, number, number, number][]> = {
    waldrand: [
      [-8.5, 9, 1.5, 26, 0],
      [-13.5, 13, 2, 34, 0],
    ],
    wald: [
      [-4.5, 6, 1.3, 20, 3.2],
      [-8, 10, 1.6, 28, 0],
      [-12.5, 13, 2, 34, 0],
    ],
    feld: [[-14, 6, 1.6, 36, 0]],
    ufer: [
      [-10.5, 10, 1.5, 30, 0],
      [-14.5, 12, 1.9, 36, 0],
    ],
  };
  const liste: { id: string; x: number; z: number; skala: number; drehung: number }[] = [];
  for (const [z0, anzahl, skala, breite, frei] of reihen[umgebung]) {
    for (let i = 0; i < anzahl; i++) {
      const x = -breite / 2 + (breite * (i + 0.5)) / anzahl + (rnd() - 0.5) * 1.6;
      if (Math.abs(x) < frei) continue;
      liste.push({
        id: arten[Math.floor(rnd() * arten.length)],
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

/** Boden: Wiese bzw. Acker vorne, nach hinten dunkler Waldboden, sanfte Wellen */
function bodenGeometrie(umgebung: Umgebung) {
  const g = new THREE.CircleGeometry(30, 64, 0, Math.PI * 2);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  const wiese = new THREE.Color(FARBE.wiese);
  const hell = new THREE.Color(FARBE.wieseHell);
  const wald = new THREE.Color(FARBE.waldboden);
  const acker = new THREE.Color(FARBE.acker);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, Math.sin(x * 0.4) * Math.cos(z * 0.35) * 0.08 + (z < -4 ? (-z - 4) * 0.04 : 0));
    // 0 = Wiese, 1 = Waldboden (Übergang an der Hecke); im Wald überall Waldboden, im Feld Acker hinten
    const t = umgebung === 'wald' ? 0.85 : umgebung === 'feld' ? 0 : Math.min(1, Math.max(0, (-z - 2.5) / 3));
    c.copy(wiese)
      .lerp(hell, Math.max(0, Math.sin(x * 0.7 + z * 0.5)) * 0.4)
      .lerp(wald, t);
    if (umgebung === 'feld' && z < -1) c.lerp(acker, Math.min(1, (-z - 1) / 2) * (0.7 + 0.3 * Math.sin(x * 6)));
    farben.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  g.computeVertexNormals();
  return g;
}

function baueUmgebung(umgebung: Umgebung) {
  const mitteFrei = (x: number, z: number) => Math.hypot(x, z) > 1.05; // dort stehen die Hufe
  const wald = umgebung === 'wald';
  const feld = umgebung === 'feld';
  const ufer = umgebung === 'ufer';
  // Wiese: im Feld nur vorn (dahinter Getreide), am Ufer bis ans Wasser
  const wiesenEnde = feld ? -1 : ufer ? -2.2 : -4;
  const wiese = (x: number, z: number) => z > wiesenEnde && z < 5 && mitteFrei(x, z);
  const gras = streue(11, wald ? 260 : 1100, wiese, [0.6, 1.3]);
  const blumen = streue(12, wald ? 30 : 160, (x, z) => wiese(x, z) && Math.abs(x) > 0.6, [0.8, 1.2]);
  const farne = streue(
    13,
    wald ? 170 : ufer ? 0 : 70,
    (x, z) => (wald ? mitteFrei(x, z) && z < 4 : z < -3 && z > -5),
    [0.9, 1.6],
  );
  const hecke = streue(
    14,
    wald ? 34 : ufer ? 0 : 70,
    (x, z) => (feld ? z < -6.5 && z > -8.5 : wald ? z < -2.5 && Math.abs(x) > 2.5 : z < -4 && z > -6.5),
    [0.5, 1],
  );
  const getreide = feld ? streue(16, 1400, (x, z) => z < -1.2 && z > -6.4, [0.8, 1.1]) : [];
  const schilf = ufer ? streue(17, 260, (x, z) => z < -1.6 && z > -2.8, [0.8, 1.3]) : [];
  const laub = wald ? streue(18, 500, mitteFrei, [0.06, 0.11]) : [];
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
    // Getreide: Halme mit Ähren, in Reihen leicht schwankend
    instanzen(
      HALM,
      windMaterial(0.6),
      getreide.map((d) => ({ ...d, x: Math.round(d.x * 3) / 3 })),
      (d, o) => {
        o.position.y = 0.45 * d.groesse;
        o.scale.set(1.6, 0.9 * d.groesse, 1.6);
      },
      FARBE.getreide,
    ),
    instanzen(
      FORM.kegel,
      windMaterial(0.6),
      getreide.map((d) => ({ ...d, x: Math.round(d.x * 3) / 3 })),
      (d, o) => {
        o.position.y = 0.92 * d.groesse;
        o.scale.set(0.02, 0.1, 0.02);
      },
      FARBE.getreide,
    ),
    // Schilf mit Rohrkolben am Wasser
    instanzen(
      HALM,
      windMaterial(0.35),
      schilf,
      (d, o) => {
        o.position.y = 0.7 * d.groesse;
        o.scale.set(2, 1.4 * d.groesse, 2);
        o.rotation.set(d.neigung * 0.4, 0, d.neigung * 0.3);
      },
      FARBE.schilf,
    ),
    instanzen(
      FORM.stamm,
      windMaterial(0.35),
      schilf.filter((_, i) => i % 4 === 0),
      (d, o) => {
        o.position.y = 1.25 * d.groesse;
        o.scale.set(0.035, 0.22, 0.035);
        o.rotation.set(d.neigung * 0.4, 0, d.neigung * 0.3);
      },
      [FARBE.kolben],
    ),
    // Falllaub im Wald
    instanzen(
      FORM.flach,
      new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }),
      laub,
      (d, o) => {
        o.position.y = 0.02;
        o.rotation.set(-Math.PI / 2 + d.neigung * 0.3, 0, d.drehung);
        o.scale.set(d.groesse, d.groesse * 1.6, 1);
      },
      FARBE.laub,
    ),
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

  return {
    boden: bodenGeometrie(umgebung),
    bodenMaterial: new THREE.MeshLambertMaterial({ vertexColors: true }),
    meshes,
  };
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

/** Fuchsbau rechts hinten am Waldrand: Erdhügel mit zwei dunklen Röhren und ausgescharrter Erde davor */
const BAU_ERDE = '#3A2E24';
const BAU_LOCH = '#0B0C0A';

function Fuchsbau() {
  return (
    <group position={[2.1, 0, -2.3]} rotation={[0, -0.4, 0]}>
      <mesh geometry={FORM.kugelFein} material={matt(BAU_ERDE)} position={[0, -0.05, 0]} scale={[1.4, 0.55, 1.1]} />
      {[
        [-0.45, 0.32],
        [0.4, 0.26],
      ].map(([x, r]) => (
        <group key={x} position={[x, 0.16, 0.95]} rotation={[-0.35, 0, 0]}>
          <mesh geometry={HALBKREIS} material={matt(BAU_LOCH)} scale={r} />
        </group>
      ))}
      {/* ausgescharrte Erde vor den Röhren */}
      <mesh geometry={FORM.kugelFein} material={matt(BAU_ERDE)} position={[-0.3, 0, 1.3]} scale={[0.7, 0.08, 0.4]} />
      <mesh geometry={FORM.kugelFein} material={matt(BAU_ERDE)} position={[0.5, 0, 1.25]} scale={[0.5, 0.06, 0.35]} />
    </group>
  );
}
const HALBKREIS = new THREE.CircleGeometry(1, 16, 0, Math.PI);

/** Wasserlauf hinter dem Ufer: dunkle, glänzende Fläche */
function Wasser() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.03, -5.8]}
      geometry={WASSER_FLAECHE}
      material={WASSER_MATERIAL}
    />
  );
}
const WASSER_FLAECHE = new THREE.PlaneGeometry(60, 6.4);
const WASSER_MATERIAL = new THREE.MeshPhongMaterial({ color: FARBE.wasser, specular: '#9FB3AD', shininess: 90 });

/** Suhle: Schlammloch mit glänzender Oberfläche und aufgewühltem Rand */
const SCHLAMM = '#2E241C';
function Suhle() {
  return (
    <group position={[2.4, 0.02, -1.6]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.6, 1, 1]} geometry={HALBKREIS_VOLL} material={matt(BAU_ERDE)} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        scale={[1.3, 0.75, 1]}
        geometry={HALBKREIS_VOLL}
        material={SCHLAMM_GLANZ}
      />
      {[-1.2, 1.3, 0.2].map((x) => (
        <mesh
          key={x}
          geometry={FORM.kugelFein}
          material={matt(SCHLAMM)}
          position={[x, 0, 0.9 - Math.abs(x) * 0.3]}
          scale={[0.3, 0.08, 0.2]}
        />
      ))}
    </group>
  );
}
const HALBKREIS_VOLL = new THREE.CircleGeometry(1, 24);
const SCHLAMM_GLANZ = new THREE.MeshPhongMaterial({ color: '#2A2018', specular: '#5A5048', shininess: 60 });

/** Biberburg: Kuppel aus Schlamm, darüber kreuz und quer Äste – am Wasserrand */
const BURG_AESTE = (() => {
  const rnd = zufall(5150);
  return Array.from({ length: 46 }, () => {
    const w = rnd() * Math.PI * 2;
    const h = rnd();
    return {
      x: Math.cos(w) * (1 - h * 0.7) * 1.3,
      y: h * 0.75 + 0.1,
      z: Math.sin(w) * (1 - h * 0.7) * 1.1,
      ry: rnd() * Math.PI,
      rz: (rnd() - 0.5) * 1.2,
      l: 0.8 + rnd() * 0.8,
    };
  });
})();
function Biberburg() {
  return (
    <group position={[2.6, 0, -3.4]}>
      <mesh geometry={FORM.kugelFein} material={matt(BAU_ERDE)} position={[0, -0.1, 0]} scale={[1.5, 0.95, 1.25]} />
      {BURG_AESTE.map((a, i) => (
        <mesh
          key={i}
          geometry={FORM.stamm}
          material={matt(i % 3 ? '#4A3A2A' : '#6A5640')}
          position={[a.x, a.y, a.z]}
          rotation={[Math.PI / 2, a.ry, a.rz]}
          scale={[0.035, a.l, 0.035]}
        />
      ))}
    </group>
  );
}

/** Kobel: Stamm mit Astgabel, darin ein Kugelnest aus Zweigen */
function Kobel() {
  return (
    <group position={[-2.4, 0, -2.6]}>
      <mesh geometry={FORM.stamm} material={matt('#3A2C22')} position={[0, 2, 0]} scale={[0.22, 4, 0.22]} />
      <mesh
        geometry={FORM.stamm}
        material={matt('#3A2C22')}
        position={[0.45, 2.9, 0]}
        rotation={[0, 0, -0.9]}
        scale={[0.07, 1.2, 0.07]}
      />
      <mesh
        geometry={FORM.kugelFein}
        material={matt('#3E3024')}
        position={[0.35, 2.85, 0.15]}
        scale={[0.42, 0.36, 0.4]}
      />
      {BURG_AESTE.slice(0, 18).map((a, i) => (
        <mesh
          key={i}
          geometry={FORM.stamm}
          material={matt('#5A4632')}
          position={[0.35 + a.x * 0.25, 2.85 + (a.y - 0.45) * 0.5, 0.15 + a.z * 0.25]}
          rotation={[Math.PI / 2, a.ry, a.rz]}
          scale={[0.015, a.l * 0.35, 0.015]}
        />
      ))}
    </group>
  );
}

/** Laubnest: Haufen aus Falllaub unter der Hecke, vorn ein dunkler Eingang */
const NEST_BLAETTER = (() => {
  const rnd = zufall(808);
  return Array.from({ length: 60 }, () => {
    const w = rnd() * Math.PI * 2;
    const h = rnd();
    return {
      x: Math.cos(w) * (1 - h * 0.6) * 0.6,
      y: h * 0.32,
      z: Math.sin(w) * (1 - h * 0.6) * 0.5,
      r: rnd() * Math.PI,
      f: Math.floor(rnd() * 4),
    };
  });
})();
function Laubnest() {
  return (
    <group position={[-2.1, 0, -1.4]}>
      <mesh geometry={FORM.kugelFein} material={matt('#4E3A26')} position={[0, 0, 0]} scale={[0.62, 0.3, 0.52]} />
      {NEST_BLAETTER.map((b, i) => (
        <mesh
          key={i}
          geometry={FORM.flach}
          material={matt(FARBE.laub[b.f])}
          position={[b.x, b.y, b.z]}
          rotation={[b.r, b.r * 2, 0]}
          scale={[0.09, 0.14, 1]}
        />
      ))}
      <mesh
        rotation={[-0.3, 0, 0]}
        position={[0, 0.1, 0.5]}
        geometry={HALBKREIS}
        material={matt(BAU_LOCH)}
        scale={0.14}
      />
    </group>
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
