import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import type { KategorieId } from '@/data/artTypen';
import { startwertAus, zufall } from '@/logic/lichtung';
import { mischeFarbe, type Stimmung } from '@/logic/tageszeit';
import {
  abstandZumPfad,
  hoheStaemme,
  LICHT_AM_ENDE,
  PFAD,
  pfadX,
  streueFrei,
  uraltBaeume,
  zauberBoden,
  type Streuung,
} from '@/logic/zauberwald';
import { colors } from '@/theme/theme';

import { blattMaterial, blattMesh, blattWind } from './Baum3D';
import { baueUraltBaum } from './baumGenerator';
import { blattTextur } from './blattTexturen';
import { farnGeometrie, FELS, grasGeometrie, windMaterial, WIND } from './LichtungDetails';
import { matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Kulisse des Katalog-Walds: ein verwunschener Moorwald im Nebel.
 * - moosige Lichtung mit Polstern, Farnen, bemoosten Steinen
 * - Ring aus uralten, knorrigen Moosbäumen, die das Bild einrahmen
 * - hohe, schlanke Stämme, die im Nebel verschwinden
 * - ein Hohlweg mit Böschungen führt auf ein helles Licht in der Ferne zu
 * - Lichtstrahlen von oben, Bodennebel, schwebende Sporen bzw. Glühwürmchen
 *
 * Leistung: Gleichartiges als InstancedMesh, alle Geometrien werden einmal gebaut.
 * Die Kulisse fängt keine Tipps ab (nur die Arten sind antippbar).
 */
type Props = { kategorie: KategorieId; stimmung: Stimmung; ruhig: boolean };

/** Farben der Lichtpunkte je Kategorie */
const TEILCHEN: Record<KategorieId, string> = {
  pflanzen: colors.moon,
  pilze: colors.myzelLicht,
  voegel: colors.federHell,
  saeuger: colors.amber,
};

export function Zauberwald({ kategorie, stimmung, ruhig }: Props) {
  const gruppe = useRef<THREE.Group>(null);
  const teile = useMemo(() => baueKulisse(startwertAus(`zauberwald-${kategorie}`)), [kategorie]);

  useEffect(() => {
    gruppe.current?.traverse((o) => {
      o.raycast = () => {};
    });
  }, [teile]);

  useFrame(({ clock }, dt) => {
    if (ruhig) return;
    WIND.value += dt;
    blattWind(clock.elapsedTime);
  });

  // Nebel grünlich-grau, die Tageszeit färbt nur leicht mit
  const nebel = mischeFarbe(stimmung.nebel, colors.zauberNebel, 0.65);
  const nacht = stimmung.sterne;

  return (
    <group ref={gruppe}>
      {/* Hintergrund = Nebelfarbe: Ferne Stämme verschwinden nahtlos im Dunst */}
      <color attach="background" args={[nebel]} />
      <fogExp2 attach="fog" args={[nebel, 0.034 + stimmung.nebelDichte * 0.35]} />
      <ambientLight color={stimmung.umgebung} intensity={0.32 + stimmung.umgebungStaerke * 0.35} />
      <hemisphereLight args={[colors.zauberNebelHell, colors.night, 0.55]} />
      {/* Gegenlicht vom Ende des Weges: zeichnet helle Kanten an Stämme und Figuren */}
      <directionalLight
        color={colors.zauberLicht}
        intensity={0.75 - nacht * 0.3}
        position={[LICHT_AM_ENDE.x, 9, LICHT_AM_ENDE.z]}
      />
      {/* weiches Licht von vorn oben, damit die Arten gut zu erkennen sind */}
      <directionalLight color={stimmung.licht} intensity={0.35 + stimmung.lichtStaerke * 0.25} position={[4, 14, 10]} />

      <mesh geometry={teile.boden} material={teile.bodenMaterial} />
      {teile.meshes.map((m) => (
        <primitive key={m.uuid} object={m} />
      ))}
      {teile.baeume.map((b, i) => (
        <UraltBaum key={i} {...b} ruhig={ruhig} />
      ))}

      <LichtAmEnde nebel={nebel} ruhig={ruhig} />
      <Lichtstrahlen farbe={stimmung.licht} ruhig={ruhig} nacht={nacht} />
      <Bodennebel farbe={colors.zauberNebelHell} ruhig={ruhig} />
      <Schwebeteilchen farbe={TEILCHEN[kategorie]} ruhig={ruhig} />
    </group>
  );
}

// ---------- Geometrien ----------

const BLATT_FLACH = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
/** Moospolster: weich gerundet statt kantig */
const POLSTER = new THREE.IcosahedronGeometry(1, 2);
const MOOS_MATERIAL = new THREE.MeshLambertMaterial({ color: '#ffffff' });
const HOHER_STAMM = new THREE.CylinderGeometry(0.16, 0.26, 1, 7).translate(0, 0.5, 0);
const AST_STUMMEL = new THREE.CylinderGeometry(0.03, 0.07, 1, 5).translate(0, 0.5, 0);
const BAUMSTAMM_LIEGEND = new THREE.CylinderGeometry(0.32, 0.38, 1, 9).rotateZ(Math.PI / 2);
/** Zwei gekreuzte Karten für ferne Bäume */
const FERNBAUM = mergeGeometries([
  new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0),
  new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0).rotateY(Math.PI / 2),
]);

