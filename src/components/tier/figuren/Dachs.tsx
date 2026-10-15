import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, Schlafkugel, type FigurProps } from './teile';

/**
 * Dachs: niedriger, breiter, grauer Körper, dunkle Beine und Bauch, weißer Kopf mit schwarzem
 * Streifen durch das Auge, kräftige Grabkrallen. aktiv = schnüffelt/gräbt mit gesenktem Kopf.
 */
export const DACHS_MASS = { ausschnitt: { y0: 78, hoehe: 78 }, laenge: 126 };

const KOERPER =
  'M56 120 C54 108 66 98 88 96 C112 94 136 96 146 104 C152 110 152 120 146 128 C134 134 100 136 76 134 C62 132 56 128 56 120 Z';
const BAUCH = 'M70 130 C92 136 124 135 144 128 C130 126 96 126 72 124 Z';
const KOPF =
  'M138 106 C148 101 161 103 173 111 C179 115 184 119 182 123 C176 126 166 126 156 126 C149 126 143 122 139 117 Z';
const KOPF_UMRISS = 'M138 106 C148 101 161 103 173 111 C179 115 184 119 182 123 C176 126 166 126 156 126';
/** schwarzer Streifen von der Nase über das Auge zum Ohr */
const STREIFEN = 'M181 119 C172 113 162 108 150 105 L146 111 C156 113 166 117 177 122 Z';
const OHR = 'M146 104 C146 100 150 99 152 102 C152 105 149 106 146 104 Z';
const VORDER = 'M128 126 L128 142 L137 142 L138 126 Z';
const HINTER = 'M64 124 L64 142 L73 142 L75 124 Z';

export function DachsFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#da${id})`;
  const def = (
    <FellVerlauf id={`da${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={92} bis={140} />
  );

  if (p.pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox="0 78 200 78">
        {def}
        <Bodenschatten x={100} breite={48} an={k.zeichnen} />
        <Schlafkugel farben={k} verlauf={verlauf} ohr="rund" schwanz="kurz" breite={40} hoehe={16} />
        {k.zeichnen && (
          <Path d="M146 129 C152 127 158 128 164 131" stroke={k.dunkel} strokeWidth={3} opacity={0.85} fill="none" />
        )}
      </Svg>
    );
  }

  const kopfDrehung = p.pose === 'aktiv' ? 16 : 0;
  return (
    <Svg width="100%" height="100%" viewBox="0 78 200 78">
      {def}
      <Bodenschatten x={110} breite={58} an={k.zeichnen} />
      {/* ferne Beine */}
      <Path d={VORDER} fill={k.dunkel} transform="translate(-8 1)" opacity={0.85} />
      <Path d={HINTER} fill={k.dunkel} transform="translate(9 1)" opacity={0.85} />
      {/* Stummelschwanz */}
      <Path d="M58 114 C52 114 49 118 50 122 C54 122 57 120 59 118 Z" fill={k.hell} opacity={k.zeichnen ? 0.8 : 1} />
      <Path d={KOERPER} fill={verlauf} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} />
      <Path d={BAUCH} fill={k.dunkel} opacity={0.9} />
      {/* grau gesprenkeltes Fell: dunkle Haarspitzen */}
      {k.zeichnen &&
        Array.from({ length: 30 }, (_, i) => {
          const x = 64 + (i % 15) * 5.4;
          const y = (i > 14 ? 112 : 102) + Math.sin(i * 1.7) * 2.5;
          return (
            <Path
              key={i}
              d={`M${x} ${y} l-2.5 3`}
              stroke={i % 3 ? p.farben.dunkel : p.farben.hell}
              strokeWidth={0.7}
              opacity={0.35}
            />
          );
        })}
      {/* nahe Beine mit langen Grabkrallen */}
      <Path d={VORDER} fill={k.dunkel} />
      <Path d={HINTER} fill={k.dunkel} />
      {k.zeichnen &&
        [0, 2.5, 5].map((d) => (
          <G key={d}>
            <Path d={`M${134 + d} 142 l4 6`} stroke={p.farben.hell} strokeWidth={1} strokeLinecap="round" />
            <Path
              d={`M${70 + d} 142 l2.5 6`}
              stroke={p.farben.hell}
              strokeWidth={0.8}
              strokeLinecap="round"
              opacity={0.8}
            />
          </G>
        ))}
      <G transform={`rotate(${kopfDrehung} 140 112)`}>
        <Path d={KOPF} fill={k.hell} />
        <Path d={STREIFEN} fill={k.dunkel} />
        <Path d={KOPF_UMRISS} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} fill="none" />
        <Path d={OHR} fill={k.hell} stroke={k.dunkel} strokeWidth={0.6} />
        {k.zeichnen && (
          <G>
            <Circle cx={160} cy={111} r={1.5} fill={colors.moon} opacity={0.5} />
            <Ellipse cx={181.5} cy={121.5} rx={2} ry={1.8} fill={p.farben.dunkel} />
            <Path
              d="M178 125 C172 126 166 126 160 125"
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
