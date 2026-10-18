import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { BaumModell } from '@/data/typen';
import type { Laub } from '@/logic/jahreszeit';
import { mischeFarbe } from '@/logic/tageszeit';

import { baueBaum, type BaumDaten } from './baumGenerator';
import { blattTextur, type BlattArt } from './blattTexturen';
import { FORM, GRAU, matt, SILHOUETTE, UNSICHTBAR } from './material';

/**
 * Ein prozedural erzeugter, fein verästelter Baum (Generator: baumGenerator.ts).
 * Jede Kronenform hat eine eigene, erkennbare Gestalt (siehe Phase-3-Auftrag):
 * Buche rund, Eiche knorrig, Fichte schmal-spitz, Tanne mit flacher Spitze,
 * Kiefer mit Schirmkrone und rötlichem Stamm, Birke weiß mit hängenden Zweigen.
 *
 * Gefundene Arten stehen in Farbe da, unbekannte als dunkle Silhouette.
 */
type Props = {
  id: string;
  modell: BaumModell;
  gefunden: boolean;
  position: [number, number, number];
  skala: number;
  drehung: number;
  /** Wind abschalten bei "Bewegung reduzieren" */
  ruhig: boolean;
  /** nicht gefunden: grau statt dunkler Silhouette (Kategorie-Wald) */
  grau?: boolean;
  /** false = reine Kulisse, lässt sich nicht antippen */
  antippbar?: boolean;
  /** Jahreszeit: Austrieb (hellgrün), Herbst (bunt), kahl (Winter) – Standard: grün */
  laub?: Laub;
  /** Wachstum 0–1 (1 = ausgewachsen); sehr klein = Keimling */
  wuchs?: number;
};

/** Farbe des Laubs je nach Jahreszeit */
function laubFarbe(grund: string, laub: Laub): string {
  if (laub === 'austrieb') return mischeFarbe(grund, '#B8D88A', 0.55);
  if (laub === 'herbst') return mischeFarbe(grund, '#C9822E', 0.75);
  if (laub === 'kahl') return '#4E4236'; // kahle Zweige
  return grund;
}

export function Baum3D({
  id,
  modell,
  gefunden,
  position,
  skala,
  drehung,
  ruhig,
  grau = false,
  antippbar = true,
  laub: jahreszeit = 'gruen',
  wuchs = 1,
}: Props) {
  const krone = useRef<THREE.Group>(null);
  const phase = useRef((position[0] * 7.3 + position[2] * 3.1) % (Math.PI * 2));

  // Leichter Wind: Die Krone schwankt sanft, jeder Baum etwas anders
  useFrame(({ clock }) => {
    if (ruhig || !krone.current) return;
    const t = clock.elapsedTime * 0.9 + phase.current;
    krone.current.rotation.z = Math.sin(t) * 0.025 + Math.sin(t * 2.3) * 0.01;
    krone.current.rotation.x = Math.cos(t * 0.8) * 0.018;
  });

  const verdeckt = grau ? GRAU : SILHOUETTE;
  const laub = gefunden ? laubFarbe(modell.laub, jahreszeit) : verdeckt;
  const rinde = gefunden ? modell.rinde : verdeckt;
  const h = modell.hoehe;
  // drei Exemplare je Art, damit nicht alle Bäume gleich aussehen
  const variante = Math.abs(Math.round(position[0] * 13 + position[2] * 7)) % 3;

  return (
    <group
      position={position}
      rotation={[0, drehung, 0]}
      scale={skala * Math.max(wuchs, 0.12)}
      userData={antippbar ? { ziel: { typ: 'baum', id } } : undefined}
    >
      {/* große, unsichtbare Tipp-Fläche, damit man den Baum leicht trifft */}
      {antippbar && (
        <mesh
          geometry={FORM.trefferZylinder}
          material={UNSICHTBAR}
          position={[0, 2.2 * h, 0]}
          scale={[1.3, 4.4 * h, 1.3]}
        />
      )}
      <group ref={krone}>
        {wuchs < 0.1 ? (
          <Keimling laub={matt(gefunden ? '#7FB255' : verdeckt)} />
        ) : (
          <DetailBaum
            modell={modell}
            variante={variante}
            laub={laub}
            rinde={rinde}
            kahl={jahreszeit === 'kahl'}
            ruhig={ruhig}
          />
        )}
      </group>
    </group>
  );
}

