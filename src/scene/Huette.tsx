import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { HuettenStufe } from '@/logic/fortschritt';
import { colors } from '@/theme/theme';

import { FORM, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Kleine, geheimnisvolle Waldhütte: Holzwände, bemoostes Dach, Steinkamin.
 * Die Fenster glimmen warm, aus dem Schornstein steigt Rauch.
 * `fenster` (0–1) kommt aus dem Tageszeit-Licht: nachts leuchten sie stärker.
 *
 * Sie wächst mit dem Level: Unterstand → Waldhütte → Forsthaus → Baumhaus-Sternwarte.
 */
const HOLZ = '#5A4232';
const HOLZ_DUNKEL = '#3E2E24';
const DACH = '#2E3B30';
const STEIN = '#5F625C';

type HuettenProps = { stufe: HuettenStufe; fenster: number; ruhig: boolean };

export function Huette({ stufe, fenster, ruhig }: HuettenProps) {
  return (
    <group userData={{ ziel: { typ: 'huette' } }}>
      {stufe === 0 && <Unterstand fenster={fenster} ruhig={ruhig} />}
      {stufe === 1 && <Waldhuette fenster={fenster} ruhig={ruhig} />}
      {stufe === 2 && <Forsthaus fenster={fenster} ruhig={ruhig} />}
      {stufe === 3 && <Sternwarte fenster={fenster} ruhig={ruhig} />}
    </group>
  );
}

/** Stufe 0: einfacher Unterstand aus Pfosten und schrägem Dach, darunter eine Laterne */
function Unterstand({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  return (
    <group>
      {[-0.9, 0.9].flatMap((x) =>
        [-0.7, 0.7].map((z) => (
          <mesh
            key={`${x}${z}`}
            geometry={FORM.kiste}
            material={matt(HOLZ_DUNKEL)}
            position={[x, z > 0 ? 0.75 : 0.95, z]}
            scale={[0.14, z > 0 ? 1.5 : 1.9, 0.14]}
          />
        )),
      )}
      {/* schräges Dach mit Moos */}
      <mesh
        geometry={FORM.kiste}
        material={matt(DACH)}
        position={[0, 1.78, 0]}
        rotation={[0.22, 0, 0]}
        scale={[2.3, 0.1, 1.9]}
      />
      <mesh geometry={FORM.kugel} material={matt('#3D5A45')} position={[0.4, 1.86, -0.2]} scale={[0.4, 0.1, 0.35]} />
      {/* Bank aus einem Baumstamm */}
      <mesh
        geometry={FORM.stamm}
        material={matt(HOLZ)}
        position={[0, 0.2, -0.3]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.2, 1.4, 0.2]}
      />
      <Laterne position={[0.55, 1.25, 0.5]} staerke={fenster} />
      {/* kleines Feuer mit Rauch */}
      <mesh geometry={FORM.kegel} material={matt('#3E2E24')} position={[-0.3, 0.12, 1.3]} scale={[0.35, 0.22, 0.35]} />
      <Glut position={[-0.3, 0.3, 1.3]} staerke={0.6 + 0.4 * fenster} />
      <Rauch ruhig={ruhig} ursprung={[-0.3, 0.5, 1.3]} />
    </group>
  );
}

/** Stufe 2: größeres Forsthaus mit Anbau und Laterne an der Tür */
function Forsthaus({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  return (
    <group>
      <group scale={[1.25, 1.2, 1.2]}>
        <Waldhuette fenster={fenster} ruhig={ruhig} />
      </group>
      {/* Anbau mit eigenem Fenster */}
      <mesh geometry={FORM.kiste} material={matt(HOLZ)} position={[1.95, 0.6, 0.2]} scale={[1.1, 1.1, 1.4]} />
      <mesh
        geometry={FORM.kiste}
        material={matt(DACH)}
        position={[1.95, 1.22, 0.2]}
        rotation={[0, 0, -0.25]}
        scale={[1.3, 0.1, 1.6]}
      />
      <Fenster position={[2.51, 0.7, 0.2]} rotation={Math.PI / 2} staerke={fenster} />
      {/* Brennholzstapel */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          geometry={FORM.stamm}
          material={matt(HOLZ)}
          position={[-1.85, 0.15 + i * 0.22, 0.6]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.11, 0.9, 0.11]}
        />
      ))}
      <Laterne position={[-0.15, 1.35, 1.3]} staerke={fenster} />
    </group>
  );
}

