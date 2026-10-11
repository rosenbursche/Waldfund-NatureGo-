import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { zufall } from '@/logic/lichtung';
import { AUSSTATTUNG } from '@/logic/lichtungDetails';
import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { leuchtTextur } from './texturen';

/**
 * Bewegung auf der Lichtung: fallende Blätter, Motten um die Laterne,
 * Vögel, die hoch über dem Wald kreisen, und Staubkörnchen, die im Licht schweben.
 * Bei "Bewegung reduzieren" ist alles ausgeblendet.
 */
export function LichtungLeben({ stimmung, ruhig }: { stimmung: Stimmung; ruhig: boolean }) {
  if (ruhig) return null;
  return (
    <>
      <FallendeBlaetter />
      <Motten staerke={stimmung.fenster} />
      {stimmung.sterne < 0.6 && <Voegel />}
      <Staub anteil={1 - stimmung.sterne} farbe={stimmung.licht} />
    </>
  );
}

const HILFE = new THREE.Object3D();
const BLATT_FARBEN = ['#7A5A30', '#8A6A3A', '#6B4A2E', '#5A6B3E'];

// ---------- fallende Blätter ----------

const BLAETTER = 26;
const BLATT_HOEHE = 6;

type Bahn = { x: number; z: number; tempo: number; phase: number };

/** Ein Bild weiter: jedes Blatt sinkt, pendelt und trudelt (außerhalb der Komponente – React-Compiler) */
function blaetterBewegen(mesh: THREE.InstancedMesh, bahnen: Bahn[], t: number) {
  bahnen.forEach((b, i) => {
    const lauf = (t * b.tempo + b.phase) % BLATT_HOEHE; // 0 … Höhe, dann von vorn
    const y = BLATT_HOEHE - lauf;
    // Pendeln und Trudeln wie ein echtes Blatt
    HILFE.position.set(b.x + Math.sin(t * 1.3 + b.phase) * 0.5, y, b.z + Math.cos(t * 0.9 + b.phase) * 0.4);
    HILFE.rotation.set(Math.sin(t * 2.1 + b.phase) * 1.2, t * 0.8 + b.phase, Math.cos(t * 1.7 + b.phase) * 0.9);
    HILFE.scale.setScalar(y < 0.05 ? 0 : 1);
    HILFE.updateMatrix();
    mesh.setMatrixAt(i, HILFE.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function FallendeBlaetter() {
  const mesh = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.09, 0.13);
    const mat = new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide });
    const m = new THREE.InstancedMesh(geo, mat, BLAETTER);
    const c = new THREE.Color();
    for (let i = 0; i < BLAETTER; i++) m.setColorAt(i, c.set(BLATT_FARBEN[i % BLATT_FARBEN.length]));
    m.frustumCulled = false;
    m.raycast = () => {};
    return m;
  }, []);
  const bahnen = useMemo((): Bahn[] => {
    const rnd = zufall(77);
    return Array.from({ length: BLAETTER }, () => {
      // Blätter fallen von den Baumkronen rund um die Lichtung
      const w = rnd() * Math.PI * 2;
      const r = 4 + rnd() * 8;
      return { x: Math.cos(w) * r, z: Math.sin(w) * r, tempo: 0.25 + rnd() * 0.25, phase: rnd() * 10 };
    });
  }, []);

  useFrame(({ clock }) => blaetterBewegen(mesh, bahnen, clock.elapsedTime));

  return <primitive object={mesh} />;
}

// ---------- Motten an der Laterne ----------

const MOTTEN = 6;

