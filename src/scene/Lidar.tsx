import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

import { colors } from '@/theme/theme';

import {
  einblenden,
  PUNKTE as LIDAR_PUNKTE,
  lidarPunkteSetzen,
  scanHoehe,
  vorbereiten,
  zuruecksetzen,
  type LidarZustand,
} from './lidarLogik';
import { leuchtTextur } from './texturen';

/**
 * LiDAR-Enthüllung: Das Modell erscheint zuerst als Laser-Punktwolke.
 * Eine Scan-Linie fährt von unten nach oben, die Punkte fliegen an ihren Platz auf der
 * Oberfläche, dann blendet das echte Modell ein und die Punkte verglimmen.
 *
 * Funktioniert mit jedem Modell darunter (auch später mit realistischen GLB-Modellen):
 * Die Punkte werden direkt auf den Flächen der Kinder verteilt.
 * Bei "Bewegung reduzieren" wird das Modell sofort gezeigt.
 */
const DAUER_FLUG = 1.5; // Sekunden, bis die Punkte sitzen
const DAUER_EINBLENDEN = 0.7;

export function Lidar({ ruhig, children }: { ruhig: boolean; children: ReactNode }) {
  const gruppe = useRef<THREE.Group>(null);
  const punkte = useRef<THREE.Points>(null);
  const scan = useRef<THREE.Mesh>(null);
  const zustand = useRef<LidarZustand | null>(null);
  const zeit = useRef(0);
  const fertig = useRef(ruhig);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(LIDAR_PUNKTE * 3), 3));
    return g;
  }, []);
  const punktMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: colors.rune,
        size: 0.034,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const scanMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.rune,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  // Wird die Seite mitten im Effekt verlassen: Materialien sicher zurücksetzen
  // (Bäume teilen ihre Materialien mit der Lichtung)
  useEffect(() => () => zuruecksetzen(zustand.current), []);

  useFrame((_, dt) => {
    const g = gruppe.current;
    const p = punkte.current;
    if (!g || !p || fertig.current) return;

    // Beim ersten Bild: Punkte auf den Flächen verteilen und das Modell unsichtbar machen
    if (!zustand.current) {
      zustand.current = vorbereiten(g, p);
      if (!zustand.current) {
        fertig.current = true; // nichts zum Abtasten
        return;
      }
    }
    const z = zustand.current;
    zeit.current += dt;
    const t = zeit.current;

    // 1) Scan-Linie fährt von unten nach oben (etwas über das Modell hinaus), Punkte erscheinen und setzen sich
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const scanY = scanHoehe(z, t / DAUER_FLUG);
    lidarPunkteSetzen(z, pos.array as Float32Array, scanY);
    pos.needsUpdate = true;
    if (scan.current) {
      scan.current.position.y = scanY;
      (scan.current.material as THREE.MeshBasicMaterial).opacity =
        t < DAUER_FLUG ? 0.8 : Math.max(0, 0.8 - (t - DAUER_FLUG) * 3);
    }

    // 2) Modell blendet ein, Punkte verglimmen
    const e = Math.max(0, Math.min(1, (t - DAUER_FLUG) / DAUER_EINBLENDEN));
    einblenden(z, e);
    (p.material as THREE.PointsMaterial).opacity = 0.95 * (1 - e);

    if (e >= 1) {
      zuruecksetzen(z);
      p.visible = false;
      if (scan.current) scan.current.visible = false;
      fertig.current = true;
    }
  });

  return (
    <group>
      <group ref={gruppe}>{children}</group>
      {!ruhig && (
        <>
          <points ref={punkte} geometry={geo} material={punktMaterial} />
          <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]} material={scanMaterial}>
            <ringGeometry args={[1.22, 1.3, 64]} />
          </mesh>
        </>
      )}
    </group>
  );
}
