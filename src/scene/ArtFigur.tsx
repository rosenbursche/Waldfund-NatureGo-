import { useFrame } from '@react-three/fiber/native';
import { useState } from 'react';

import { artById } from '@/data/arten';
import { baumById } from '@/data/baumarten';

import { baueArtModell, einpassen, type ModellStil } from './artModell';
import { Baum3D } from './Baum3D';
import { FORM, matt, UNSICHTBAR } from './material';

/**
 * Eine Art als kleine 3D-Figur – für den Kategorie-Wald und die Runensteine.
 * Bäume nutzen die prozeduralen Bäume der Lichtung, alle anderen Arten ihr Modell aus dem Prototyp.
 * Gibt `null` zurück, wenn es für die ID kein Modell gibt.
 */
type Props = {
  id: string;
  stil: ModellStil;
  /** ungefähre Größe in Szenen-Einheiten (Höhe/Breite) */
  groesse: number;
  ruhig: boolean;
  /** Tippen öffnet die Art (userData für die Treffer-Suche) */
  antippbar?: boolean;
};

export function ArtFigur({ id, stil, groesse, ruhig, antippbar = false }: Props) {
  const baum = baumById[id];
  const art = artById[id];
  const ziel = antippbar ? { ziel: { typ: 'art', id } } : undefined;

  if (baum) {
    // Bäume sind ca. 4–5 Einheiten hoch → auf die gewünschte Größe skalieren
    return (
      <group userData={ziel} scale={groesse / 4.5}>
        <Baum3D
          id={id}
          modell={baum.modell}
          gefunden={stil === 'farbe'}
          grau={stil === 'grau'}
          position={[0, 0, 0]}
          skala={1}
          drehung={0}
          ruhig={ruhig}
          antippbar={false}
        />
      </group>
    );
  }
  if (!art || art.modell.t === 'tree') return null;
  return (
    <group userData={ziel}>
      {antippbar && (
        <mesh
          geometry={FORM.trefferZylinder}
          material={UNSICHTBAR}
          position={[0, groesse / 2, 0]}
          scale={[groesse * 0.45, groesse, groesse * 0.45]}
        />
      )}
      <Modell key={stil} id={id} stil={stil} groesse={groesse} ruhig={ruhig} />
    </group>
  );
}

function Modell({ id, stil, groesse, ruhig }: { id: string; stil: ModellStil; groesse: number; ruhig: boolean }) {
  const [m] = useState(() => {
    const a = baueArtModell(artById[id].modell, stil);
    einpassen(a.gruppe, groesse);
    return a;
  });
  useFrame(({ clock }) => {
    // Gesperrte Arten stehen still – nur gefundene bewegen sich
    if (!ruhig && stil === 'farbe') m.bewege(clock.elapsedTime + id.length);
  });
  return <primitive object={m.gruppe} />;
}

/** Kleines graues Vorhängeschloss: Bügel und Körper */
export function Schloss({ position, groesse = 0.35 }: { position: [number, number, number]; groesse?: number }) {
  const grau = matt('#8A918E');
  const dunkel = matt('#4F5654');
  return (
    <group position={position} scale={groesse}>
      <mesh geometry={FORM.kiste} material={grau} scale={[1, 0.8, 0.45]} />
      <mesh material={grau} position={[0, 0.55, 0]}>
        <torusGeometry args={[0.32, 0.09, 6, 12, Math.PI]} />
      </mesh>
      <mesh geometry={FORM.kiste} material={dunkel} position={[0, -0.05, 0.24]} scale={[0.14, 0.3, 0.04]} />
    </group>
  );
}