const HILFE = new THREE.Object3D();
const FARB_HILFE = new THREE.Color();

/** InstancedMesh aus einer Streuung. Höhe kommt vom Boden, `setzen` passt Form und Lage an. */
function instanzen(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  liste: Streuung[],
  setzen: (d: Streuung, o: THREE.Object3D) => void,
  farben?: string[],
) {
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, liste.length));
  mesh.count = liste.length;
  liste.forEach((d, i) => {
    HILFE.position.set(d.x, zauberBoden(d.x, d.z), d.z);
    HILFE.rotation.set(0, d.drehung, 0);
    HILFE.scale.setScalar(d.groesse);
    setzen(d, HILFE);
    HILFE.updateMatrix();
    mesh.setMatrixAt(i, HILFE.matrix);
    if (farben) mesh.setColorAt(i, FARB_HILFE.set(farben[Math.floor(d.ton * farben.length) % farben.length]));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

/** Waldboden: Moospolster hell, Senken dunkel, im Hohlweg nackte Erde und Laub */
function bodenGeometrie() {
  const g = new THREE.PlaneGeometry(120, 120, 120, 120);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  const moos = new THREE.Color(colors.zauberMoos);
  const hell = new THREE.Color(colors.zauberMoosHell);
  const dunkel = new THREE.Color(colors.zauberMoosDunkel);
  const erde = new THREE.Color(colors.zauberErde);
  const laub = new THREE.Color(colors.zauberLaub);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = zauberBoden(x, z);
    pos.setY(i, y);
    const fleck = (Math.sin(x * 0.8 + z * 0.3) + Math.sin(x * 0.31 - z * 0.9) + Math.sin(z * 0.5 + 1.7)) / 3;
    const fein = Math.sin(x * 3.1 + z * 2.3) * Math.sin(z * 2.7 - x * 1.3);
    c.copy(dunkel).lerp(moos, 0.55 + fleck * 0.45);
    c.lerp(hell, Math.max(0, fein) * 0.35 + Math.max(0, y - 0.02) * 1.2 * (1 - Math.min(1, y / 2)));
    // weiter draußen wird der Boden dunkler (dichter Wald)
    c.multiplyScalar(1 - THREE.MathUtils.smoothstep(Math.hypot(x, z), 14, 40) * 0.45);
    // Hohlweg: Erde mit Laub, an den Rändern ausgefranst
    const d = abstandZumPfad(x, z);
    const weg = 1 - THREE.MathUtils.smoothstep(d, PFAD.breite * 0.6, PFAD.breite * 1.5 + fein * 0.25);
    if (weg > 0) c.lerp(fein > 0.2 ? laub : erde, weg);
    farben.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  g.computeVertexNormals();
  return g;
}

/** Alle Instanzen der Kulisse einmal je Kategorie aufbauen */
function baueKulisse(s: number) {
  const baeume = uraltBaeume(s);
  const umBaeume = baeume.map((b) => ({ x: b.x, z: b.z, r: 1.4 * b.skala }));
  const moosPolster = [
    ...streueFrei(s + 1, 70, 9, 22, { meiden: umBaeume, pfad: PFAD.breite + 0.4, haufen: 2.2, groesse: [0.35, 0.9] }),
    // dicke Polster um die Stammfüße
    ...baeume.flatMap((b, i) =>
      streueFrei(s + 100 + i, 6, 0, 3.2, { groesse: [0.4, 0.8] }).map((p) => ({
        ...p,
        x: b.x + p.x * 0.7,
        z: b.z + p.z * 0.7,
      })),
    ),
  ];
  const farne = [
    ...streueFrei(s + 2, 120, 10, 26, { meiden: umBaeume, pfad: PFAD.breite + 0.6, haufen: 2.5, groesse: [0.8, 1.7] }),
    ...streueFrei(s + 3, 70, 0, 0, { pfad: PFAD.breite + 0.5, nurPfadNaehe: 3.5, haufen: 1.8, groesse: [0.9, 1.8] }),
  ];
  const gras = streueFrei(s + 4, 260, 3, 14, { haufen: 1.4, groesse: [0.5, 1.1] });
  const steine = streueFrei(s + 5, 34, 8, 24, { meiden: umBaeume, pfad: PFAD.breite, groesse: [0.25, 0.75] });
  const wegLaub = streueFrei(s + 6, 260, 0, 0, { nurPfadNaehe: PFAD.breite * 0.9, groesse: [0.07, 0.13] });
  const staemme = hoheStaemme(s + 7);
  const stummel = staemme.filter((_, i) => i % 2 === 0);
  const ferne = streueFrei(s + 8, 120, 34, 58, { pfad: PFAD.breite + 4, groesse: [0.9, 1.5] });
  const liegend = streueFrei(s + 9, 3, 12, 20, { meiden: umBaeume, pfad: PFAD.breite + 1, groesse: [2.2, 3.4] });
  const rnd = zufall(s + 10);

  const meshes: THREE.Object3D[] = [
    instanzen(
      POLSTER,
      MOOS_MATERIAL,
      moosPolster,
      (d, o) => {
        o.position.y += d.groesse * 0.05;
        o.scale.set(d.groesse * 1.5, d.groesse * 0.42, d.groesse * 1.2);
      },
      [colors.zauberMoos, colors.zauberMoosHell, colors.zauberMoosDunkel],
    ),
    instanzen(farnGeometrie(), windMaterial(0.22), farne, () => {}, [
      colors.zauberFarn,
      colors.zauberMoos,
      colors.zauberMoosDunkel,
    ]),
    instanzen(grasGeometrie(), windMaterial(0.45), gras, () => {}, [
      colors.zauberMoos,
      colors.zauberMoosHell,
      colors.zauberFarn,
    ]),
    instanzen(
      FELS,
      new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      steine,
      (d, o) => {
        o.position.y += d.groesse * 0.2;
        o.scale.set(d.groesse * 1.3, d.groesse * 0.75, d.groesse);
      },
      [colors.zauberStamm, colors.zauberRinde],
    ),
    // Moosmützen auf den Steinen
    instanzen(
      POLSTER,
      MOOS_MATERIAL,
      steine,
      (d, o) => {
        o.position.y += d.groesse * 0.62;
        o.scale.set(d.groesse * 1.05, d.groesse * 0.28, d.groesse * 0.85);
      },
      [colors.zauberMoosHell, colors.zauberMoos],
    ),
    instanzen(
      BLATT_FLACH,
      new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }),
      wegLaub,
      (d, o) => {
        o.position.y += 0.02;
        o.scale.set(d.groesse, 1, d.groesse * 0.6);
      },
      [colors.zauberLaub, colors.zauberErde, colors.eichel],
    ),
    // hohe Stämme im Nebel (leicht schief, unterschiedlich dick)
    instanzen(
      HOHER_STAMM,
      new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      staemme,
      (d, o) => {
        o.rotation.set((d.ton - 0.5) * 0.08, d.drehung, (d.groesse - 1) * 0.1);
        o.scale.set(d.groesse * 1.3, 15 + d.ton * 12, d.groesse * 1.3);
      },
      [colors.zauberStamm, colors.zauberRinde, colors.zauberNebel],
    ),
    // tote Aststummel an den Stämmen
    instanzen(AST_STUMMEL, matt(colors.zauberRinde), stummel, (d, o) => {
      o.position.y += 4 + d.ton * 6;
      o.rotation.set(0, d.drehung, 1.1 + d.ton * 0.5);
      o.scale.set(d.groesse, 1.2 + d.ton * 1.5, d.groesse);
    }),
    // ferner, dichter Wald (gemalte Umrisse)
    instanzen(
      FERNBAUM,
      new THREE.MeshLambertMaterial({
        color: '#ffffff',
        map: blattTextur('fernbaum'),
        alphaTest: 0.5,
        side: THREE.DoubleSide,
      }),
      ferne,
      (d, o) => {
        o.position.y -= 0.2;
        o.scale.set(4 * d.groesse, 11 * d.groesse, 4 * d.groesse);
      },
      [colors.zauberNebel, colors.zauberMoosDunkel],
    ),
    // umgestürzte, bemooste Baumstämme
    instanzen(
      BAUMSTAMM_LIEGEND,
      new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      liegend,
      (d, o) => {
        o.position.y += 0.25;
        o.scale.set(d.groesse, 1, 1);
        o.rotation.z = (rnd() - 0.5) * 0.15;
      },
      [colors.zauberRinde],
    ),
    instanzen(
      POLSTER,
      MOOS_MATERIAL,
      liegend,
      (d, o) => {
        o.position.y += 0.52;
        o.scale.set(d.groesse * 0.42, 0.14, 0.3);
      },
      [colors.zauberMoosHell],
    ),
  ];

  return {
    boden: bodenGeometrie(),
    bodenMaterial: new THREE.MeshLambertMaterial({ vertexColors: true }),
    meshes,
    baeume,
  };
}

