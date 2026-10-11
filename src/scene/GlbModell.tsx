import { useFrame, useLoader } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { einpassen } from './artModell';

/**
 * Lädt ein realistisches 3D-Modell (GLB) aus dem App-Paket.
 *
 * - Hat die Datei Animationen (z. B. `idle`, `ohren`, `umsehen`, siehe docs/3D-PIPELINE.md),
 *   läuft `idle` als Schleife und ab und zu wird zufällig ein anderer Ablauf eingestreut.
 * - Hat sie keine (wie der Test-Hirsch), atmet das Modell sanft: leichtes Heben und Senken.
 * - Bei "Bewegung reduzieren" steht das Modell still.
 *
 * `quelle` ist das Ergebnis von require('…/datei.glb').
 */
type Props = { quelle: number; ruhig: boolean; groesse?: number; melden?: (s: string) => void };

export function GlbModell({ quelle, ruhig, groesse = 2.6, melden }: Props) {
  const gltf = useLoader(GLTFLoader, quelle as unknown as string);
  const atmen = useRef<THREE.Group>(null);

  // Modell einmal auf die Bühnengröße bringen
  const szene = useMemo(() => {
    const s = gltf.scene;
    einpassen(s, groesse);
    return s;
  }, [gltf, groesse]);

  // Status melden: wie viele Teile, ist die Textur angekommen?
  useEffect(() => {
    let teile = 0;
    let mitTextur = 0;
    szene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      teile += 1;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.map?.image) mitTextur += 1;
    });
    const text = `Geladen: ${teile} Teil${teile === 1 ? '' : 'e'}, ${mitTextur > 0 ? 'mit Textur' : 'ohne Textur (Textur fehlt)'}, ${gltf.animations.length} Animationen`;
    console.log('[3D-Test]', text);
    melden?.(text);
  }, [szene, gltf, melden]);

  // Eingebaute Animationen (falls vorhanden)
  const mixer = useMemo(() => (gltf.animations.length > 0 ? new THREE.AnimationMixer(szene) : null), [gltf, szene]);
  const naechsterWechsel = useRef(6);
  useEffect(() => {
    if (!mixer || ruhig) return;
    const idle = THREE.AnimationClip.findByName(gltf.animations, 'idle') ?? gltf.animations[0];
    mixer.clipAction(idle).play();
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, gltf, ruhig]);

  useFrame(({ clock }, dt) => {
    if (ruhig) return;
    if (mixer) {
      mixer.update(dt);
      // ab und zu einen kurzen Ablauf (Ohren, Umsehen …) einstreuen
      if (clock.elapsedTime > naechsterWechsel.current && gltf.animations.length > 1) {
        naechsterWechsel.current = clock.elapsedTime + 5 + Math.random() * 6;
        const kurz = gltf.animations.filter((a) => a.name !== 'idle');
        const clip = kurz[Math.floor(Math.random() * kurz.length)];
        const aktion = mixer.clipAction(clip);
        aktion.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.3).play();
        aktion.clampWhenFinished = false;
      }
      return;
    }
    // ohne Skelett: sanftes Atmen (Brustkorb hebt und senkt sich, minimales Wiegen)
    if (atmen.current) {
      const t = clock.elapsedTime;
      atmen.current.scale.set(1, 1 + Math.sin(t * 1.6) * 0.006, 1 + Math.sin(t * 1.6) * 0.004);
      atmen.current.rotation.z = Math.sin(t * 0.45) * 0.008;
    }
  });

  return (
    <group ref={atmen}>
      <primitive object={szene} />
    </group>
  );
}
