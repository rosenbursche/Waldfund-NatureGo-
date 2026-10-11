import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { KategorieId } from '@/data/artTypen';
import { colors } from '@/theme/theme';

import { ArtFigur } from './ArtFigur';
import { FORM, matt, UNSICHTBAR } from './material';
import { leuchtTextur } from './texturen';

/**
 * Schwebender Runenstein für eine Kategorie (Pflanzen, Pilze, Vögel, Säugetiere).
 * Je mehr Arten der Kategorie gesammelt sind, desto heller leuchten Runenring und Lichthof.
 */
type Props = {
  kategorie: KategorieId;
  position: [number, number, number];
  /** Anteil gesammelter Arten 0–1 */
  fortschritt: number;
  /** einige gefundene Arten, die um den Stein schweben (höchstens drei) */
  vitrine: string[];
  ruhig: boolean;
};

export function Runenstein({ kategorie, position, fortschritt, vitrine, ruhig }: Props) {
  const gruppe = useRef<THREE.Group>(null);
  const start = position[0] * 3 + position[2];
  // Auch ohne Fund glimmt der Stein ein wenig – er soll neugierig machen
  const glut = 0.18 + 0.82 * fortschritt;

  const ring = useMemo(
    () => new THREE.MeshBasicMaterial({ color: colors.rune, transparent: true, opacity: 0.25 + 0.75 * glut }),
    [glut],
  );
  const hof = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: colors.rune,
        transparent: true,
        opacity: 0.12 + 0.5 * glut,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [glut],
  );

  // Langsames Schweben und Drehen
  useFrame(({ clock }) => {
    if (!gruppe.current) return;
    const t = clock.elapsedTime;
    gruppe.current.position.y = position[1] + (ruhig ? 0 : Math.sin(t * 0.8 + start) * 0.15);
    if (!ruhig) gruppe.current.rotation.y = t * 0.25 + start;
  });

  return (
    <group ref={gruppe} position={position} userData={{ ziel: { typ: 'kategorie', id: kategorie } }}>
      <mesh geometry={FORM.trefferZylinder} material={UNSICHTBAR} scale={[0.9, 2.2, 0.9]} />
      {/* der Stein: kantiger, länglicher Kristall */}
      <mesh scale={[0.42, 0.75, 0.42]} material={matt('#2C3633')}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
      {/* leuchtende Runenbänder */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} material={ring}>
        <torusGeometry args={[0.36, 0.022, 4, 16]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0.4]} position={[0, -0.22, 0]} material={ring}>
        <torusGeometry args={[0.3, 0.018, 4, 16]} />
      </mesh>
      {/* weicher Lichthof in Schichten */}
      <sprite material={hof} scale={[2.6 * (0.7 + glut * 0.5), 2.6 * (0.7 + glut * 0.5), 1]} />
      <sprite material={hof} scale={[1.1, 1.1, 1]} />
      <pointLight color={colors.rune} intensity={1.2 * glut} distance={3.5} decay={1.8} />
      <Vitrine ids={vitrine} ruhig={ruhig} />
    </group>
  );
}

/** Gefundene Arten kreisen langsam um den Stein – wie Trophäen in einer Vitrine */
function Vitrine({ ids, ruhig }: { ids: string[]; ruhig: boolean }) {
  const kreis = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ruhig && kreis.current) kreis.current.rotation.y -= dt * 0.45; // gegen die Drehung des Steins
  });
  return (
    <group ref={kreis}>
      {ids.map((id, i) => {
        const w = (i / Math.max(ids.length, 1)) * Math.PI * 2;
        return (
          <group key={id} position={[Math.cos(w) * 1.05, -0.45, Math.sin(w) * 1.05]}>
            <ArtFigur id={id} stil="farbe" groesse={0.55} ruhig={ruhig} />
          </group>
        );
      })}
    </group>
  );
}
