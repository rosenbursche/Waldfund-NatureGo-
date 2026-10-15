import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, type FigurProps } from './teile';

/**
 * Feldhase: sitzt geduckt, sehr lange Ohren mit schwarzer Spitze, großes Auge seitlich am Kopf,
 * lange Hinterläufe, Schwanz oben schwarz und unten weiß.
 * aktiv = rennt (weiter Sprung, Ohren angelegt), liegt = in der Sasse geduckt, Ohren flach am Rücken.
 */
export const FELDHASE_MASS = { ausschnitt: { y0: 22, hoehe: 134 }, laenge: 92 };

const RUMPF = 'M70 148 C60 132 64 108 84 100 C100 94 118 96 126 108 C132 118 132 136 124 146 Z';
const KOPF = 'M117 101 C115 89 123 80 135 80 C145 80 153 88 156 96 C157 102 151 106 145 106 C137 108 125 108 119 105 Z';
const OHR_VORN = 'M125 86 C119 66 119 46 125 31 C132 45 134 66 132 86 Z';
const OHR_HINTEN = 'M131 85 C130 66 133 48 141 36 C144 51 141 68 136 86 Z';
const OHR_SPITZE = 'M125 31 C122 37 121 42 121 47 C124 45 127 45 129 46 C129 40 127 35 125 31 Z';
const KEULE = 'M66 134 C66 120 80 114 94 120 C104 126 102 142 92 146 C80 150 66 146 66 134 Z';
const FUSS = 'M64 149 L104 149 C101 145 88 143 74 144 C68 144 64 146 64 149 Z';
const VORDER = 'M118 118 L120 148 L125 148 L125 118 Z';

export function FeldhaseFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#fh${id})`;
  const def = (
    <FellVerlauf id={`fh${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={80} bis={150} />
  );
  const auge = (cx: number, cy: number) =>
    k.zeichnen && (
      <G>
        <Ellipse cx={cx} cy={cy} rx={4} ry={3.4} fill={p.farben.auge} />
        <Circle cx={cx + 0.5} cy={cy} r={1.8} fill={p.farben.dunkel} />
        <Circle cx={cx + 1.2} cy={cy - 0.8} r={0.6} fill={colors.moon} />
      </G>
    );

  if (p.pose === 'liegt') {
    // in der Sasse: flach geduckt, Ohren eng am Rücken
    return (
      <Svg width="100%" height="100%" viewBox="0 22 200 134">
        {def}
        <Bodenschatten x={104} breite={46} an={k.zeichnen} />
        <Path
          d="M62 148 C58 132 76 122 100 122 C122 122 138 128 140 140 C140 146 136 148 130 148 Z"
          fill={verlauf}
          stroke={k.dunkel}
          strokeWidth={0.7}
          strokeOpacity={0.4}
        />
        <Path
          d="M132 130 C134 122 142 118 150 120 C158 122 162 128 162 134 C158 138 150 140 142 139 C136 138 132 135 132 130 Z"
          fill={verlauf}
        />
        <Path d="M136 124 C120 118 100 116 82 120 C98 114 118 114 138 120 Z" fill={k.ferne} />
        <Path d="M82 120 C88 116 92 116 96 118 C92 120 87 121 82 120 Z" fill={k.dunkel} />
        {auge(150, 127)}
      </Svg>
    );
  }

  if (p.pose === 'aktiv') {
    // weiter Sprung: Körper gestreckt, Hinterläufe weit nach vorn unter den Körper, Ohren angelegt
    return (
      <Svg width="100%" height="100%" viewBox="0 22 200 134">
        {def}
        <Bodenschatten x={104} breite={40} an={k.zeichnen} />
        <G transform="translate(0 -8)">
          <Path
            d="M58 122 C56 108 72 98 100 98 C126 98 144 104 148 114 C150 122 142 128 130 128 C110 130 80 132 66 130 C60 128 58 126 58 122 Z"
            fill={verlauf}
            stroke={k.dunkel}
            strokeWidth={0.7}
            strokeOpacity={0.4}
          />
          <Path
            d="M140 104 C142 94 152 90 160 92 C168 94 174 100 174 106 C170 110 162 112 154 111 C148 110 142 108 140 104 Z"
            fill={verlauf}
          />
          <Path d="M146 98 C130 92 112 88 96 88 C110 84 132 86 148 94 Z" fill={k.ferne} />
          <Path d="M96 88 C100 85 106 85 110 86 C105 88 100 89 96 88 Z" fill={k.dunkel} />
          {/* Vorderläufe nach vorn, Hinterläufe gestreckt nach hinten */}
          <Path d="M138 120 L164 136 L162 139 L134 124 Z" fill={k.ferne} />
          <Path d="M70 124 L40 138 L38 134 L66 118 Z" fill={verlauf} />
          <Path d="M60 116 C56 112 54 110 52 112 C52 116 56 118 60 118 Z" fill={k.hell} />
          {auge(162, 100)}
        </G>
      </Svg>
    );
  }

  return (
    <Svg width="100%" height="100%" viewBox="0 22 200 134">
      {def}
      <Bodenschatten x={96} breite={38} an={k.zeichnen} />
      <Path d={VORDER} fill={k.ferne} transform="translate(-6 0)" />
      <Path d={RUMPF} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.4} />
      {/* Schwanz: oben schwarz, unten weiß */}
      <Ellipse cx={66} cy={126} rx={6} ry={5} fill={k.hell} />
      <Path d="M61 124 C62 120 67 119 70 122" stroke={k.dunkel} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d={KEULE} fill={verlauf} stroke={k.dunkel} strokeWidth={0.6} strokeOpacity={0.3} />
      <Path d={FUSS} fill={k.ferne} />
      <Path d={VORDER} fill={verlauf} />
      <Path d={OHR_HINTEN} fill={k.ferne} />
      <Path d="M141 36 C139 41 138 46 138 50 C140 48 142 48 143 48 C143 43 142 39 141 36 Z" fill={k.dunkel} />
      <Path d={KOPF} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.4} />
      <Path d={OHR_VORN} fill={verlauf} stroke={k.dunkel} strokeWidth={0.6} strokeOpacity={0.4} />
      <Path d={OHR_SPITZE} fill={k.dunkel} />
      {k.zeichnen && (
        <G>
          <Path d="M124 82 C122 66 122 50 125 38" stroke={k.hell} strokeWidth={1} opacity={0.5} fill="none" />
          <Path d="M110 104 C114 112 116 124 114 136" stroke={k.hell} strokeWidth={4} opacity={0.35} fill="none" />
          <Ellipse cx={155} cy={98} rx={1.5} ry={1.2} fill={p.farben.dunkel} />
          <Path d="M153 101 l9 -1 M153 102 l9 2 M152 100 l8 -4" stroke={colors.moon} strokeWidth={0.3} opacity={0.6} />
        </G>
      )}
      {auge(140, 91)}
    </Svg>
  );
}