function Motten({ staerke }: { staerke: number }) {
  const punkte = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MOTTEN * 3), 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: colors.paper,
        size: 0.09,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    [],
  );
  const l = AUSSTATTUNG.laterne;

  useFrame(({ clock }) => {
    const p = punkte.current;
    if (!p) return;
    const t = clock.elapsedTime;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < MOTTEN; i++) {
      // unruhiges Flattern um das Licht
      const w = t * (2.2 + i * 0.4) + i * 2;
      const r = 0.18 + Math.sin(t * 3 + i) * 0.08;
      pos.setXYZ(i, l.x - 0.28 + Math.cos(w) * r, 1.22 + Math.sin(t * 4.3 + i * 1.7) * 0.15, l.z + Math.sin(w) * r);
    }
    pos.needsUpdate = true;
    (p.material as THREE.PointsMaterial).opacity = 0.9 * staerke;
  });

  if (staerke < 0.15) return null;
  return <points ref={punkte} geometry={geo} material={mat} raycast={() => {}} />;
}

// ---------- Vögel hoch über dem Wald ----------

/** Vogel-Silhouette: zwei schmale Flügel, die schlagen (Mitte bleibt, Spitzen gehen auf und ab) */
function vogelGeometrie() {
  const g = new THREE.BufferGeometry();
  // Mitte, linke Spitze, rechte Spitze, Körper vorne/hinten
  g.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, 0, 0.12, -0.6, 0, -0.05, 0, 0, -0.12, 0.6, 0, -0.05], 3),
  );
  g.setIndex([0, 1, 2, 0, 2, 3]);
  return g;
}

const VOEGEL = 5;

function Voegel() {
  const gruppe = useRef<THREE.Group>(null);
  const geo = useMemo(() => vogelGeometrie(), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: colors.night, side: THREE.DoubleSide }), []);
  const fluegel = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (gruppe.current) gruppe.current.rotation.y = -t * 0.05;
    fluegel.current.forEach((m, i) => {
      if (!m) return;
      // Flügelschlag: leichtes Kippen um die Längsachse
      m.rotation.z = Math.sin(t * 7 + i * 1.3) * 0.35;
      m.position.y = 18 + Math.sin(t * 0.6 + i) * 0.6;
    });
  });

  return (
    <group ref={gruppe}>
      {Array.from({ length: VOEGEL }, (_, i) => {
        // lockerer Schwarm auf einer großen Kreisbahn
        const w = i * 0.18;
        const r = 24 + (i % 2) * 1.5;
        return (
          <mesh
            key={i}
            ref={(m) => {
              fluegel.current[i] = m;
            }}
            geometry={geo}
            material={mat}
            position={[Math.cos(w) * r, 18, Math.sin(w) * r]}
            rotation={[0, -w, 0]}
            scale={1.4}
            raycast={() => {}}
          />
        );
      })}
    </group>
  );
}

// ---------- Staub im Licht ----------

const STAUB = 70;

function Staub({ anteil, farbe }: { anteil: number; farbe: string }) {
  const punkte = useRef<THREE.Points>(null);
  const basis = useMemo(() => {
    const rnd = zufall(31);
    return Array.from({ length: STAUB }, () => {
      const w = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * 6;
      return { x: Math.cos(w) * r, z: Math.sin(w) * r, y: 0.5 + rnd() * 3.5, p: rnd() * 10 };
    });
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(STAUB * 3), 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: leuchtTextur(),
        color: farbe,
        size: 0.06,
        transparent: true,
        opacity: 0.5 * anteil,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [farbe, anteil],
  );

  useFrame(({ clock }) => {
    const p = punkte.current;
    if (!p) return;
    const t = clock.elapsedTime;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    basis.forEach((b, i) => {
      // ganz langsames Schweben, leicht nach oben
      pos.setXYZ(
        i,
        b.x + Math.sin(t * 0.15 + b.p) * 0.4,
        b.y + ((t * 0.04 + b.p) % 1) * 0.6,
        b.z + Math.cos(t * 0.12 + b.p) * 0.4,
      );
    });
    pos.needsUpdate = true;
  });

  if (anteil < 0.1) return null;
  return <points ref={punkte} geometry={geo} material={mat} raycast={() => {}} />;
}