// ---------- Uralte Moosbäume ----------

const RINDE_MOOS = new THREE.MeshLambertMaterial({ color: '#ffffff', vertexColors: true });

function UraltBaum({
  x,
  z,
  skala,
  drehung,
  variante,
  ruhig,
}: {
  x: number;
  z: number;
  skala: number;
  drehung: number;
  variante: number;
  ruhig: boolean;
}) {
  const krone = useRef<THREE.Group>(null);
  const daten = useMemo(() => baueUraltBaum(variante), [variante]);
  const blaetter = useMemo(() => blattMesh(daten, blattMaterial('laub', colors.zauberMoos)), [daten]);
  useFrame(({ clock }) => {
    if (ruhig || !krone.current) return;
    const t = clock.elapsedTime * 0.5 + x;
    krone.current.rotation.z = Math.sin(t) * 0.012;
  });
  return (
    <group position={[x, zauberBoden(x, z) - 0.1, z]} rotation={[0, drehung, 0]} scale={skala}>
      <group ref={krone}>
        <mesh geometry={daten.holz} material={RINDE_MOOS} />
        <primitive object={blaetter} />
      </group>
    </group>
  );
}

// ---------- Licht und Nebel ----------

function leuchtSprite(farbe: string, deckkraft: number, nebel = false) {
  return new THREE.SpriteMaterial({
    map: leuchtTextur(),
    color: farbe,
    transparent: true,
    opacity: deckkraft,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: nebel,
  });
}

