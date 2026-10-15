import { useId } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Bodenschatten, FellVerlauf, figurFarben, Fellstriche, Schlafkugel, type FigurProps } from './teile';

/**
 * Eichhörnchen: sitzt aufrecht und hält eine Nuss, der buschige Schwanz steht als S über dem Rücken.
 * Im Winterfell mit Ohrpinseln. aktiv = Sprung mit wehendem Schwanz, liegt = eingerollt im Kobel.
 */
export const EICHHOERNCHEN_MASS = { ausschnitt: { y0: 46, hoehe: 110 }, laenge: 74 };

const RUMPF = 'M92 149 C78 147 71 133 74 119 C77 105 87 97 100 96 C111 96 117 104 117 117 C117 131 110 146 98 149 Z';
const BAUCH = 'M104 101 C112 106 114 121 110 141 C105 133 103 117 102 105 Z';
const KOPF = 'M98 91 C96 80 102 72 112 72 C122 72 128 78 131 85 C132 89 128 92 123 92 C117 94 106 96 100 94 Z';
const OHR = 'M106 75 L104 61 L113 72 Z';
const OHR_HINTEN = 'M111 73 L112 60 L118 73 Z';
const ARM = 'M111 100 C117 101 122 105 121 110 C117 111 112 107 109 104 Z';
const KEULE = 'M80 130 C80 120 90 116 98 120 C106 124 106 140 98 146 C90 148 80 142 80 130 Z';
const FUSS = 'M84 149 L113 149 C112 145 103 144 94 144 C88 144 85 146 84 149 Z';
const SCHWANZ =
  'M78 142 C56 138 49 119 57 101 C63 88 60 74 49 67 C61 61 74 69 77 83 C80 98 73 110 75 121 C77 129 81 135 86 141 Z';
const SCHWANZ_HAARE = [
  'M60 104 q-6 -2 -9 -6',
  'M57 116 q-6 0 -10 -3',
  'M62 128 q-5 2 -9 1',
  'M56 90 q-5 -3 -7 -8',
  'M60 78 q-4 -4 -5 -9',
];

export function EichhoernchenFigur(p: FigurProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const k = figurFarben(p);
  const verlauf = p.umriss ?? `url(#eh${id})`;
  const winter = (p.fell ?? 1) < 0.5;
  const def = (
    <FellVerlauf id={`eh${id}`} grund={k.grund} dunkel={p.farben.dunkel} hell={p.farben.hell} von={60} bis={150} />
  );

  if (p.pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox="0 46 200 110">
        {def}
        <Bodenschatten x={100} breite={34} an={k.zeichnen} />
        <Schlafkugel farben={k} verlauf={verlauf} ohr="pinsel" schwanz="buschig" breite={24} hoehe={11} />
      </Svg>
    );
  }

  // Sprung: der ganze Körper waagerecht, Schwanz weht nach hinten oben
  if (p.pose === 'aktiv') {
    return (
      <Svg width="100%" height="100%" viewBox="0 46 200 110">
        {def}
        <Bodenschatten x={104} breite={30} an={k.zeichnen} />
        <G transform="translate(0 -12)">
          <Path
            d="M66 116 C52 106 40 108 30 98 C24 92 22 84 26 78 C34 84 44 92 58 100 C64 104 70 108 74 112 Z"
            fill={verlauf}
          />
          <Path
            d="M74 118 C76 106 92 100 112 102 C126 104 134 110 134 118 C132 126 120 130 102 130 C86 130 74 128 74 118 Z"
            fill={verlauf}
            stroke={k.dunkel}
            strokeWidth={0.7}
            strokeOpacity={0.4}
          />
          <Path
            d="M128 108 C130 100 138 96 146 98 C154 100 158 106 158 110 C156 114 150 115 144 115 C138 116 132 114 128 112 Z"
            fill={verlauf}
          />
          <Path d="M134 101 L134 90 L141 99 Z" fill={k.ferne} />
          {/* Vorderbeine nach vorn, Hinterbeine nach hinten gestreckt */}
          <Path d="M128 124 L148 132 L147 135 L126 128 Z" fill={k.ferne} />
          <Path d="M80 124 L60 134 L58 131 L78 121 Z" fill={k.ferne} />
          {k.zeichnen && (
            <G>
              <Path d="M80 128 C94 132 114 132 128 126" stroke={k.hell} strokeWidth={3} opacity={0.8} fill="none" />
              <Circle cx={148} cy={105} r={1.8} fill={p.farben.dunkel} />
              <Circle cx={158} cy={110} r={1.2} fill={p.farben.dunkel} />
            </G>
          )}
        </G>
      </Svg>
    );
  }

  return (
    <Svg width="100%" height="100%" viewBox="0 46 200 110">
      {def}
      <Bodenschatten x={96} breite={26} an={k.zeichnen} />
      <Path d={SCHWANZ} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.35} />
      {k.zeichnen &&
        SCHWANZ_HAARE.map((d) => (
          <Path key={d} d={d} stroke={p.farben.dunkel} strokeWidth={0.7} opacity={0.3} fill="none" />
        ))}
      <Path d={RUMPF} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.4} />
      <Path d={BAUCH} fill={k.hell} opacity={k.zeichnen ? 0.9 : 1} />
      <Path d={KEULE} fill={verlauf} stroke={k.dunkel} strokeWidth={0.6} strokeOpacity={0.3} />
      <Path d={FUSS} fill={k.ferne} />
      {k.zeichnen && <Fellstriche von={80} bis={98} y={110} farbe={p.farben.dunkel} />}
      <Path d={OHR_HINTEN} fill={k.ferne} />
      <Path d={KOPF} fill={verlauf} stroke={k.dunkel} strokeWidth={0.7} strokeOpacity={0.4} />
      <Path d={OHR} fill={verlauf} stroke={k.dunkel} strokeWidth={0.6} strokeOpacity={0.4} />
      {/* Ohrpinsel im Winterfell */}
      {winter && (
        <Path d="M104 61 l-2 -7 M105 61 l1 -8 M106 62 l3 -6" stroke={k.voll} strokeWidth={1.4} strokeLinecap="round" />
      )}
      <Path d={ARM} fill={verlauf} />
      {k.zeichnen && (
        <G>
          {/* Nuss in den Pfoten */}
          <Ellipse cx={122} cy={108} rx={4.2} ry={3.6} fill={p.farben.geweih} />
          <Path d="M119 106 C121 104.5 124 104.5 125 106" stroke={p.farben.dunkel} strokeWidth={0.6} fill="none" />
          {/* Auge mit hellem Ring, Nase, Schnurrhaare */}
          <Circle cx={118} cy={80} r={3.4} fill={k.hell} opacity={0.6} />
          <Circle cx={118} cy={80} r={2.5} fill={p.farben.dunkel} />
          <Circle cx={118.8} cy={79.2} r={0.8} fill={colors.moon} />
          <Ellipse cx={130.5} cy={85.5} rx={1.4} ry={1.1} fill={p.farben.dunkel} />
          <Path d="M127 88 l8 -1 M127 89 l8 2 M126 87 l7 -4" stroke={colors.moon} strokeWidth={0.3} opacity={0.6} />
          <Path
            d="M101 100 C104 103 104 107 102 110"
            stroke={p.farben.dunkel}
            strokeWidth={0.5}
            opacity={0.3}
            fill="none"
          />
        </G>
      )}
    </Svg>
  );
}
