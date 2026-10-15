import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { Suspense, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import type { Seite } from '@/logic/kampf';
import { stimmungJetzt } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { einpassen } from './artModell';
import type { KampfRegie } from './kampfRegie';
import { FehlerFaenger, MeldeLaden } from './LadeStatus';

/**
 * Kampf-Arena: zwei Tiere stehen sich auf einem Runenkreis gegenüber,
 * ringsum Feldsteine und Fichten im Nebel. Licht und Nebel folgen der echten Uhrzeit.
 *
 * Die Tiere bewegen sich nach der `KampfRegie` (Angriff, Treffer, Tarnen, Hinlegen).
 */
type Props = {
  /** require('…glb') des Modells für beide Seiten */
  glb: number;
  /** Drehung um die Hochachse, damit das Modell nach +Z schaut (Vorgabe aus docs/3D-PIPELINE.md) */
  blick: number;
  regie: KampfRegie;
  ruhig: boolean;
  hoehe?: number;
  melden?: (s: string) => void;
};

const ABSTAND = 1.55; // halber Abstand der beiden Tiere
const ARENA = 3.2; // Radius des Runenkreises

export function KampfArena({ glb, blick, regie, ruhig, hoehe = 320, melden }: Props) {
  const stimmung = useMemo(() => stimmungJetzt(), []);
  return (
    <View style={{ height: hoehe }}>
      <Canvas style={StyleSheet.absoluteFill} camera={{ fov: 38, position: [0, 2.7, 7.4] }}>
        <color attach="background" args={[stimmung.himmel]} />
        <fog attach="fog" args={[stimmung.nebel, 7, 20]} />
        <hemisphereLight args={[stimmung.umgebung, colors.night, stimmung.umgebungStaerke + 0.5]} />
        <directionalLight
          position={[3, 2 + stimmung.lichtHoehe * 6, 4]}
          color={stimmung.licht}
          intensity={stimmung.lichtStaerke + 0.6}
        />
        {/* türkises Gegenlicht für einen weichen Leuchtrand */}
        <directionalLight position={[0, 3, -6]} color={colors.rune} intensity={1.2} />
        <Boden />
        <Steine />
        <Fichten />
        <FehlerFaenger melden={melden}>
          <Suspense fallback={<MeldeLaden melden={melden} />}>
            <Tier seite="spieler" glb={glb} blick={blick} regie={regie} ruhig={ruhig} />
            <Tier seite="gegner" glb={glb} blick={blick} regie={regie} ruhig={ruhig} />
          </Suspense>
        </FehlerFaenger>
        <KameraBlick />
      </Canvas>
    </View>
  );
}

function Tier({
  seite,
  glb,
  blick,
  regie,
  ruhig,
}: {
  seite: Seite;
  glb: number;
  blick: number;
  regie: KampfRegie;
  ruhig: boolean;
}) {
  const gltf = useLoader(GLTFLoader, glb as unknown as string);
  const links = seite === 'spieler';
  // Jede Seite bekommt eine eigene Kopie. Der Gegner etwas dunkler, damit man beide unterscheidet.
  const kopie = useMemo(() => {
    const k = gltf.scene.clone(true);
    if (!links) {
      k.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.color.multiplyScalar(0.72);
        m.material = mat;
      });
    }
    einpassen(k, 2.0);
    return k;
  }, [gltf, links]);

  const koerper = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const schleier = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () => ({
      ring: new THREE.MeshBasicMaterial({ color: colors.amber, transparent: true, opacity: 0, side: THREE.DoubleSide }),
      schleier: new THREE.MeshBasicMaterial({ color: colors.rune, transparent: true, opacity: 0, depthWrite: false }),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    regie.takt(t);
    const p = regie.pose(seite, t, ruhig);
    const k = koerper.current;
    if (k) {
      // „vor“ zeigt in der Gruppe nach +Z, also zum Gegner
      k.position.set(p.seit, p.hoch, p.vor);
      k.rotation.set(p.nick, 0, p.kipp);
      // Grundatmen, solange nichts passiert
      if (!ruhig) k.scale.set(1, 1 + Math.sin(t * 1.6 + (links ? 0 : 1.3)) * 0.006, 1);
    }
    const tr = regie.trefferRing(seite, t);
    if (ring.current) {
      ring.current.visible = !!tr && !ruhig;
      if (tr) {
        ring.current.scale.setScalar(0.4 + tr.fortschritt * (tr.spezial ? 2.2 : 1.3));
        // über die Mesh-Referenz ändern (Lint-Regel: Hook-Werte nicht direkt verändern)
        const m = ring.current.material as THREE.MeshBasicMaterial;
        m.color.set(tr.spezial ? colors.amber : colors.moon);
        m.opacity = 0.8 * (1 - tr.fortschritt);
      }
    }
    if (schleier.current) {
      const s = regie.tarnung(seite, t);
      schleier.current.visible = s > 0;
      (schleier.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * s;
    }
  });

  return (
    <group position={[links ? -ABSTAND : ABSTAND, 0, 0]} rotation={[0, links ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <group ref={koerper}>
        <group rotation={[0, blick, 0]}>
          <primitive object={kopie} />
        </group>
      </group>
      {/* Treffer: Leuchtring auf Brusthöhe */}
      <mesh ref={ring} material={material.ring} position={[0, 0.9, 0.3]} visible={false}>
        <ringGeometry args={[0.3, 0.36, 32]} />
      </mesh>
      {/* Tarnen: Nebelschleier um das Tier */}
      <mesh ref={schleier} material={material.schleier} position={[0, 0.8, 0]} visible={false}>
        <sphereGeometry args={[1.3, 20, 14]} />
      </mesh>
      {/* Bodenkreis unter dem Tier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.85, 0.9, 40]} />
        <meshBasicMaterial color={links ? colors.rune : colors.amber} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Boden() {
  const runen = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[24, 48]} />
        <meshLambertMaterial color={colors.forest} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[ARENA, 64]} />
        <meshLambertMaterial color={colors.moss} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[ARENA - 0.08, ARENA, 96]} />
        <meshBasicMaterial color={colors.rune} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[ARENA - 0.5, ARENA - 0.46, 96]} />
        <meshBasicMaterial color={colors.rune} transparent opacity={0.3} />
      </mesh>
      {/* Mittellinie zwischen den beiden Seiten */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[0.04, ARENA * 1.6]} />
        <meshBasicMaterial color={colors.rune} transparent opacity={0.25} />
      </mesh>
      {/* leuchtende Runenzeichen auf dem Ring */}
      {runen.map((w, i) => (
        <mesh
          key={i}
          position={[Math.cos(w) * (ARENA - 0.27), 0.01, Math.sin(w) * (ARENA - 0.27)]}
          rotation={[-Math.PI / 2, 0, -w]}
        >
          <planeGeometry args={[0.1, 0.22]} />
          <meshBasicMaterial color={i % 3 === 0 ? colors.amber : colors.rune} transparent opacity={0.75} />
        </mesh>
      ))}
    </>
  );
}

/** Feldsteine rund um die Arena (nicht vorn, damit sie die Tiere nicht verdecken) */
function Steine() {
  const steine = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 0);
    const mat = new THREE.MeshLambertMaterial({ color: colors.fog });
    const liste = [-2.6, -2.1, -1.6, -1.0, -0.5, 0.5, 1.0, 1.6, 2.1, 2.6].map((w, i) => ({
      x: Math.sin(w) * (ARENA + 0.6),
      z: -Math.cos(w) * (ARENA + 0.6),
      s: 0.25 + ((i * 37) % 10) / 30,
      d: i * 1.7,
    }));
    return { geo, mat, liste };
  }, []);
  return (
    <>
      {steine.liste.map((s, i) => (
        <mesh
          key={i}
          geometry={steine.geo}
          material={steine.mat}
          position={[s.x, s.s * 0.5, s.z]}
          scale={[s.s, s.s * 1.5, s.s]}
          rotation={[0, s.d, 0.1]}
        />
      ))}
    </>
  );
}

/** Dunkle Fichten-Umrisse im Hintergrund, verschwinden im Nebel */
function Fichten() {
  const baeume = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 1, 7);
    const mat = new THREE.MeshLambertMaterial({ color: colors.night });
    const liste = Array.from({ length: 26 }, (_, i) => {
      const w = -1.35 + (i / 25) * 2.7 + Math.sin(i * 12.9) * 0.05;
      const r = 8 + ((i * 53) % 7);
      const h = 3 + ((i * 29) % 5) * 0.7;
      return { x: Math.sin(w) * r, z: -Math.cos(w) * r, h, b: h * 0.3 };
    });
    return { geo, mat, liste };
  }, []);
  return (
    <>
      {baeume.liste.map((b, i) => (
        <mesh
          key={i}
          geometry={baeume.geo}
          material={baeume.mat}
          position={[b.x, b.h / 2, b.z]}
          scale={[b.b, b.h, b.b]}
        />
      ))}
    </>
  );
}

/** Kamera schaut leicht von oben auf die Mitte der Arena */
function KameraBlick() {
  useFrame(({ camera }) => camera.lookAt(0, 0.8, 0));
  return null;
}