/** Helles Licht am Ende des Hohlwegs: mehrere weiche Lichthöfe übereinander */
function LichtAmEnde({ nebel, ruhig }: { nebel: string; ruhig: boolean }) {
  const kern = useMemo(() => leuchtSprite(colors.zauberLicht, 0.85), []);
  const hof = useMemo(() => leuchtSprite(mischeFarbe(colors.zauberLicht, nebel, 0.4), 0.45), [nebel]);
  const schleier = useMemo(() => leuchtSprite(colors.zauberNebelHell, 0.25), []);
  const atmen = useRef<THREE.Sprite>(null);
  useFrame(({ clock }) => {
    if (ruhig || !atmen.current) return;
    const s = 26 + Math.sin(clock.elapsedTime * 0.4) * 2;
    atmen.current.scale.set(s, s * 0.7, 1);
  });
  const { x, y, z } = LICHT_AM_ENDE;
  return (
    <group position={[x, zauberBoden(x, z) + y, z]}>
      <sprite material={kern} scale={[9, 12, 1]} />
      <sprite material={hof} scale={[20, 18, 1]} />
      <sprite ref={atmen} material={schleier} scale={[26, 18, 1]} />
    </group>
  );
}

/** Schräge Lichtstrahlen, die durch das Blätterdach auf die Lichtung fallen */
const STRAHL = (() => {
  const g = new THREE.CylinderGeometry(0.15, 0.9, 18, 10, 6, true).translate(0, -9, 0);
  // oben und unten weich ausblenden (schwarz = unsichtbar bei additivem Licht)
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = -pos.getY(i) / 18;
    const h = THREE.MathUtils.smoothstep(t, 0, 0.3) * (1 - THREE.MathUtils.smoothstep(t, 0.75, 1));
    farben.set([h, h, h], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  return g;
})();
const STRAHL_ZIELE: [number, number, number][] = [
  [1.2, 2.2, 1.3],
  [-3, -1.5, 1],
  [2.8, -3.8, 0.8],
  [-1, 4.5, 0.7],
  [pfadX(-14), -14, 1.1],
  [pfadX(-22), -22, 0.9],
];

function Lichtstrahlen({ farbe, ruhig, nacht }: { farbe: string; ruhig: boolean; nacht: number }) {
  const strahlen = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(
    () =>
      STRAHL_ZIELE.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: mischeFarbe(farbe, colors.zauberLicht, 0.5),
            transparent: true,
            opacity: 0.03,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
          }),
      ),
    [farbe],
  );
  const drehung = useMemo(() => new THREE.Euler(-0.12, 0, 0.32), []);
  const fuss = useMemo(() => new THREE.Vector3(0, -18, 0).applyEuler(drehung), [drehung]);
  useFrame(({ clock }) => {
    const t = ruhig ? 0 : clock.elapsedTime;
    strahlen.current.forEach((m, i) => {
      if (!m) return;
      const grund = (0.028 + 0.02 * Math.sin(t * 0.3 + i * 1.7)) * (1 - nacht * 0.5);
      (m.material as THREE.MeshBasicMaterial).opacity = grund;
    });
  });
  return (
    <>
      {STRAHL_ZIELE.map(([x, z, breite], i) => (
        <mesh
          key={i}
          ref={(m) => {
            strahlen.current[i] = m;
          }}
          geometry={STRAHL}
          material={mats[i]}
          position={[x - fuss.x, zauberBoden(x, z) - fuss.y, z - fuss.z]}
          rotation={drehung}
          scale={[breite, 1, breite]}
        />
      ))}
    </>
  );
}

