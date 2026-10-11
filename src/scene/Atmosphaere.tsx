import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { FORM, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Alles, was die Stimmung macht: Himmel, Nebel, Licht, Sterne,
 * Glühwürmchen und ziehende Nebelschwaden – gesteuert von der Tageszeit.
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
      <Boden />
      <Sterne sichtbar={stimmung.sterne} />
      <Gluehwuermchen anteil={stimmung.gluehwuermchen} ruhig={ruhig} />
      <Nebelschwaden farbe={stimmung.nebel} ruhig={ruhig} />
    </>
  );
}

/** Waldboden, Lichtung und ein paar Steine */
function Boden() {
  const steine: [number, number, number, number][] = [
    [2.6, 0, 1.8, 0.35],
    [-2.9, 0, 1.2, 0.28],
    [3.4, 0, -1.9, 0.4],
    [-1.6, 0, -2.9, 0.3],
    [0.4, 0, 3.4, 0.22],
  ];
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={matt('#18261F')}>
        <circleGeometry args={[40, 24]} />
      </mesh>
      {/* hellere, moosige Lichtung um die Hütte */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={matt('#2A3D30')}>
        <circleGeometry args={[5.4, 18]} />
      </mesh>
      {steine.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y + s * 0.4, z]} scale={[s, s * 0.7, s]} material={matt('#4B514C')}>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
      {/* Pilzgruppe am Rand – ein kleines Geheimnis */}
      {[0, 0.35, -0.3].map((dx, i) => (
        <group key={i} position={[-3.6 + dx, 0, 2.4 + i * 0.2]} scale={0.16 + i * 0.04}>
          <mesh geometry={FORM.stamm} material={matt('#E8E2D2')} position={[0, 0.6, 0]} scale={[0.25, 1.2, 0.25]} />
          <mesh geometry={FORM.kugel} material={matt('#9C3A2C')} position={[0, 1.25, 0]} scale={[0.75, 0.4, 0.75]} />
        </group>
      ))}
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
