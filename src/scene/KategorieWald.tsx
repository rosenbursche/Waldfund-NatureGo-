import { Canvas } from '@react-three/fiber/native';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { artById } from '@/data/arten';
import type { KategorieId } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import type { Naturraum } from '@/data/typen';
import { katalogEintrag, waldPlaetze } from '@/logic/katalog';
import { startwertAus, zufall } from '@/logic/lichtung';
import { getHeimischeBaeume } from '@/logic/regelEngine';
import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import { ArtFigur, GefahrMarke, Schloss } from './ArtFigur';
import { Baum3D } from './Baum3D';
import { FORM, matt } from './material';
import { Kamera, Tippen, type KameraBahn } from './Steuerung';
import type { Steuerung, Ziel } from './steuerZustand';

/**
 * Der Wald einer Kategorie: Alle Arten stehen an ihrem natürlichen Platz –
 * Pflanzen und Pilze am Boden, Vögel auf Baumstümpfen, Säugetiere zwischen den Bäumen.
 * Gefundene Arten in Farbe, noch nicht gefundene grau mit Schloss.
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

// Kamera kreist innerhalb des Baumrings und schaut leicht von oben auf die Arten
const BAHN: KameraBahn = { abstand: 10.5, hoehe: 8, zielY: 0.4, schweben: true };

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

export function KategorieWald({ kategorie, naturraum, gefunden, stimmung, ruhig, aktiv, steuer, onZiel }: Props) {
  const plaetze = useMemo(() => waldPlaetze(kategorie, naturraum), [kategorie, naturraum]);
  const randBaeume = useMemo(() => {
    // Ring aus heimischen Bäumen als Kulisse (dunkel, damit sie nicht mit den Arten verwechselt werden)
    const arten = naturraum
      ? getHeimischeBaeume(naturraum).map((b) => b.baumart.id)
      : ['rotbuche', 'stieleiche', 'sandbirke'];
    const rnd = zufall(startwertAus(`${kategorie}-wald`));
    return Array.from({ length: 24 }, (_, i) => {
      const w = (i / 24) * Math.PI * 2 + (rnd() - 0.5) * 0.2;
      const r = 12 + rnd() * 3.5;
      return {
        id: arten[i % arten.length],
        x: Math.cos(w) * r,
        z: Math.sin(w) * r,
        s: 0.9 + rnd() * 0.5,
        d: rnd() * 6,
      };
    });
  }, [naturraum, kategorie]);

  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      frameloop={aktiv ? 'always' : 'never'}
      camera={{ fov: 50, near: 0.1, far: 120 }}
    >
      <color attach="background" args={[stimmung.himmel]} />
      <fogExp2 attach="fog" args={[stimmung.nebel, stimmung.nebelDichte * 0.9]} />
      <ambientLight color={stimmung.umgebung} intensity={stimmung.umgebungStaerke + 0.25} />
      <hemisphereLight args={[colors.moon, colors.night, 0.55]} />
      <directionalLight color={stimmung.licht} intensity={stimmung.lichtStaerke + 0.3} position={[-6, 12, 6]} />

      {/* Waldboden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={matt('#1C2B23')}>
        <circleGeometry args={[40, 24]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={matt('#25372B')}>
        <circleGeometry args={[10.5, 20]} />
      </mesh>

      {randBaeume.map((b, i) => (
        <Baum3D
          key={i}
          id={`rand-${i}`}
          modell={baumById[b.id].modell}
          gefunden={false}
          position={[b.x, 0, b.z]}
          skala={b.s}
          drehung={b.d}
          ruhig={ruhig}
          antippbar={false}
        />
      ))}

      {plaetze.map((p) => {
        const ok = p.id in gefunden;
        const g = groesseFuer(p.id);
        const sockel = p.hoch ? 0.9 : 0; // Vögel sitzen auf einem Baumstumpf
        return (
          <group key={p.id} position={[p.x, 0, p.z]} rotation={[0, -Math.atan2(p.z, p.x) - Math.PI / 2, 0]}>
            {/* gefährliche Arten: roter Ring, roter Nebel, Dornenkranz */}
            {katalogEintrag(p.id)?.gefahr && <GefahrMarke radius={baumById[p.id] ? 1.1 : 0.6} ruhig={ruhig} />}
            {p.hoch && (
              <mesh
                geometry={FORM.stamm}
                material={matt('#4A3A2E')}
                position={[0, sockel / 2, 0]}
                scale={[0.32, sockel, 0.32]}
              />
            )}
            <group position={[0, sockel, 0]}>
              <ArtFigur id={p.id} stil={ok ? 'farbe' : 'grau'} groesse={g} ruhig={ruhig} antippbar />
              {!ok && <Schloss position={[0, g + 0.35, 0]} groesse={baumById[p.id] ? 0.5 : 0.32} />}
            </group>
          </group>
        );
      })}

      <Kamera steuer={steuer} ruhig={ruhig} bahn={BAHN} />
      <Tippen steuer={steuer} onZiel={onZiel} />
    </Canvas>
  );
}