/** Bodennebel: flache, weiche Schwaden, besonders dicht im Hohlweg */
function Bodennebel({ farbe, ruhig }: { farbe: string; ruhig: boolean }) {
  const ring = useRef<THREE.Group>(null);
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: farbe,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
      }),
    [farbe],
  );
  const schwaden = useMemo(() => {
    const rnd = zufall(77);
    return Array.from({ length: 22 }, (_, i) => {
      const w = (i / 22) * Math.PI * 2;
      const r = 7 + rnd() * 12;
      return { x: Math.cos(w) * r, z: Math.sin(w) * r, s: 7 + rnd() * 6 };
    });
  }, []);
  const imWeg = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const z = PFAD.von - 3 - i * 3.6;
        return { x: pfadX(z), z, s: 6 + (i % 3) * 2 };
      }),
    [],
  );
  useFrame((_, dt) => {
    if (!ruhig && ring.current) ring.current.rotation.y += dt * 0.01;
  });
  return (
    <>
      <group ref={ring}>
        {schwaden.map((n, i) => (
          <sprite
            key={i}
            material={mat}
            position={[n.x, zauberBoden(n.x, n.z) + 0.5, n.z]}
            scale={[n.s, n.s * 0.28, 1]}
          />
        ))}
      </group>
      {imWeg.map((n, i) => (
        <sprite
          key={i}
          material={mat}
          position={[n.x, zauberBoden(n.x, n.z) + 0.6, n.z]}
          scale={[n.s, n.s * 0.35, 1]}
        />
      ))}
    </>
  );
}

/** Schwebende Lichtpunkte (Sporen, Pollen, Glühwürmchen) – Farbe je Kategorie */
const TEILCHEN_ANZAHL = 70;

function Schwebeteilchen({ farbe, ruhig }: { farbe: string; ruhig: boolean }) {
  const punkte = useRef<THREE.Points>(null);
  const basis = useMemo(() => {
    const rnd = zufall(31);
    return Array.from({ length: TEILCHEN_ANZAHL }, (_, i) => {
      const w = i * 2.399;
      const r = 1.5 + rnd() * 15;
      const x = Math.cos(w) * r;
      const z = Math.sin(w) * r;
      return { x, z, y: zauberBoden(x, z) + 0.3 + rnd() * 3, p: rnd() * 10 };
    });
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(TEILCHEN_ANZAHL * 3);
    basis.forEach((b, i) => pos.set([b.x, b.y, b.z], i * 3));
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [basis]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: farbe,
        size: 0.22,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [farbe],
  );
  useFrame(({ clock }) => {
    const p = punkte.current;
    if (ruhig || !p) return;
    const t = clock.elapsedTime;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    basis.forEach((b, i) => {
      pos.setXYZ(
        i,
        b.x + Math.sin(t * 0.2 + b.p) * 0.9,
        b.y + Math.sin(t * 0.45 + b.p * 2) * 0.5,
        b.z + Math.cos(t * 0.17 + b.p) * 0.9,
      );
    });
    pos.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(t * 1.1) * 0.2;
  });
  return <points ref={punkte} geometry={geo} material={mat} />;
}