/** Stufe 3: Baumhaus-Sternwarte – Turm mit Kuppel und Fernrohr neben der Hütte */
function Sternwarte({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  const kuppel = useMemo(() => new THREE.MeshLambertMaterial({ color: '#3E5A58', flatShading: true }), []);
  const spalt = useMemo(() => new THREE.MeshBasicMaterial({ color: colors.rune }), []);
  return (
    <group>
      <group scale={[1.15, 1.15, 1.15]}>
        <Waldhuette fenster={fenster} ruhig={ruhig} />
      </group>
      {/* Turm */}
      <group position={[-2.1, 0, -0.4]}>
        <mesh geometry={FORM.stamm} material={matt(STEIN)} position={[0, 1.6, 0]} scale={[0.75, 3.2, 0.75]} />
        <mesh geometry={FORM.kiste} material={spalt} position={[0, 1.7, 0.66]} scale={[0.22, 0.4, 0.05]} />
        <mesh geometry={FORM.kiste} material={spalt} position={[0, 2.5, 0.62]} scale={[0.22, 0.4, 0.05]} />
        {/* Kuppel mit leuchtendem Spalt */}
        <mesh position={[0, 3.2, 0]} material={kuppel}>
          <sphereGeometry args={[0.85, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh
          geometry={FORM.kiste}
          material={spalt}
          position={[0, 3.6, 0.35]}
          rotation={[-0.6, 0, 0]}
          scale={[0.14, 0.7, 0.05]}
        />
        {/* Fernrohr */}
        <mesh
          geometry={FORM.stamm}
          material={matt('#8A7A5A')}
          position={[0, 3.85, 0.45]}
          rotation={[-0.9, 0, 0]}
          scale={[0.09, 1.1, 0.09]}
        />
        <Laterne position={[0, 3.3, 0]} staerke={0.4 + 0.6 * fenster} farbe={colors.rune} gross />
      </group>
    </group>
  );
}

/** Laterne: weiches Licht in Schichten statt harter Kante */
function Laterne({
  position,
  staerke,
  farbe = colors.amber,
  gross = false,
}: {
  position: [number, number, number];
  staerke: number;
  farbe?: string;
  gross?: boolean;
}) {
  const hof = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: farbe,
        transparent: true,
        opacity: 0.25 + 0.5 * staerke,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [farbe, staerke],
  );
  return (
    <group position={position}>
      {!gross && <mesh geometry={FORM.kiste} material={matt('#2A2622')} scale={[0.14, 0.2, 0.14]} />}
      <sprite material={hof} scale={gross ? [3, 3, 1] : [1.2, 1.2, 1]} />
      <pointLight color={farbe} intensity={2 * staerke} distance={gross ? 6 : 4} decay={1.7} />
    </group>
  );
}

/** Glut eines kleinen Feuers */
function Glut({ position, staerke }: { position: [number, number, number]; staerke: number }) {
  return <Laterne position={position} staerke={staerke} />;
}

/** Stufe 1: die Waldhütte */
function Waldhuette({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  return (
    <group>
      {/* Steinsockel */}
      <mesh geometry={FORM.kiste} material={matt(STEIN)} position={[0, 0.12, 0]} scale={[2.7, 0.24, 2.2]} />
      {/* Wände */}
      <mesh geometry={FORM.kiste} material={matt(HOLZ)} position={[0, 0.98, 0]} scale={[2.4, 1.5, 1.9]} />
      {/* Balkenecken */}
      {[-1.2, 1.2].flatMap((x) =>
        [-0.95, 0.95].map((z) => (
          <mesh
            key={`${x}${z}`}
            geometry={FORM.kiste}
            material={matt(HOLZ_DUNKEL)}
            position={[x, 0.98, z]}
            scale={[0.16, 1.55, 0.16]}
          />
        )),
      )}
      {/* Satteldach: dreieckiges Prisma */}
      {/* Zylinder mit 3 Ecken = Dreiecksprisma. Gekippt, damit die Spitze nach oben zeigt,
          und gedreht, damit der First entlang der Hüttenbreite läuft. */}
      <group position={[0, 2.07, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[2.15, 1.4, 1.1]} material={matt(DACH)}>
          <cylinderGeometry args={[0.62, 0.62, 2, 3]} />
        </mesh>
      </group>
      {/* Moospolster auf dem Dach */}
      <mesh geometry={FORM.kugel} material={matt('#3D5A45')} position={[0.6, 2.45, 0.25]} scale={[0.35, 0.12, 0.3]} />
      <mesh geometry={FORM.kugel} material={matt('#3D5A45')} position={[-0.5, 2.38, -0.35]} scale={[0.3, 0.1, 0.25]} />
      {/* Kamin */}
      <mesh geometry={FORM.kiste} material={matt(STEIN)} position={[0.75, 2.55, -0.35]} scale={[0.34, 1, 0.34]} />
      {/* Tür */}
      <mesh
        geometry={FORM.kiste}
        material={matt(HOLZ_DUNKEL)}
        position={[-0.45, 0.78, 0.96]}
        scale={[0.55, 1.05, 0.05]}
      />
      {/* Fenster vorne und an der Seite */}
      <Fenster position={[0.55, 1.1, 0.97]} rotation={0} staerke={fenster} />
      <Fenster position={[1.22, 1.1, 0.2]} rotation={Math.PI / 2} staerke={fenster} />
      <Fenster position={[-1.22, 1.1, -0.2]} rotation={-Math.PI / 2} staerke={fenster} />
      {/* Warmes Licht, das aus der Hütte auf die Lichtung fällt */}
      <pointLight position={[0.3, 1.2, 2]} color={colors.amber} intensity={4 * fenster} distance={7} decay={1.6} />
      <Rauch ruhig={ruhig} ursprung={[0.75, 3.1, -0.35]} />
    </group>
  );
}

function Fenster({
  position,
  rotation,
  staerke,
}: {
  position: [number, number, number];
  rotation: number;
  staerke: number;
}) {
  const scheibe = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.amber).multiplyScalar(0.35 + 0.65 * staerke) }),
    [staerke],
  );
  const hof = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: colors.amber,
        transparent: true,
        opacity: 0.55 * staerke,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [staerke],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh geometry={FORM.flach} material={scheibe} scale={[0.5, 0.45, 1]} position={[0, 0, 0.005]} />
      {/* Fensterkreuz */}
      <mesh geometry={FORM.kiste} material={matt(HOLZ_DUNKEL)} scale={[0.05, 0.47, 0.03]} position={[0, 0, 0.02]} />
      <mesh geometry={FORM.kiste} material={matt(HOLZ_DUNKEL)} scale={[0.52, 0.05, 0.03]} position={[0, 0, 0.02]} />
      {/* weicher Lichthof statt harter Kante */}
      <sprite material={hof} scale={[1.6, 1.4, 1]} position={[0, 0, 0.15]} />
    </group>
  );
}

