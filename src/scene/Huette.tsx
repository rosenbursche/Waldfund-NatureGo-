import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { colors } from '@/theme/theme';

import { FORM, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Kleine, geheimnisvolle Waldhütte: Holzwände, bemoostes Dach, Steinkamin.
 * Die Fenster glimmen warm, aus dem Schornstein steigt Rauch.
 * `fenster` (0–1) kommt aus dem Tageszeit-Licht: nachts leuchten sie stärker.
 *
 * In Phase 7 wächst die Hütte mit dem Level (Unterstand → … → Sternwarte).
 */
const HOLZ = '#5A4232';
const HOLZ_DUNKEL = '#3E2E24';
const DACH = '#2E3B30';
const STEIN = '#5F625C';

export function Huette({ fenster, ruhig }: { fenster: number; ruhig: boolean }) {
  return (
    <group userData={{ ziel: { typ: 'huette' } }}>
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
      <Rauch ruhig={ruhig} />
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

function Rauch({ ruhig }: { ruhig: boolean }) {
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
      s.position.set(0.75 + p * 0.9 + Math.sin(p * 6 + i) * 0.15, 3.1 + p * 3.2, -0.35 - p * 0.3);
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
