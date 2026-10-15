import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, Schlafkugel, type FigurProps } from './teile';

/**
 * Biber: großer, runder Nager mit flacher, schuppiger Kelle, kleinen runden Ohren,
 * orangefarbenen Nagezähnen und großen Hinterfüßen mit Schwimmhäuten.
 * aktiv = schwimmt (nur Kopf und Rücken über der Wasserlinie), liegt = eingerollt.
 */
export const BIBER_MASS = { ausschnitt: { y0: 82, hoehe: 74 }, laenge: 116 };

const KOERPER =
  'M62 128 C58 108 76 94 102 92 C128 90 148 100 151 116 C153 128 147 140 133 144 L78 144 C68 142 62 136 62 128 Z';
const KOPF = 'M140 104 C150 98 162 100 170 108 C176 114 178 122 174 126 C168 130 158 130 150 128 L142 124 Z';
const KOPF_UMRISS = 'M140 104 C150 98 162 100 170 108 C176 114 178 122 174 126 C168 130 158 130 150 128';

export function BiberFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#bi${id})`;
  const def = (
    <FellVerlauf id={`bi${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={90} bis={146} />
  );

  if (p.pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox="0 82 200 74">
        {def}
        <Bodenschatten x={96} breite={56} an={k.zeichnen} />
        <Schlafkugel farben={k} verlauf={verlauf} ohr="rund" schwanz="kelle" breite={38} hoehe={17} />
      </Svg>
    );
  }

  const schwimmt = p.pose === 'aktiv';
  return (
    <Svg width="100%" height="100%" viewBox="0 82 200 74">
      {def}
      {!schwimmt && <Bodenschatten x={100} breite={62} an={k.zeichnen} />}
      <G transform={schwimmt ? 'translate(0 16)' : undefined}>
        {/* Kelle: flach, schuppig */}
        <Ellipse cx={42} cy={138} rx={26} ry={6.5} fill={k.akzent} transform="rotate(-6 42 138)" />
        {k.zeichnen &&
          [26, 34, 42, 50, 58].map((x) => (
            <G key={x}>
              <Line x1={x} y1={133} x2={x + 3} y2={143} stroke={p.farben.dunkel} strokeWidth={0.5} opacity={0.5} />
              <Line x1={x + 3} y1={133} x2={x} y2={143} stroke={p.farben.dunkel} strokeWidth={0.5} opacity={0.5} />
            </G>
          ))}
        <Path d={KOERPER} fill={verlauf} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} />
        {k.zeichnen &&
          Array.from({ length: 24 }, (_, i) => {
            const x = 70 + (i % 12) * 6.5;
            const y = (i > 11 ? 116 : 104) + Math.sin(i * 1.3) * 2;
            return (
              <Path
                key={i}
                d={`M${x} ${y} q-2 2 -3 4`}
                stroke={p.farben.dunkel}
                strokeWidth={0.6}
                opacity={0.3}
                fill="none"
              />
            );
          })}
        {/* großer Hinterfuß mit Schwimmhäuten, kleine Vorderpfote */}
        <Path d="M74 140 L66 146 L96 146 L94 140 Z" fill={k.dunkel} />
        {k.zeichnen &&
          [72, 78, 84, 90].map((x) => (
            <Line key={x} x1={x} y1={146} x2={x + 1} y2={140} stroke={k.ferne} strokeWidth={0.6} />
          ))}
        <Path d="M136 136 L134 146 L142 146 L142 136 Z" fill={k.dunkel} />
        <Path d={KOPF} fill={verlauf} />
        <Path d={KOPF_UMRISS} stroke={k.dunkel} strokeWidth={0.8} strokeOpacity={0.5} fill="none" />
        <Ellipse cx={148} cy={102} rx={3.6} ry={3} fill={k.ferne} />
        {/* orange Nagezähne */}
        <Rect x={168.5} y={126} width={4} height={5} rx={1} fill={k.akzent} />
        {k.zeichnen && (
          <G>
            <Circle cx={159} cy={109} r={1.6} fill={p.farben.dunkel} />
            <Circle cx={159.4} cy={108.6} r={0.5} fill={colors.moon} />
            <Ellipse cx={175} cy={118} rx={2.2} ry={1.8} fill={p.farben.dunkel} />
            <Path d="M172 121 l9 -1 M172 122 l9 2" stroke={colors.moon} strokeWidth={0.3} opacity={0.6} />
            <Line x1={170.5} y1={126} x2={170.5} y2={131} stroke={p.farben.dunkel} strokeWidth={0.4} />
          </G>
        )}
      </G>
      {/* Wasser: Wellenlinie, darunter dunkel und durchscheinend */}
      {schwimmt && (
        <G>
          <Rect x={0} y={128} width={200} height={30} fill={colors.night} opacity={0.75} />
          <Path
            d="M0 128 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
            stroke={colors.wasser}
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M150 132 q8 3 20 0 M120 134 q-10 4 -30 2"
            stroke={colors.wasser}
            strokeWidth={0.8}
            opacity={0.6}
            fill="none"
          />
        </G>
      )}
    </Svg>
  );
}
