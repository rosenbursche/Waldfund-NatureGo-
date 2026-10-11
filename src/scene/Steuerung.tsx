import { useFrame, useThree } from '@react-three/fiber/native';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { PunkteKanal, Steuerung, Ziel } from './steuerZustand';

const ZIEL_PUNKT = new THREE.Vector3(0, 1.4, 0);

/**
 * Kamera: schwebt ohne Berührung langsam um die Lichtung,
 * lässt sich mit dem Finger drehen und verschiebt sich leicht, wenn man das Handy kippt.
 */
export function Kamera({ steuer, ruhig }: { steuer: Steuerung; ruhig: boolean }) {
  const { camera } = useThree();
  const kippen = useRef({ x: 0, y: 0, ruheX: null as number | null, ruheY: null as number | null });
  const glatt = useRef({ x: 0, y: 0 });

  // Gyroskop / Lagesensor für die Parallaxe
  useEffect(() => {
    if (ruhig) return;
    DeviceMotion.setUpdateInterval(50);
    const abo = DeviceMotion.addListener(({ rotation }) => {
      if (!rotation) return;
      const k = kippen.current;
      // Die Haltung beim Start gilt als "Ruhe" – nur Abweichungen davon verschieben die Szene
      if (k.ruheX === null) k.ruheX = rotation.gamma;
      if (k.ruheY === null) k.ruheY = rotation.beta;
      k.x = THREE.MathUtils.clamp(rotation.gamma - k.ruheX, -0.5, 0.5);
      k.y = THREE.MathUtils.clamp(rotation.beta - (k.ruheY ?? 0), -0.5, 0.5);
    });
    return () => abo.remove();
  }, [ruhig]);

  useFrame((_, dt) => {
    if (!ruhig) steuer.schweben(dt);
    // Parallaxe weich nachziehen
    glatt.current.x += (kippen.current.x - glatt.current.x) * 0.08;
    glatt.current.y += (kippen.current.y - glatt.current.y) * 0.08;

    const r = 17 - steuer.neigung * 2;
    const hoehe = 5.5 + steuer.neigung * 4 + glatt.current.y * 2;
    const w = steuer.winkel + glatt.current.x * 0.25;
    camera.position.set(Math.sin(w) * r, hoehe, Math.cos(w) * r);
    camera.lookAt(ZIEL_PUNKT);
  });

  return null;
}

/** Wertet Tipps aus: Welcher Baum oder Runenstein liegt unter dem Finger? */
export function Tippen({ steuer, onZiel }: { steuer: Steuerung; onZiel: (z: Ziel) => void }) {
  const { camera, scene, size, raycaster } = useThree();
  const ndc = useRef(new THREE.Vector2());

  useFrame(() => {
    const tipp = steuer.nimmTipp();
    if (!tipp) return;

    ndc.current.set((tipp.x / size.width) * 2 - 1, -(tipp.y / size.height) * 2 + 1);
    raycaster.setFromCamera(ndc.current, camera);
    for (const treffer of raycaster.intersectObjects(scene.children, true)) {
      // vom getroffenen Teil nach oben laufen, bis ein Objekt mit "ziel" kommt
      let o: THREE.Object3D | null = treffer.object;
      while (o && !o.userData.ziel) o = o.parent;
      if (o) {
        onZiel(o.userData.ziel as Ziel);
        return;
      }
    }
  });

  return null;
}

/**
 * Rechnet 3D-Positionen in Bildschirmpunkte um (ca. 10× pro Sekunde),
 * damit über den Runensteinen lesbare Beschriftungen stehen können.
 */
export function Projektor({
  punkte,
  kanal,
}: {
  punkte: { id: string; position: [number, number, number] }[];
  kanal: PunkteKanal;
}) {
  const { camera, size } = useThree();
  const zeit = useRef(0);
  const v = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    zeit.current += dt;
    if (zeit.current < 0.1 || !kanal.hatHoerer()) return;
    zeit.current = 0;
    kanal.melden(
      punkte.map(({ id, position }) => {
        v.current.set(position[0], position[1], position[2]).project(camera);
        return {
          id,
          x: ((v.current.x + 1) / 2) * size.width,
          y: ((1 - v.current.y) / 2) * size.height,
          sichtbar: v.current.z < 1,
        };
      }),
    );
  });

  return null;
}
