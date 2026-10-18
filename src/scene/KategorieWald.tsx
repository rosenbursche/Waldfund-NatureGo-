import { Canvas, useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as THREE from 'three';

import { artById } from '@/data/arten';
import type { KategorieId } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import type { Naturraum } from '@/data/typen';
import { katalogEintrag, waldPlaetze } from '@/logic/katalog';
import type { Stimmung } from '@/logic/tageszeit';
import { zauberBoden } from '@/logic/zauberwald';
import { colors } from '@/theme/theme';

import { ArtFigur, GefahrMarke } from './ArtFigur';
import { FORM, matt } from './material';
import { Kamera, Tippen, type KameraBahn } from './Steuerung';
import type { Steuerung, Ziel } from './steuerZustand';
import { leuchtTextur } from './texturen';
import { Zauberwald } from './Zauberwald';

/**
 * Der Wald einer Kategorie als verwunschener Moorwald (Kulisse: Zauberwald.tsx).
 * Alle Arten stehen auf der moosigen Lichtung – Pflanzen und Pilze am Boden,
 * Vögel auf bemoosten Baumstümpfen, Säugetiere zwischen den Polstern.
 * - gefunden: in Farbe, in einem warmen Lichtkegel, der von oben fällt
 * - noch nicht gefunden: dunkler Schatten im Nebel, darüber schwebt ein Irrlicht
 */
type Props = {
  kategorie: KategorieId;
  naturraum?: Naturraum;
  gefunden: Record<string, unknown>;
  stimmung: Stimmung;
  ruhig: boolean;
  aktiv: boolean;
  steuer: Steuerung;
  onZiel: (z: Ziel) => void;
};

// Kamera kreist tief über der Lichtung, die Moosbäume rahmen das Bild ein
const BAHN: KameraBahn = { abstand: 12.5, hoehe: 4.2, zielY: 0.9, schweben: true };

/** Größe der Figur je nach Art (in Szenen-Einheiten) */
function groesseFuer(id: string): number {
  if (baumById[id]) return 2.8;
  switch (artById[id]?.modell.t) {
    case 'flower':
      return 0.95;
    case 'shroom':
      return 0.75;
    case 'bird':
      return 0.8;
    case 'mammal':
      return 1.15;
    default:
      return 1;
  }
}

type Platz = { id: string; x: number; y: number; z: number; g: number; sockel: number; ok: boolean };

export function KategorieWald({ kategorie, naturraum, gefunden, stimmung, ruhig, aktiv, steuer, onZiel }: Props) {
  const plaetze: Platz[] = useMemo(
    () =>
      waldPlaetze(kategorie, naturraum).map((p) => ({
        id: p.id,
        x: p.x,
        z: p.z,
        y: zauberBoden(p.x, p.z),
        g: groesseFuer(p.id),
        sockel: p.hoch ? 0.9 : 0, // Vögel sitzen auf einem Baumstumpf
        ok: p.id in gefunden,
      })),
    [kategorie, naturraum, gefunden],
  );

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      frameloop={aktiv ? 'always' : 'never'}
      camera={{ fov: 50, near: 0.1, far: 140 }}
    >
      <Zauberwald kategorie={kategorie} stimmung={stimmung} ruhig={ruhig} />

      {plaetze.map((p) => (
        <group key={p.id} position={[p.x, p.y, p.z]} rotation={[0, -Math.atan2(p.z, p.x) - Math.PI / 2, 0]}>
          {/* gefährliche Arten: roter Ring, roter Nebel, Dornenkranz */}
          {katalogEintrag(p.id)?.gefahr && <GefahrMarke radius={baumById[p.id] ? 1.1 : 0.6} ruhig={ruhig} />}
          {p.sockel > 0 && <Baumstumpf hoehe={p.sockel} />}
          <group position={[0, p.sockel, 0]}>
            <ArtFigur id={p.id} stil={p.ok ? 'farbe' : 'silhouette'} groesse={p.g} ruhig={ruhig} antippbar />
          </group>
        </group>
      ))}

      <Lichtkegel plaetze={plaetze.filter((p) => p.ok)} ruhig={ruhig} />
      <Irrlichter plaetze={plaetze.filter((p) => !p.ok)} ruhig={ruhig} />

      <Kamera steuer={steuer} ruhig={ruhig} bahn={BAHN} />
      <Tippen steuer={steuer} onZiel={onZiel} />
    </Canvas>
  );
}

/** Bemooster Baumstumpf als Sitzplatz für Vögel */
function Baumstumpf({ hoehe }: { hoehe: number }) {
  return (
    <>
      <mesh
        geometry={FORM.stamm}
        material={matt(colors.zauberStumpf)}
        position={[0, hoehe / 2, 0]}
        scale={[0.34, hoehe, 0.34]}
      />
      <mesh
        geometry={FORM.kugelFein}
        material={matt(colors.zauberMoosHell)}
        position={[0, hoehe, 0]}
        scale={[0.3, 0.07, 0.3]}
      />
    </>
  );
}

function sprite(farbe: string, deckkraft: number) {
  return new THREE.SpriteMaterial({
    map: leuchtTextur(),
    color: farbe,
    transparent: true,
    opacity: deckkraft,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false, // Lichter leuchten auch durch den Nebel
  });
}

