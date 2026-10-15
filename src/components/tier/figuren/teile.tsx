import { Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import type { TierSeite } from '@/data/tierSeiten';
import { farbMix } from '@/logic/tierJahr';
import { colors } from '@/theme/theme';

/**
 * Gemeinsame Bausteine für die Tier-Zeichnungen (Raster: Breite 200, Boden bei y = 150).
 * Jede Figur schaut nach rechts und kennt drei Posen: steht, aktiv (je Tier anders) und liegt.
 */
export type FigurPose = 'steht' | 'aktiv' | 'liegt';

export type FigurProps = {
  farben: TierSeite['farben'];
  pose?: FigurPose;
  /** 0 = Winterfell, 1 = Sommerfell */
  fell?: number;
  /** Jungtier mit dunklem Fell (Welpe, Frischling) */
  dunkel?: boolean;
  /** Frischling: helle Längsstreifen */
  streifen?: boolean;
  umriss?: string;
  licht?: boolean;
};

/** Die Farben, die eine Figur braucht – bei `umriss` alles in einer Farbe (Silhouette) */
export function figurFarben(p: FigurProps) {
  const f = p.farben;
  const grund = p.dunkel && f.jung ? f.jung : farbMix(f.winter, f.sommer, p.fell ?? 1);
  return {
    grund,
    voll: p.umriss ?? grund,
    dunkel: p.umriss ?? f.dunkel,
    hell: p.umriss ?? (p.dunkel ? farbMix(f.hell, grund, 0.5) : f.hell),
    ferne: p.umriss ?? farbMix(grund, f.dunkel, 0.35),
    akzent: p.umriss ?? f.akzent ?? f.dunkel,
    auge: f.auge,
    zeichnen: !p.umriss,
  };
}

/** Senkrechter Fellverlauf (oben dunkler, unten heller) in Zeichen-Koordinaten */
export function FellVerlauf({
  id,
  grund,
  dunkel,
  hell,
  von,
  bis,
}: {
  id: string;
  grund: string;
  dunkel: string;
  hell: string;
  von: number;
  bis: number;
}) {
  return (
    <Defs>
      <LinearGradient id={id} x1="0" y1={String(von)} x2="0" y2={String(bis)} gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor={farbMix(grund, dunkel, 0.25)} />
        <Stop offset="0.55" stopColor={grund} />
        <Stop offset="1" stopColor={farbMix(grund, hell, 0.3)} />
      </LinearGradient>
    </Defs>
  );
}

export function Bodenschatten({ x, breite, an }: { x: number; breite: number; an: boolean }) {
  if (!an) return null;
  return <Ellipse cx={x} cy={150.5} rx={breite} ry={3.5} fill={colors.night} opacity={0.5} />;
}

/** Kurze Fellstriche über einer Fläche (Reihen, Richtung nach hinten unten) */
export function Fellstriche({
  von,
  bis,
  y,
  reihen = 2,
  farbe,
}: {
  von: number;
  bis: number;
  y: number;
  reihen?: number;
  farbe: string;
}) {
  const striche: string[] = [];
  for (let r = 0; r < reihen; r++) {
    for (let x = von + r * 3; x < bis; x += 6) {
      const yy = y + r * 7 + Math.sin(x * 0.7) * 1.5;
      striche.push(`M${x} ${yy} q-2 2 -3.5 3.5`);
    }
  }
  return (
    <G>
      {striche.map((d, i) => (
        <Path key={i} d={d} stroke={farbe} strokeWidth={0.6} opacity={0.22} fill="none" strokeLinecap="round" />
      ))}
    </G>
  );
}

/**
 * Schlafendes, eingerolltes Tier: runder Körper, Kopf vorn aufgelegt, Schwanz um den Körper gelegt.
 * Ohren und Schwanz je nach Tier – so bleibt auch im Schlaf erkennbar, wer da liegt.
 */
export function Schlafkugel({
  farben,
  verlauf,
  ohr,
  schwanz,
  breite = 46,
  hoehe = 20,
}: {
  farben: ReturnType<typeof figurFarben>;
  verlauf: string;
  ohr: 'spitz' | 'rund' | 'pinsel';
  schwanz: 'buschig' | 'kurz' | 'kelle' | 'ringel' | 'keiner';
  breite?: number;
  hoehe?: number;
}) {
  const mx = 100;
  const unten = 148;
  const oben = unten - hoehe * 2;
  const k = farben;
  return (
    <G>
      {/* Körper */}
      <Path
        d={`M${mx - breite} ${unten - 4} C${mx - breite - 2} ${oben + 12} ${mx - breite * 0.5} ${oben} ${mx} ${oben} C${mx + breite * 0.6} ${oben} ${mx + breite + 2} ${oben + 10} ${mx + breite} ${unten - 6} C${mx + breite * 0.6} ${unten + 1} ${mx - breite * 0.6} ${unten + 1} ${mx - breite} ${unten - 4} Z`}
        fill={verlauf}
        stroke={k.dunkel}
        strokeWidth={0.8}
        strokeOpacity={0.4}
      />
      {/* Kopf vorn rechts, aufgelegt */}
      <Path
        d={`M${mx + breite * 0.45} ${unten - hoehe * 0.9} C${mx + breite * 0.55} ${unten - hoehe * 1.5} ${mx + breite * 0.95} ${unten - hoehe * 1.55} ${mx + breite * 1.15} ${unten - hoehe * 1.05} C${mx + breite * 1.25} ${unten - hoehe * 0.75} ${mx + breite * 1.1} ${unten - hoehe * 0.45} ${mx + breite * 0.8} ${unten - hoehe * 0.45} C${mx + breite * 0.6} ${unten - hoehe * 0.45} ${mx + breite * 0.45} ${unten - hoehe * 0.6} ${mx + breite * 0.45} ${unten - hoehe * 0.9} Z`}
        fill={verlauf}
        stroke={k.dunkel}
        strokeWidth={0.8}
        strokeOpacity={0.4}
      />
      {ohr === 'rund' ? (
        <Ellipse cx={mx + breite * 0.68} cy={unten - hoehe * 1.42} rx={4} ry={3.2} fill={k.ferne} />
      ) : (
        <Path
          d={`M${mx + breite * 0.6} ${unten - hoehe * 1.3} L${mx + breite * 0.66} ${unten - hoehe * 1.95} L${mx + breite * 0.82} ${unten - hoehe * 1.38} Z`}
          fill={k.ferne}
        />
      )}
      {ohr === 'pinsel' && (
        <Path
          d={`M${mx + breite * 0.66} ${unten - hoehe * 1.95} l0 -6`}
          stroke={k.dunkel}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      )}
      {k.zeichnen && (
        <Path
          d={`M${mx + breite * 0.85} ${unten - hoehe * 1.05} c1.5 1.2 3.5 1.2 5 0`}
          stroke={k.dunkel}
          strokeWidth={1}
          fill="none"
        />
      )}
      {/* Schwanz um den Körper gelegt */}
      {schwanz === 'buschig' && (
        <Path
          d={`M${mx - breite} ${unten - 8} C${mx - breite * 0.6} ${unten + 2} ${mx + breite * 0.5} ${unten + 2} ${mx + breite * 1.05} ${unten - 8} C${mx + breite * 0.9} ${unten - 1} ${mx + breite * 0.2} ${unten + 6} ${mx - breite * 0.5} ${unten + 3} C${mx - breite * 0.9} ${unten + 1} ${mx - breite - 2} ${unten - 2} ${mx - breite} ${unten - 8} Z`}
          fill={verlauf}
          stroke={k.dunkel}
          strokeWidth={0.7}
          strokeOpacity={0.4}
        />
      )}
      {schwanz === 'ringel' && (
        <G>
          <Path
            d={`M${mx - breite} ${unten - 8} C${mx - breite * 0.6} ${unten + 1} ${mx + breite * 0.3} ${unten + 2} ${mx + breite * 0.75} ${unten - 4}`}
            stroke={verlauf}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
          />
          {[0.15, 0.35, 0.55].map((t) => (
            <Ellipse
              key={t}
              cx={mx - breite + breite * 1.75 * t + 4}
              cy={unten - 2 + Math.sin(t * 3) * 2}
              rx={2}
              ry={4.6}
              fill={k.dunkel}
              opacity={0.85}
            />
          ))}
          <Ellipse cx={mx + breite * 0.75} cy={unten - 4} rx={4.6} ry={4.6} fill={k.dunkel} />
        </G>
      )}
      {schwanz === 'kelle' && (
        <Ellipse
          cx={mx - breite - 10}
          cy={unten - 3}
          rx={18}
          ry={5}
          fill={k.akzent}
          transform={`rotate(-8 ${mx - breite - 10} ${unten - 3})`}
        />
      )}
      {schwanz === 'kurz' && <Ellipse cx={mx - breite + 2} cy={unten - hoehe * 1.1} rx={4} ry={3} fill={verlauf} />}
    </G>
  );
}
