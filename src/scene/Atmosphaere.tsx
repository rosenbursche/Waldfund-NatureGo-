import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { leuchtTextur } from './texturen';

/**
 * Alles, was die Stimmung macht: Himmel, Nebel, Licht, Sterne,
 * Glühwürmchen und ziehende Nebelschwaden – gesteuert von der Tageszeit.
 * Boden, Pflanzen und Kleinkram der Lichtung: LichtungDetails.tsx
 */
export function Atmosphaere({ stimmung, ruhig }: { stimmung: Stimmung; ruhig: boolean }) {
  const h = stimmung.lichtHoehe;
  return (
    <>
      {/* Himmel und Nebel – "attach" hängt sie direkt an die Szene */}
      <color attach="background" args={[stimmung.himmel]} />
      <fogExp2 attach="fog" args={[stimmung.nebel, stimmung.nebelDichte]} />
      <ambientLight color={stimmung.umgebung} intensity={stimmung.umgebungStaerke} />
      <hemisphereLight args={[stimmung.himmel, colors.night, 0.35]} />
      <directionalLight
        color={stimmung.licht}
        intensity={stimmung.lichtStaerke}
        position={[-12 * (1 - h), 4 + 18 * h, -8]}
      />
      <Sterne sichtbar={stimmung.sterne} />
      <Gluehwuermchen anteil={stimmung.gluehwuermchen} ruhig={ruhig} />
      <Nebelschwaden farbe={stimmung.nebel} ruhig={ruhig} />
    </>
  );
}

/** Sterne auf einer großen Halbkugel – nur nachts sichtbar */
function Sterne({ sichtbar }: { sichtbar: number }) {
  const geo = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // feste "Zufalls"-Verteilung über den Himmel
      const u = ((i * 0.618034) % 1) * Math.PI * 2;
      const v = 0.15 + ((i * 0.381966 * 7) % 1) * 0.8;
      const r = 70;
      pos[i * 3] = Math.cos(u) * Math.cos(v * 1.3) * r;
      pos[i * 3 + 1] = Math.sin(v * 1.3) * r * 0.8 + 6;
      pos[i * 3 + 2] = Math.sin(u) * Math.cos(v * 1.3) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: colors.moon,
        size: 2,
        sizeAttenuation: false,
        transparent: true,
        opacity: sichtbar,
        fog: false,
        depthWrite: false,
      }),
    [sichtbar],
  );
  if (sichtbar < 0.02) return null;
  return <points geometry={geo} material={mat} />;
}

/** Glühwürmchen bzw. Sporen: kleine, warme Lichtpunkte, die über der Lichtung tanzen */
const GLUEH_ANZAHL = 46;

function Gluehwuermchen({ anteil, ruhig }: { anteil: number; ruhig: boolean }) {
  const punkte = useRef<THREE.Points>(null);
  const basis = useMemo(
    () =>
      Array.from({ length: GLUEH_ANZAHL }, (_, i) => {
        const w = i * 2.399; // goldener Winkel → gleichmäßig verteilt
        const r = 2 + ((i * 0.37) % 1) * 9;
        return { x: Math.cos(w) * r, z: Math.sin(w) * r, y: 0.4 + ((i * 0.61) % 1) * 2.4, p: i * 1.7 };
      }),
    [],
  );
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(GLUEH_ANZAHL * 3), 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: colors.amber,
        size: 0.35,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const p = punkte.current;
    if (!p) return;
    const t = ruhig ? 0 : clock.elapsedTime;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const sichtbar = Math.round(GLUEH_ANZAHL * anteil);
    basis.forEach((b, i) => {
      if (i >= sichtbar) {
        pos.setXYZ(i, 0, -50, 0); // unsichtbar unter dem Boden parken
        return;
      }
      pos.setXYZ(
        i,
        b.x + Math.sin(t * 0.3 + b.p) * 0.8,
        b.y + Math.sin(t * 0.7 + b.p * 2) * 0.35,
        b.z + Math.cos(t * 0.25 + b.p) * 0.8,
      );
    });
    pos.needsUpdate = true;
    // sanftes Pulsieren
    (p.material as THREE.PointsMaterial).opacity = 0.55 + Math.sin(t * 1.3) * 0.25;
  });

  return <points ref={punkte} geometry={geo} material={mat} />;
}

/** Große, weiche Nebelschwaden, die langsam um die Lichtung ziehen */
const SCHWADEN = 12;

function Nebelschwaden({ farbe, ruhig }: { farbe: string; ruhig: boolean }) {
  const gruppe = useRef<THREE.Group>(null);
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: leuchtTextur(),
        color: farbe,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    [farbe],
  );
  useFrame((_, dt) => {
    if (!ruhig && gruppe.current) gruppe.current.rotation.y += dt * 0.012;
  });
  return (
    <group ref={gruppe}>
      {Array.from({ length: SCHWADEN }, (_, i) => {
        const w = (i / SCHWADEN) * Math.PI * 2;
        const r = 6 + (i % 3) * 3.5;
        return (
          <sprite
            key={i}
            material={mat}
            position={[Math.cos(w) * r, 0.9 + (i % 2) * 0.6, Math.sin(w) * r]}
            scale={[9, 3, 1]}
          />
        );
      })}
    </group>
  );
}