const KEGEL = (() => {
  const g = new THREE.CylinderGeometry(0.12, 1, 1, 16, 4, true).translate(0, 0.5, 0);
  // nach oben weich ausblenden (schwarz = unsichtbar bei additivem Licht)
  const pos = g.attributes.position as THREE.BufferAttribute;
  const farben = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const h = 1 - THREE.MathUtils.smoothstep(pos.getY(i), 0.1, 1);
    farben.set([h, h, h], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  return g;
})();
const BODEN_RING = new THREE.RingGeometry(0.62, 0.7, 40).rotateX(-Math.PI / 2);
// geteilte Materialien (auf Modulebene, damit die Animation sie ändern darf)
const KEGEL_LICHT = new THREE.MeshBasicMaterial({
  color: colors.legend,
  transparent: true,
  opacity: 0.1,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide,
  fog: false,
});
const RUNEN_RING = new THREE.MeshBasicMaterial({
  color: colors.rune,
  transparent: true,
  opacity: 0.22,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

/** Gefundene Arten: warmer Lichtkegel von oben und ein heller Fleck am Boden */
function Lichtkegel({ plaetze, ruhig }: { plaetze: Platz[]; ruhig: boolean }) {
  const fleck = useMemo(() => sprite(colors.amber, 0.5), []);
  const funken = useMemo(() => sprite(colors.legend, 0.9), []);
  const gruppe = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ruhig) return;
    const t = clock.elapsedTime;
    KEGEL_LICHT.opacity = 0.09 + Math.sin(t * 0.8) * 0.02;
    // kleine Funken steigen im Lichtkegel auf
    gruppe.current?.children.forEach((c, i) => {
      const v = (t * 0.25 + i * 0.37) % 1;
      c.position.y = c.userData.basis + v * 2.2;
      (c as THREE.Sprite).scale.setScalar(0.12 * Math.sin(v * Math.PI));
    });
  });
  return (
    <>
      {plaetze.map((p) => {
        const breite = p.g * 0.7;
        const top = p.sockel + p.g * 3.2;
        return (
          <group key={p.id} position={[p.x, p.y, p.z]}>
            {/* Lichtkegel: breit am Boden, nach oben schmal und verblassend */}
            <mesh geometry={KEGEL} material={KEGEL_LICHT} scale={[breite, top, breite]} />
            <sprite material={fleck} position={[0, p.sockel + 0.05, 0]} scale={[breite * 2.6, breite * 1.1, 1]} />
          </group>
        );
      })}
      <group ref={gruppe}>
        {plaetze.flatMap((p) =>
          [0, 1, 2].map((k) => {
            const w = k * 2.1 + p.x;
            const basis = p.y + p.sockel + 0.2;
            return (
              <sprite
                key={`${p.id}-${k}`}
                material={funken}
                position={[p.x + Math.cos(w) * p.g * 0.35, basis + k * 0.6, p.z + Math.sin(w) * p.g * 0.35]}
                scale={[0.1, 0.1, 1]}
                userData={{ basis }}
              />
            );
          }),
        )}
      </group>
    </>
  );
}

/** Noch nicht gefundene Arten: ein Irrlicht schwebt über dem Schatten, am Boden ein schwacher Runenkreis */
function Irrlichter({ plaetze, ruhig }: { plaetze: Platz[]; ruhig: boolean }) {
  const hof = useMemo(() => sprite(colors.rune, 0.6), []);
  const kern = useMemo(() => sprite(colors.moon, 0.95), []);
  const lichter = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ruhig) return;
    const t = clock.elapsedTime;
    lichter.current?.children.forEach((c, i) => {
      const { basis, x, z } = c.userData as { basis: number; x: number; z: number };
      // schwebt auf und ab und zieht kleine Kreise
      c.position.set(
        x + Math.sin(t * 0.9 + i) * 0.12,
        basis + Math.sin(t * 1.3 + i * 1.7) * 0.15,
        z + Math.cos(t * 0.7 + i) * 0.12,
      );
      const flackern = 0.85 + Math.sin(t * 5.3 + i * 3.1) * 0.08 + Math.sin(t * 2.1 + i) * 0.07;
      c.scale.setScalar(flackern);
    });
    RUNEN_RING.opacity = 0.16 + Math.sin(t * 1.2) * 0.06;
  });
  return (
    <>
      {plaetze.map((p) => (
        <mesh
          key={p.id}
          geometry={BODEN_RING}
          material={RUNEN_RING}
          position={[p.x, p.y + p.sockel + 0.03, p.z]}
          scale={baumById[p.id] ? 1.6 : p.g}
        />
      ))}
      <group ref={lichter}>
        {plaetze.map((p) => {
          const basis = p.y + p.sockel + (baumById[p.id] ? 1.6 : p.g + 0.45);
          return (
            <group key={p.id} position={[p.x, basis, p.z]} userData={{ basis, x: p.x, z: p.z }}>
              <sprite material={hof} scale={[1.1, 1.1, 1]} />
              <sprite material={kern} scale={[0.22, 0.22, 1]} />
            </group>
          );
        })}
      </group>
    </>
  );
}
