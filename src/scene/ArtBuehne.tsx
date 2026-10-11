import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as THREE from 'three';

import type { ModellParameter } from '@/data/artTypen';
import type { BaumModell } from '@/data/typen';
import { colors } from '@/theme/theme';

import { baueArtModell, einpassen, type Jahreszeit } from './artModell';
import { Baum3D } from './Baum3D';
import { GlbModell } from './GlbModell';
import { FehlerFaenger, MeldeLaden } from './LadeStatus';
import { Lidar } from './Lidar';
import { Drehung } from './steuerZustand';

/**
 * 3D-Bühne der Artenseite: das animierte Modell auf einem leuchtenden Runenkreis.
 * Solange die Art nicht gesammelt ist, zeigt sie nur eine dunkle Silhouette.
 * Ziehen nach links/rechts dreht das Modell; senkrecht scrollt die Seite weiter.
 */
type Props = {
  /** realistisches Modell (require('…glb')) – hat Vorrang vor den anderen */
  glb?: number;
  modell?: ModellParameter;
  baum?: BaumModell;
  silhouette: boolean;
  ruhig: boolean;
  hoehe?: number;
  /** Pflanzen: Zustand im gewählten Monat und Wachstum (0–1) – von den Reglern der Artenseite */
  pflanze?: Jahreszeit & { wuchs: number };
  /** Ladezustand eines GLB-Modells melden (für die Test-Ansicht) */
  melden?: (s: string) => void;
};

export function ArtBuehne({ glb, modell, baum, silhouette, ruhig, hoehe = 300, pflanze, melden }: Props) {
  const [drehung] = useState(() => new Drehung());
  const gesten = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-12, 12]) // erst bei waagerechter Bewegung drehen …
        .failOffsetY([-12, 12]) // … senkrecht bleibt Scrollen
        .onBegin(() => drehung.fingerAuf(true))
        .onChange((e) => drehung.ziehen(e.changeX))
        .onFinalize(() => drehung.fingerAuf(false)),
    [drehung],
  );

  return (
    <GestureDetector gesture={gesten}>
      <View style={{ height: hoehe }}>
        <Canvas style={StyleSheet.absoluteFill} camera={{ fov: 35, position: [0, 2.2, 5.4] }}>
          <hemisphereLight args={[colors.moon, colors.night, silhouette ? 0.5 : 1.1]} />
          <directionalLight position={[3, 5, 4]} intensity={silhouette ? 0.3 : 1.2} />
          {/* türkises Gegenlicht für einen weichen Leuchtrand */}
          <directionalLight position={[-4, 2, -4]} color={colors.rune} intensity={1.4} />
          <Runenkreis />
          <Drehteller drehung={drehung} ruhig={ruhig}>
            <Lidar key={String(silhouette)} ruhig={ruhig}>
              {glb ? (
                <FehlerFaenger melden={melden}>
                  <Suspense fallback={<MeldeLaden melden={melden} />}>
                    <GlbModell quelle={glb} ruhig={ruhig} melden={melden} />
                  </Suspense>
                </FehlerFaenger>
              ) : baum ? (
                <group scale={0.55}>
                  <Baum3D
                    id="buehne"
                    modell={baum}
                    gefunden={!silhouette}
                    position={[0, 0, 0]}
                    skala={1}
                    drehung={0}
                    ruhig={ruhig}
                    laub={pflanze?.laub}
                    wuchs={pflanze?.wuchs}
                  />
                </group>
              ) : modell ? (
                <group scale={Math.max(0.08, pflanze?.wuchs ?? 1)}>
                  <Modell
                    key={String(silhouette)}
                    modell={modell}
                    silhouette={silhouette}
                    ruhig={ruhig}
                    jahreszeit={pflanze}
                  />
                </group>
              ) : null}
            </Lidar>
          </Drehteller>
          <KameraBlick />
        </Canvas>
      </View>
    </GestureDetector>
  );
}

function Drehteller({ drehung, ruhig, children }: { drehung: Drehung; ruhig: boolean; children: React.ReactNode }) {
  const gruppe = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    drehung.weiter(dt, ruhig);
    if (gruppe.current) gruppe.current.rotation.y = drehung.winkel;
  });
  return <group ref={gruppe}>{children}</group>;
}

