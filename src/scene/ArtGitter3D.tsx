import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type * as THREE from 'three';

import { colors } from '@/theme/theme';

import { ArtFigur } from './ArtFigur';
import type { ModellStil } from './artModell';
import { FehlerFaenger } from './LadeStatus';

/**
 * Mehrere Arten als kleine 3D-Modelle in EINER 3D-Fläche (spart Leistung gegenüber
 * einer Fläche pro Art). Die Kamera ist orthografisch mit 1 Einheit = 1 Bildpunkt,
 * so stehen die Modelle genau über den Kärtchen, die der Screen darunter legt.
 */
export type GitterZelle = {
  id: string;
  /** Mitte des Modell-Bereichs in Bildpunkten (von links oben) */
  x: number;
  y: number;
  /** Größe des Modells in Bildpunkten */
  groesse: number;
  stil: ModellStil;
  /** Farbe des Leuchtrings am Boden (Seltenheit) */
  farbe: string;
};

type Props = { zellen: GitterZelle[]; breite: number; hoehe: number; ruhig: boolean };

export function ArtGitter3D({ zellen, breite, hoehe, ruhig }: Props) {
  if (breite <= 0) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { height: hoehe }]} pointerEvents="none">
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 600], near: 1, far: 2000 }}>
        <hemisphereLight args={[colors.moon, colors.night, 1.2]} />
        <directionalLight position={[200, 400, 300]} color={colors.amber} intensity={1.3} />
        {/* Mooslicht von hinten: macht auch dunkle Silhouetten sichtbar */}
        <directionalLight position={[-200, 200, -400]} color={colors.rune} intensity={1.6} />
        <FehlerFaenger>
          <Suspense fallback={null}>
            {zellen.map((z, i) => (
              <Zelle key={z.id} zelle={z} breite={breite} hoehe={hoehe} ruhig={ruhig} versatz={i * 0.7} />
            ))}
          </Suspense>
        </FehlerFaenger>
      </Canvas>
    </View>
  );
}

function Zelle({
  zelle,
  breite,
  hoehe,
  ruhig,
  versatz,
}: {
  zelle: GitterZelle;
  breite: number;
  hoehe: number;
  ruhig: boolean;
  versatz: number;
}) {
  const drehteller = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    // langsam drehen, jedes Modell etwas versetzt
    if (!ruhig && drehteller.current) drehteller.current.rotation.y = clock.elapsedTime * 0.45 + versatz;
  });
  const g = zelle.groesse;
  // Bildpunkte → Szene: Mitte ist (0, 0), y zeigt nach oben. Das Modell steht unten im Bereich.
  const x = zelle.x - breite / 2;
  const y = hoehe / 2 - (zelle.y + g * 0.42);
  return (
    <group position={[x, y, 0]} rotation={[0.32, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <ringGeometry args={[g * 0.36, g * 0.4, 40]} />
        <meshBasicMaterial color={zelle.farbe} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[g * 0.36, 32]} />
        <meshBasicMaterial color={colors.forest} transparent opacity={0.8} />
      </mesh>
      <group ref={drehteller} rotation={[0, versatz, 0]}>
        <ArtFigur id={zelle.id} stil={zelle.stil} groesse={g * 0.8} ruhig={ruhig} />
      </group>
    </group>
  );
}
