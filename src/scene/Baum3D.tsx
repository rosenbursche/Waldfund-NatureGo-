import { useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';
import type * as THREE from 'three';

import type { BaumModell } from '@/data/typen';

import { FORM, matt, SILHOUETTE, UNSICHTBAR } from './material';

/**
 * Ein prozedural erzeugter Low-Poly-Baum.
 * Jede Kronenform hat eine eigene, erkennbare Gestalt (siehe Phase-3-Auftrag):
 * Buche rund, Eiche knorrig, Fichte schmal-spitz, Tanne mit flacher Spitze,
 * Kiefer mit Schirmkrone und rötlichem Stamm, Birke weiß mit lockerer Krone.
 *
 * Gefundene Arten stehen in Farbe da, unbekannte als dunkle Silhouette.
 */
type Props = {
  id: string;
  modell: BaumModell;
  gefunden: boolean;
  position: [number, number, number];
  skala: number;
  drehung: number;
  /** Wind abschalten bei "Bewegung reduzieren" */
  ruhig: boolean;
};

export function Baum3D({ id, modell, gefunden, position, skala, drehung, ruhig }: Props) {
  const krone = useRef<THREE.Group>(null);
  const phase = useRef((position[0] * 7.3 + position[2] * 3.1) % (Math.PI * 2));

  // Leichter Wind: Die Krone schwankt sanft, jeder Baum etwas anders
  useFrame(({ clock }) => {
    if (ruhig || !krone.current) return;
    const t = clock.elapsedTime * 0.9 + phase.current;
    krone.current.rotation.z = Math.sin(t) * 0.025 + Math.sin(t * 2.3) * 0.01;
    krone.current.rotation.x = Math.cos(t * 0.8) * 0.018;
  });

  const laub = matt(gefunden ? modell.laub : SILHOUETTE);
  const rinde = matt(gefunden ? modell.rinde : SILHOUETTE);
  const h = modell.hoehe;

  return (
    <group position={position} rotation={[0, drehung, 0]} scale={skala} userData={{ ziel: { typ: 'baum', id } }}>
      {/* große, unsichtbare Tipp-Fläche, damit man den Baum leicht trifft */}
      <mesh
        geometry={FORM.trefferZylinder}
        material={UNSICHTBAR}
        position={[0, 2.2 * h, 0]}
        scale={[1.3, 4.4 * h, 1.3]}
      />
      <group ref={krone}>
        <Form krone={modell.krone} laub={laub} rinde={rinde} h={h} gefunden={gefunden} />
      </group>
    </group>
  );
}

type FormProps = {
  krone: BaumModell['krone'];
  laub: THREE.Material;
  rinde: THREE.Material;
  h: number;
  gefunden: boolean;
};

function Form({ krone, laub, rinde, h, gefunden }: FormProps) {
  switch (krone) {
    case 'rund': // Buche
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.9 * h, 0]} scale={[0.17, 1.8 * h, 0.17]} />
          <mesh geometry={FORM.kugelFein} material={laub} position={[0, 2.7 * h, 0]} scale={[1.45, 1.3 * h, 1.45]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0.75, 2.3 * h, 0.3]} scale={0.85} />
          <mesh geometry={FORM.kugel} material={laub} position={[-0.7, 2.4 * h, -0.35]} scale={0.8} />
        </>
      );

    case 'ausladend': // Eiche: knorrig, breit
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.7 * h, 0]} scale={[0.26, 1.4 * h, 0.26]} />
          <mesh
            geometry={FORM.stamm}
            material={rinde}
            position={[0.45, 1.55 * h, 0]}
            rotation={[0, 0, -0.8]}
            scale={[0.12, 1.1, 0.12]}
          />
          <mesh
            geometry={FORM.stamm}
            material={rinde}
            position={[-0.4, 1.6 * h, 0.1]}
            rotation={[0.2, 0, 0.75]}
            scale={[0.11, 1, 0.11]}
          />
          <mesh geometry={FORM.kugel} material={laub} position={[0, 2.5 * h, 0]} scale={[1.2, 0.95, 1.2]} />
          <mesh geometry={FORM.kugel} material={laub} position={[1.15, 2.15 * h, 0.2]} scale={[0.95, 0.75, 0.95]} />
          <mesh geometry={FORM.kugel} material={laub} position={[-1.1, 2.2 * h, -0.2]} scale={[0.9, 0.75, 0.9]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0.2, 2.1 * h, 1]} scale={0.75} />
          <mesh geometry={FORM.kugel} material={laub} position={[-0.3, 2.2 * h, -1]} scale={0.7} />
        </>
      );

    case 'kegel': // Fichte: schmal, spitz
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.4 * h, 0]} scale={[0.12, 0.8 * h, 0.12]} />
          <mesh geometry={FORM.kegel} material={laub} position={[0, 1.5 * h, 0]} scale={[1.05, 1.8 * h, 1.05]} />
          <mesh geometry={FORM.kegel} material={laub} position={[0, 2.6 * h, 0]} scale={[0.82, 1.6 * h, 0.82]} />
          <mesh geometry={FORM.kegel} material={laub} position={[0, 3.6 * h, 0]} scale={[0.55, 1.5 * h, 0.55]} />
        </>
      );

    case 'kegel-flach': // Tanne: breiter, flache Spitze
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.4 * h, 0]} scale={[0.15, 0.8 * h, 0.15]} />
          <mesh geometry={FORM.kegel} material={laub} position={[0, 1.45 * h, 0]} scale={[1.35, 1.7 * h, 1.35]} />
          <mesh geometry={FORM.kegel} material={laub} position={[0, 2.45 * h, 0]} scale={[1.08, 1.5 * h, 1.08]} />
          <mesh geometry={FORM.tannenSpitze} material={laub} position={[0, 3.25 * h, 0]} scale={[0.72, 1 * h, 0.72]} />
        </>
      );

    case 'schirm': // Kiefer: hoher Stamm, oben rötlich, Schirmkrone
      return (
        <>
          <mesh
            geometry={FORM.stamm}
            material={matt(gefunden ? '#4A3A2E' : SILHOUETTE)}
            position={[0, 0.9 * h, 0]}
            scale={[0.15, 1.8 * h, 0.15]}
          />
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 2.6 * h, 0]} scale={[0.11, 1.6 * h, 0.11]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0, 3.55 * h, 0]} scale={[1.35, 0.5, 1.35]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0.8, 3.2 * h, 0.3]} scale={[0.7, 0.32, 0.7]} />
          <mesh geometry={FORM.kugel} material={laub} position={[-0.7, 3.3 * h, -0.4]} scale={[0.65, 0.3, 0.65]} />
        </>
      );

    case 'haengend': // Birke: weißer Stamm, lockere, hängende Krone
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 1.4 * h, 0]} scale={[0.1, 2.8 * h, 0.1]} />
          {[0.6, 1.3, 2].map((y) => (
            <mesh
              key={y}
              geometry={FORM.kiste}
              material={matt(gefunden ? '#2A2622' : SILHOUETTE)}
              position={[0, y * h, 0.07]}
              scale={[0.12, 0.05, 0.06]}
            />
          ))}
          <mesh geometry={FORM.kugel} material={laub} position={[0, 2.8 * h, 0]} scale={[0.95, 1.45 * h, 0.95]} />
          {/* hängende Zweige */}
          {[0, 1.6, 3.2, 4.8].map((w) => (
            <mesh
              key={w}
              geometry={FORM.kegel}
              material={laub}
              position={[Math.cos(w) * 0.75, 2 * h, Math.sin(w) * 0.75]}
              rotation={[Math.PI, 0, 0]}
              scale={[0.28, 1.3 * h, 0.28]}
            />
          ))}
        </>
      );

    case 'saeule':
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.6 * h, 0]} scale={[0.13, 1.2 * h, 0.13]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0, 2.6 * h, 0]} scale={[0.55, 1.8 * h, 0.55]} />
        </>
      );

    case 'oval':
    default:
      return (
        <>
          <mesh geometry={FORM.stamm} material={rinde} position={[0, 0.8 * h, 0]} scale={[0.15, 1.6 * h, 0.15]} />
          <mesh geometry={FORM.kugelFein} material={laub} position={[0, 2.5 * h, 0]} scale={[0.95, 1.35 * h, 0.95]} />
          <mesh geometry={FORM.kugel} material={laub} position={[0.4, 2.1 * h, 0.4]} scale={0.6} />
        </>
      );
  }
}