/** Rauchschwaden: steigen auf, werden größer und blasser, beginnen dann von vorn. */
const RAUCH_ANZAHL = 7;

function Rauch({ ruhig, ursprung }: { ruhig: boolean; ursprung: [number, number, number] }) {
  const schwaden = useRef<(THREE.Sprite | null)[]>([]);
  const materialien = useMemo(
    () =>
      Array.from(
        { length: RAUCH_ANZAHL },
        () =>
          new THREE.SpriteMaterial({
            map: leuchtTextur(),
            color: colors.fog,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          }),
      ),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (ruhig ? 0.15 : 0.35);
    schwaden.current.forEach((s, i) => {
      if (!s) return;
      const p = (t + i / RAUCH_ANZAHL) % 1; // 0 = gerade aus dem Kamin, 1 = verweht
      const [ux, uy, uz] = ursprung;
      s.position.set(ux + p * 0.9 + Math.sin(p * 6 + i) * 0.15, uy + p * 3.2, uz - p * 0.3);
      const g = 0.35 + p * 1.6;
      s.scale.set(g, g, 1);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(p * Math.PI) * 0.32;
    });
  });

  return (
    <>
      {materialien.map((m, i) => (
        <sprite
          key={i}
          material={m}
          ref={(s) => {
            schwaden.current[i] = s;
          }}
        />
      ))}
    </>
  );
}
