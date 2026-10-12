import { Canvas } from '@react-three/fiber/native';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import type { KategorieId } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import type { Naturraum } from '@/data/typen';
import { platziereBaeume, startwertAus } from '@/logic/lichtung';
import { baeumeFreiRuecken } from '@/logic/lichtungDetails';
import { getHeimischeBaeume } from '@/logic/regelEngine';
import type { HuettenStufe } from '@/logic/fortschritt';
import type { Stimmung } from '@/logic/tageszeit';

import { Atmosphaere } from './Atmosphaere';
import { Baum3D } from './Baum3D';
import { Huette } from './Huette';
import { LichtungDetails } from './LichtungDetails';
import { LichtungLeben } from './LichtungLeben';
import { LichtungVerborgenes } from './LichtungVerborgenes';
import { Runenstein } from './Runenstein';
import { FpsMesser, Kamera, Projektor, Tippen } from './Steuerung';
import type { FpsKanal, PunkteKanal, Steuerung, Ziel } from './steuerZustand';

/** Positionen der vier Runensteine rund um die Hütte */
export const RUNEN_POSITIONEN: { id: KategorieId; position: [number, number, number] }[] = [
  { id: 'pflanzen', position: [3.6, 1.4, 3.2] },
  { id: 'pilze', position: [-3.6, 1.4, 3.2] },
  { id: 'voegel', position: [-3.8, 1.4, -2.9] },
  { id: 'saeuger', position: [3.8, 1.4, -2.9] },
];

/** Anzahl Bäume auf der Lichtung – genug für einen Wald, wenig genug für flüssige 60 Bilder/Sekunde */
const BAUM_ANZAHL = 30;

type Props = {
  /** false = Szene steht still (andere Seite ist offen) */
  aktiv: boolean;
  naturraum: Naturraum;
  gefunden: Record<string, unknown>;
  /** Ausbaustufe der Hütte (wächst mit dem Level) */
  huette: HuettenStufe;
  fortschritt: Record<KategorieId, number>;
  /** je Kategorie einige gefundene Arten für die Vitrine am Runenstein */
  vitrinen: Record<KategorieId, string[]>;
  stimmung: Stimmung;
  ruhig: boolean;
  steuer: Steuerung;
  kanal: PunkteKanal;
  /** Bildrate melden (nur wenn die Leistungsanzeige an ist) */
  fps: FpsKanal;
  onZiel: (z: Ziel) => void;
};

export function Lichtung({
  aktiv,
  naturraum,
  gefunden,
  huette,
  fortschritt,
  vitrinen,
  stimmung,
  ruhig,
  steuer,
  kanal,
  fps,
  onZiel,
}: Props) {
  const plaetze = useMemo(
    () => baeumeFreiRuecken(platziereBaeume(getHeimischeBaeume(naturraum), BAUM_ANZAHL, startwertAus(naturraum.id))),
    [naturraum],
  );
  const labelPunkte = useMemo(
    () =>
      RUNEN_POSITIONEN.map((r) => ({
        id: r.id,
        position: [r.position[0], r.position[1] + 1.1, r.position[2]] as [number, number, number],
      })),
    [],
  );

  return (
    <Canvas style={StyleSheet.absoluteFill} camera={{ fov: 50, near: 0.1, far: 120, position: [0, 6, 17] }}>
      <Atmosphaere stimmung={stimmung} ruhig={ruhig} />
      <Huette stufe={huette} fenster={stimmung.fenster} ruhig={ruhig} />
      <LichtungDetails startwert={startwertAus(naturraum.id)} stimmung={stimmung} ruhig={ruhig} />
      <LichtungLeben stimmung={stimmung} ruhig={ruhig} />
      <LichtungVerborgenes startwert={startwertAus(naturraum.id)} stimmung={stimmung} ruhig={ruhig} />

      {plaetze.map((p, i) => {
        const baum = baumById[p.baumId];
        return (
          <Baum3D
            key={`${p.baumId}-${i}`}
            id={p.baumId}
            modell={baum.modell}
            gefunden={p.baumId in gefunden}
            position={[p.x, 0, p.z]}
            skala={p.skala}
            drehung={p.drehung}
            ruhig={ruhig}
          />
        );
      })}

      {RUNEN_POSITIONEN.map((r) => (
        <Runenstein
          key={r.id}
          kategorie={r.id}
          position={r.position}
          fortschritt={fortschritt[r.id]}
          vitrine={vitrinen[r.id]}
          ruhig={ruhig}
        />
      ))}

      <Kamera steuer={steuer} ruhig={ruhig} />
      <Tippen steuer={steuer} onZiel={onZiel} />
      <Projektor punkte={labelPunkte} kanal={kanal} />
      <FpsMesser kanal={fps} />
    </Canvas>
  );
}
