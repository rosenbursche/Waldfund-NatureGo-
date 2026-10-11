import { Canvas, useFrame } from '@react-three/fiber/native';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type * as THREE from 'three';

import type { ModellParameter } from '@/data/artTypen';
import type { BaumModell } from '@/data/typen';
import { colors } from '@/theme/theme';

import { baueArtModell, einpassen } from './artModell';
import { Baum3D } from './Baum3D';
import { Lidar } from './Lidar';
import { Drehung } from './steuerZustand';

/**
 * 3D-Bühne der Artenseite: das animierte Modell auf einem leuchtenden Runenkreis.
 * Solange die Art nicht gesammelt ist, zeigt sie nur eine dunkle Silhouette.
 * Ziehen nach links/rechts dreht das Modell; senkrecht scrollt die Seite weiter.
 */
type Props = { modell?: ModellParameter; baum?: BaumModell; silhouette: boolean; ruhig: boolean; hoehe?: number };

export function ArtBuehne({ modell, baum, silhouette, ruhig, hoehe = 300 }: Props) {
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
              {baum ? (
                <group scale={0.55}>
                  <Baum3D
                    id="buehne"
                    modell={baum}
                    gefunden={!silhouette}
                    position={[0, 0, 0]}
                    skala={1}
                    drehung={0}
                    ruhig={ruhig}
                  />
                </group>
              ) : modell ? (
                <Modell key={String(silhouette)} modell={modell} silhouette={silhouette} ruhig={ruhig} />
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
function Modell({ modell, silhouette, ruhig }: { modell: ModellParameter; silhouette: boolean; ruhig: boolean }) {
  const [art] = useState(() => {
    const a = baueArtModell(modell, silhouette ? 'silhouette' : 'farbe');
    einpassen(a.gruppe);
    return a;
  });
  useFrame(({ clock }) => {
    if (!ruhig) art.bewege(clock.elapsedTime);
  });
  return <primitive object={art.gruppe} />;
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