/** Keimling: dünner Stängel mit zwei Keimblättern (wird mit dem Baum mitskaliert) */
function Keimling({ laub }: { laub: THREE.Material }) {
  return (
    <>
      <mesh geometry={FORM.stamm} material={laub} position={[0, 1.6, 0]} scale={[0.12, 3.2, 0.12]} />
      <mesh
        geometry={FORM.kugel}
        material={laub}
        position={[0.75, 3.2, 0]}
        rotation={[0, 0, -0.5]}
        scale={[0.9, 0.18, 0.5]}
      />
      <mesh
        geometry={FORM.kugel}
        material={laub}
        position={[-0.75, 3.2, 0]}
        rotation={[0, 0, 0.5]}
        scale={[0.9, 0.18, 0.5]}
      />
    </>
  );
}

/** Rinde: Graustufen aus den Eckpunkten × Farbe der Art (bzw. Silhouette) */
const holzMaterialien = new Map<string, THREE.MeshLambertMaterial>();
function holzMaterial(farbe: string) {
  let m = holzMaterialien.get(farbe);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: farbe, vertexColors: true });
    holzMaterialien.set(farbe, m);
  }
  return m;
}

/** Gemeinsamer Wind für alle Blätter */
const BLATT_WIND = { value: 0 };
/** Blätter-Wind für Bäume außerhalb von Baum3D (z. B. Moosbäume im Zauberwald) */
export function blattWind(zeit: number) {
  BLATT_WIND.value = zeit;
}
const blattMaterialien = new Map<string, THREE.MeshLambertMaterial>();

/** Blattbüschel: gemalte Textur mit Ausschnitt (alphaTest), Farbe der Art, sanftes Flattern im Wind */
export function blattMaterial(art: BlattArt, farbe: string) {
  const schluessel = `${art}-${farbe}`;
  let m = blattMaterialien.get(schluessel);
  if (m) return m;
  m = new THREE.MeshLambertMaterial({ color: farbe, map: blattTextur(art), alphaTest: 0.5, side: THREE.DoubleSide });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.zeit = BLATT_WIND;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float zeit;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float phase = instanceMatrix[3].x * 2.1 + instanceMatrix[3].y * 1.3 + instanceMatrix[3].z * 1.7;
          transformed.z += sin(zeit * 2.6 + phase) * 0.05 * position.y;
          transformed.x += cos(zeit * 2.1 + phase) * 0.03 * position.y;
        #endif`,
      );
  };
  blattMaterialien.set(schluessel, m);
  return m;
}

/** Blattkarte: Quadrat mit Unterkante im Ursprung (dort sitzt sie am Zweig) */
const BLATT_KARTE = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);

export function blattMesh(daten: BaumDaten, material: THREE.Material) {
  const m = new THREE.InstancedMesh(BLATT_KARTE, material, Math.max(1, daten.anzahl));
  m.count = daten.anzahl;
  m.instanceMatrix.array.set(daten.blaetter);
  m.instanceMatrix.needsUpdate = true;
  m.instanceColor = new THREE.InstancedBufferAttribute(daten.blattFarben.slice(), 3);
  m.computeBoundingSphere();
  return m;
}

/** Fein verästelter Baum aus dem Generator (siehe baumGenerator.ts) */
function DetailBaum({
  modell,
  variante,
  laub,
  rinde,
  kahl,
  ruhig,
}: {
  modell: BaumModell;
  variante: number;
  laub: string;
  rinde: string;
  kahl: boolean;
  ruhig: boolean;
}) {
  const daten = useMemo(() => baueBaum(modell, variante), [modell, variante]);
  const blaetter = useMemo(() => blattMesh(daten, blattMaterial(daten.blattArt, laub)), [daten, laub]);
  useFrame(({ clock }) => {
    if (!ruhig) BLATT_WIND.value = clock.elapsedTime; // alle Bäume setzen dieselbe Zeit
  });
  return (
    <>
      <mesh geometry={daten.holz} material={holzMaterial(rinde)} />
      {!kahl && <primitive object={blaetter} />}
    </>
  );
}