/** Das Modell einer Art (Blume, Pilz, Vogel, Säugetier) – einmal gebaut, dann nur noch bewegt */
function Modell({
  modell,
  silhouette,
  ruhig,
  jahreszeit,
}: {
  modell: ModellParameter;
  silhouette: boolean;
  ruhig: boolean;
  jahreszeit?: Jahreszeit;
}) {
  const [art] = useState(() => {
    const a = baueArtModell(modell, silhouette ? 'silhouette' : 'farbe');
    return { ...a, hoehe: einpassen(a.gruppe) };
  });
  // Pflanzen: Blüte, Früchte und Laub nach dem gewählten Monat
  const bluete = jahreszeit?.bluete;
  const frucht = jahreszeit?.frucht;
  const laub = jahreszeit?.laub;
  useEffect(() => {
    if (bluete !== undefined && frucht !== undefined && laub !== undefined) art.jahreszeit({ bluete, frucht, laub });
  }, [art, bluete, frucht, laub]);
  useFrame(({ clock }) => {
    if (!ruhig) art.bewege(clock.elapsedTime);
  });
  return (
    <>
      <primitive object={art.gruppe} />
      {/* Pilze: Wassertropfen fallen auf den Hut */}
      {modell.t === 'shroom' && !silhouette && !ruhig && <Wassertropfen hoehe={art.hoehe} />}
    </>
  );
}

/** Drei Tropfen fallen nacheinander auf den Pilzhut und hinterlassen einen kleinen Spritzring */
const TROPFEN = [
  { x: 0.12, z: 0.05, versatz: 0 },
  { x: -0.18, z: -0.1, versatz: 0.9 },
  { x: 0.02, z: -0.2, versatz: 1.7 },
];
const ZYKLUS = 2.6;

function Wassertropfen({ hoehe }: { hoehe: number }) {
  const tropfen = useRef<(THREE.Mesh | null)[]>([]);
  const ringe = useRef<(THREE.Mesh | null)[]>([]);
  const wasser = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#BFE3F2', transparent: true, opacity: 0.85 }),
    [],
  );
  const spritzer = useMemo(
    () =>
      TROPFEN.map(
        () => new THREE.MeshBasicMaterial({ color: '#D8F0FA', transparent: true, opacity: 0, side: THREE.DoubleSide }),
      ),
    [],
  );
  const aufprall = hoehe * 0.97; // Oberseite des Huts

  useFrame(({ clock }) => {
    TROPFEN.forEach((d, i) => {
      const tr = tropfen.current[i];
      const ri = ringe.current[i];
      if (!tr || !ri) return;
      const p = ((clock.elapsedTime + d.versatz) % ZYKLUS) / ZYKLUS;
      const fall = Math.min(1, p / 0.45); // Fallen in der ersten knappen Hälfte
      tr.visible = fall < 1;
      tr.position.set(d.x, aufprall + 1.4 * (1 - fall * fall), d.z);
      // Spritzring nach dem Aufprall
      const sp = p < 0.45 ? 0 : (p - 0.45) / 0.3;
      ri.visible = sp > 0 && sp < 1;
      ri.scale.setScalar(0.3 + sp * 1.4);
      (ri.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - sp);
    });
  });

  return (
    <>
      {TROPFEN.map((d, i) => (
        <group key={i}>
          <mesh
            ref={(m) => {
              tropfen.current[i] = m;
            }}
            material={wasser}
            scale={[0.035, 0.06, 0.035]}
          >
            <sphereGeometry args={[1, 8, 6]} />
          </mesh>
          <mesh
            ref={(m) => {
              ringe.current[i] = m;
            }}
            material={spritzer[i]}
            position={[d.x, aufprall + 0.01, d.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.06, 0.08, 16]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Runenkreis() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.45, 1.52, 64]} />
        <meshBasicMaterial color={colors.rune} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.45, 48]} />
        <meshBasicMaterial color={colors.forest} transparent opacity={0.7} />
      </mesh>
    </>
  );
}

/** Kamera schaut leicht von oben auf die Mitte des Modells */
function KameraBlick() {
  useFrame(({ camera }) => camera.lookAt(0, 1.1, 0));
  return null;
}
