import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, type FigurProps } from './teile';

/**
 * Wildschwein: hoher Widerrist mit Borstenkamm, keilförmiger Kopf mit Rüsselscheibe, kurze Läufe
 * mit Afterklauen, Schwanz mit Quaste. Frischlinge mit hellen Längsstreifen.
 * aktiv = wühlt mit dem Rüssel im Boden, liegt = ruht im Kessel bzw. in der Suhle.
 */
export const WILDSCHWEIN_MASS = { ausschnitt: { y0: 52, hoehe: 104 }, schulterY: 74 };

const KOERPER =
  'M60 112 C56 96 66 82 86 78 C104 74 124 73 138 79 C146 83 151 92 151 102 C151 114 147 122 139 124 C117 128 89 128 73 124 C65 122 60 118 60 112 Z';
const KOPF =
  'M136 84 C146 85 158 93 171 103 C178 108 184 112 186 117 C184 122 178 122 172 121 C162 119 152 117 144 117 L134 110 Z';
const KOPF_UMRISS =
  'M136 84 C146 85 158 93 171 103 C178 108 184 112 186 117 C184 122 178 122 172 121 C162 119 152 117 144 117';
const OHR = 'M144 87 L149 72 L156 89 Z';
const VORDER = 'M131 120 L133 145 L139 145 L140 120 Z';
const HINTER = 'M66 118 C70 126 69 138 71 145 L77 145 C77 136 80 126 82 118 Z';
const HUF = 'M-3.5 0 L3.5 0 L4 4 L-4 4 Z';
/** Längsstreifen der Frischlinge */
const STREIFEN = [
  'M70 92 C92 84 120 82 140 88',
  'M66 100 C90 93 120 92 146 98',
  'M64 108 C90 102 122 101 148 107',
  'M66 116 C92 112 120 112 146 116',
];

export function WildschweinFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#ws${id})`;
  const liegt = p.pose === 'liegt';
  const kopfDrehung = p.pose === 'aktiv' ? 24 : 0;
  const tief = liegt ? 22 : 0;

  return (
    <Svg width="100%" height="100%" viewBox="0 52 200 104">
      <FellVerlauf id={`ws${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={70} bis={150} />
      <Bodenschatten x={110} breite={liegt ? 60 : 54} an={k.zeichnen} />
      {/* ferne Läufe */}
      {!liegt && (
        <G>
          <Path d={VORDER} fill={k.ferne} transform="translate(-8 1)" />
          <Path d={HINTER} fill={k.ferne} transform="translate(9 1)" />
          <Path d={HUF} fill={k.dunkel} transform="translate(127 145)" />
          <Path d={HUF} fill={k.dunkel} transform="translate(83 145)" />
        </G>
      )}
      <G transform={`translate(0 ${tief})`}>
        {/* Schwanz mit Quaste */}
        <Path d="M61 102 C55 106 53 114 55 121" stroke={k.voll} strokeWidth={2} fill="none" strokeLinecap="round" />
        <Path d="M53 120 l2 7 l3 -6 Z" fill={k.dunkel} />
        <Path d={KOERPER} fill={verlauf} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} />
        {/* Borstenkamm auf dem Rücken */}
        {k.zeichnen &&
          Array.from({ length: 18 }, (_, i) => {
            const x = 82 + i * 3.3;
            const y = 79 - Math.sin((i / 17) * Math.PI) * 4 + (i > 12 ? (i - 12) * 0.6 : 0);
            return <Path key={i} d={`M${x} ${y} l-1.5 -4`} stroke={p.farben.dunkel} strokeWidth={1.1} opacity={0.75} />;
          })}
        {/* struppiges Fell */}
        {k.zeichnen &&
          Array.from({ length: 26 }, (_, i) => {
            const x = 68 + (i % 13) * 6;
            const y = (i > 12 ? 104 : 92) + Math.sin(i) * 3;
            return (
              <Path key={`f${i}`} d={`M${x} ${y} l-2 5`} stroke={p.farben.dunkel} strokeWidth={0.7} opacity={0.3} />
            );
          })}
        {p.streifen &&
          STREIFEN.map((d) => (
            <Path
              key={d}
              d={d}
              stroke={p.umriss ?? p.farben.geweih}
              strokeWidth={2.4}
              opacity={0.75}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        {liegt && <Ellipse cx={100} cy={124} rx={44} ry={4} fill={k.ferne} />}
      </G>
      {/* nahe Läufe mit Hufen und Afterklauen */}
      {!liegt && (
        <G>
          <Path d={VORDER} fill={verlauf} />
          <Path d={HINTER} fill={verlauf} />
          <Path d={HUF} fill={k.dunkel} transform="translate(135.5 145)" />
          <Path d={HUF} fill={k.dunkel} transform="translate(74 145)" />
          <Ellipse cx={131.5} cy={140} rx={1.6} ry={2.4} fill={k.dunkel} />
          <Ellipse cx={70} cy={140} rx={1.6} ry={2.4} fill={k.dunkel} />
        </G>
      )}
      {/* Kopf – beim Wühlen gesenkt */}
      <G transform={`translate(0 ${tief}) rotate(${kopfDrehung} 138 92)`}>
        <Path d={OHR} fill={k.ferne} transform="translate(5 -1)" />
        <Path d={KOPF} fill={verlauf} />
        <Path d={KOPF_UMRISS} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} fill="none" />
        <Path d={OHR} fill={verlauf} stroke={k.dunkel} strokeWidth={0.6} strokeOpacity={0.5} />
        {/* Rüsselscheibe */}
        <Ellipse cx={185.5} cy={117} rx={2.6} ry={4.6} fill={k.akzent} />
        {k.zeichnen && (
          <G>
            <Ellipse cx={185.8} cy={115.5} rx={0.7} ry={1} fill={p.farben.dunkel} />
            <Ellipse cx={185.8} cy={118.8} rx={0.7} ry={1} fill={p.farben.dunkel} />
            <Circle cx={158} cy={98} r={1.7} fill={p.farben.dunkel} />
            <Circle cx={158.5} cy={97.5} r={0.5} fill={colors.moon} />
            {/* Eckzahn (beim Keiler groß) */}
            <Path
              d="M174 118 C176 114 178 112 181 112"
              stroke={p.farben.hell}
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M160 116 C166 118 172 120 178 121"
              stroke={p.farben.dunkel}
              strokeWidth={0.7}
              opacity={0.5}
              fill="none"
            />
          </G>
        )}
      </G>
    </Svg>
  );
}
