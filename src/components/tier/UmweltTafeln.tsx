import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { ArtTaler } from '@/components/taler/ArtTaler';
import { Schrift } from '@/components/Schrift';
import type { Landschaft, TierSeite, TrittForm, Zone } from '@/data/tierSeiten';
import { MONATE } from '@/logic/jahreszeit';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { cmZuPunkten, farbMix, nahrungIm } from '@/logic/tierJahr';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { TierFigur } from './TierFigur';
import { SymbolSchalter, TierTafel } from './TierTafel';
import { SpurBild, TierSymbol, type SpurFarben, type SymbolName } from './TierSymbol';
import { TrittsiegelForm } from './Trittsiegel';
import { TierFoto } from './TierFoto';
import type { FotoId } from '@/data/fotos';
import { Chip } from './ZeitTafeln';

// ---------- Lebensraum ----------

/** Die drei Zonen jedes Lebensraum-Bilds (links, Mitte, rechts) und wo das Tier darin steht */
const ZONEN: { von: number; bis: number }[] = [
  { von: 0, bis: 100 },
  { von: 100, bis: 190 },
  { von: 190, bis: 300 },
];
const TIER_X = [52, 146, 246];
/** Symbol je Zone und Landschaft */
export const ZONEN_SYMBOL: Record<Landschaft, [SymbolName, SymbolName, SymbolName]> = {
  waldrand: ['baum', 'gebuesch', 'wiese'],
  wald: ['gebuesch', 'baum', 'baum'],
  feld: ['gebuesch', 'wiese', 'mais'],
  ufer: ['baum', 'burg', 'suhle'],
};

/** Himmel aller Landschaften: Verlauf, Mond mit Sternen bzw. Sonne mit Wolken */
function Himmel({ nacht }: { nacht: boolean }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={nacht ? colors.night : colors.forest} />
          <Stop offset="1" stopColor={nacht ? colors.forest : colors.moss} />
        </LinearGradient>
        <RadialGradient id="dunst" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.fog} stopOpacity={nacht ? 0.16 : 0.22} />
          <Stop offset="1" stopColor={colors.fog} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="schein" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={nacht ? colors.moon : colors.amber} stopOpacity={0.35} />
          <Stop offset="1" stopColor={nacht ? colors.moon : colors.amber} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={300} height={170} fill="url(#himmel)" />
      <Ellipse cx={262} cy={30} rx={34} ry={34} fill="url(#schein)" />
      {nacht ? (
        <G>
          <Ellipse cx={262} cy={30} rx={10} ry={10} fill={colors.moon} opacity={0.95} />
          {STERNE.map(([x, y], k) => (
            <Ellipse key={k} cx={x} cy={y} rx={k % 3 ? 0.7 : 1.1} ry={k % 3 ? 0.7 : 1.1} fill={colors.moon} />
          ))}
        </G>
      ) : (
        <G>
          <Ellipse cx={262} cy={30} rx={12} ry={12} fill={colors.amber} opacity={0.9} />
          <Path
            d="M40 34 C40 26 52 24 56 30 C60 22 76 24 76 33 C84 32 86 40 78 41 L44 41 C36 41 34 35 40 34 Z"
            fill={colors.fog}
            opacity={0.18}
          />
          <Path
            d="M170 22 C170 16 180 14 183 19 C186 13 198 15 198 22 C204 22 205 28 199 28 L173 28 C167 28 166 23 170 22 Z"
            fill={colors.fog}
            opacity={0.14}
          />
        </G>
      )}
    </G>
  );
}

/** Glühwürmchen in der Dämmerung */
function Gluehen({ an }: { an: boolean }) {
  if (!an) return null;
  return (
    <G>
      {GLUEHWUERMCHEN.map(([x, y], k) => (
        <G key={k}>
          <Ellipse cx={x} cy={y} rx={4} ry={4} fill="url(#schein)" />
          <Ellipse cx={x} cy={y} rx={0.9} ry={0.9} fill={colors.amber} />
        </G>
      ))}
    </G>
  );
}

/** Laubbaum-Schattenriss (Stamm, zwei Äste, Krone aus Kreisen) */
function Laubbaum({ x, oben, r = 1, farbe }: { x: number; oben: number; r?: number; farbe: string }) {
  return (
    <G>
      <Path
        d={`M${x - 2 * r} 140 L${x - 1.2 * r} ${oben + 26 * r} L${x + 1.2 * r} ${oben + 26 * r} L${x + 2 * r} 140 Z`}
        fill={farbe}
      />
      {[
        [0, 14, 13],
        [-10, 22, 10],
        [10, 21, 10],
        [-5, 6, 9],
        [6, 8, 9],
        [0, 28, 9],
      ].map(([dx, dy, rr], k) => (
        <Ellipse key={k} cx={x + dx * r} cy={oben + dy * r} rx={rr * r} ry={rr * r * 0.9} fill={farbe} />
      ))}
    </G>
  );
}

/** Nadelbaum-Schattenriss aus Etagen */
function Nadelbaum({ x, oben, farbe }: { x: number; oben: number; farbe: string }) {
  return (
    <G>
      <Path d={`M${x - 1.5} 140 L${x - 1.5} 124 L${x + 1.5} 124 L${x + 1.5} 140 Z`} fill={farbe} />
      {[0, 1, 2, 3, 4].map((k) => {
        const y = 126 - k * ((126 - oben) / 5);
        const w = 15 - k * 2.6;
        return <Path key={k} d={`M${x - w} ${y} L${x} ${y - 22 + k * 1.5} L${x + w} ${y} Z`} fill={farbe} />;
      })}
    </G>
  );
}

/** Tiefer Wald: dichte Stämme links, Lichtung in der Mitte, rechts ein großer Baum mit hoher Krone */
function WaldBild({ nacht }: { nacht: boolean }) {
  const hinten = farbMix(colors.night, colors.forest, 0.5);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Himmel nacht={nacht} />
      {Array.from({ length: 20 }, (_, k) =>
        k % 2 ? (
          <Nadelbaum key={k} x={k * 15 + 4} oben={60 + ((k * 13) % 20)} farbe={hinten} />
        ) : (
          <Laubbaum key={k} x={k * 15 + 4} oben={58 + ((k * 11) % 22)} r={0.9} farbe={hinten} />
        ),
      )}
      <Ellipse cx={150} cy={136} rx={150} ry={12} fill="url(#dunst)" />
      {/* Dickicht links */}
      <Path d="M0 140 C0 116 16 104 34 112 C40 98 64 98 70 112 C82 106 100 116 98 140 Z" fill={colors.night} />
      {[16, 44, 78].map((x) => (
        <Laubbaum key={x} x={x} oben={44 + (x % 7)} farbe={colors.night} />
      ))}
      {/* großer Baum rechts: dicker Stamm, ausladende Krone oben */}
      <Path d="M240 140 L242 40 L252 40 L256 140 Z" fill={colors.night} />
      <Path d="M246 70 C232 62 222 56 212 54 M248 58 C262 50 272 46 284 46" stroke={colors.night} strokeWidth={3} />
      {[
        [246, 26, 26],
        [222, 38, 18],
        [272, 34, 20],
        [236, 18, 16],
        [262, 16, 16],
      ].map(([x, y, r]) => (
        <Ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.8} fill={colors.night} />
      ))}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {/* Farne und Moos auf der Lichtung */}
      {Array.from({ length: 14 }, (_, k) => {
        const x = 110 + k * 7;
        return (
          <Path
            key={k}
            d={`M${x} 141 C${x - 3} 136 ${x - 6} 133 ${x - 9} 132 M${x} 141 C${x + 3} 136 ${x + 6} 133 ${x + 9} 132`}
            stroke={colors.moss}
            strokeWidth={0.9}
            fill="none"
          />
        );
      })}
      <Gluehen an={nacht} />
      <Line x1={0} y1={140} x2={300} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

/** Feld: Hecke links, offenes Feld in der Mitte, Acker mit Furchen rechts */
function FeldBild({ nacht }: { nacht: boolean }) {
  const fern = farbMix(colors.forest, colors.fog, nacht ? 0.08 : 0.25);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Himmel nacht={nacht} />
      <Path d="M0 116 C60 108 120 114 180 108 C230 104 270 110 300 106 L300 140 L0 140 Z" fill={fern} opacity={0.6} />
      {[170, 200, 230].map((x) => (
        <Laubbaum key={x} x={x} oben={96} r={0.5} farbe={farbMix(colors.night, colors.forest, 0.5)} />
      ))}
      {/* Hecke links mit Beeren */}
      <Path d="M0 140 C-2 120 14 106 30 114 C34 98 58 96 66 110 C78 102 98 112 96 140 Z" fill={colors.night} />
      {HECKEN_BLAETTER.map(([x, y], k) => (
        <Ellipse key={k} cx={x - 100} cy={y - 2} rx={2.6} ry={1.5} fill={colors.moss} opacity={0.5} />
      ))}
      {[
        [24, 124],
        [52, 116],
        [76, 128],
      ].map(([x, y]) => (
        <Ellipse key={x} cx={x} cy={y} rx={1.4} ry={1.4} fill={colors.blut} />
      ))}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {/* Feld: Gras und Blumen */}
      {Array.from({ length: 36 }, (_, k) => {
        const x = 100 + k * 2.5;
        return (
          <Line
            key={k}
            x1={x}
            y1={141}
            x2={x + ((k % 3) - 1) * 1.5}
            y2={133 - (k % 4) * 1.6}
            stroke={colors.moss}
            strokeWidth={0.9}
          />
        );
      })}
      {/* Acker: Furchen, die nach hinten zusammenlaufen */}
      <Path d="M190 140 L300 140 L300 170 L190 170 Z" fill={farbMix(colors.night, colors.forest, 0.35)} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Line
          key={k}
          x1={192 + k * 4}
          y1={141}
          x2={192 + k * 22}
          y2={170}
          stroke={colors.moss}
          strokeWidth={0.8}
          opacity={0.6}
        />
      ))}
      {Array.from({ length: 12 }, (_, k) => (
        <Path key={k} d={`M${196 + k * 9} 140 l0 -6 m-2 2 l2 -2 l2 2`} stroke={colors.moss} strokeWidth={0.8} />
      ))}
      <Gluehen an={nacht} />
      <Line x1={0} y1={140} x2={300} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

/** Ufer: Weiden und Pappeln links, Ufer mit Biberburg in der Mitte, rechts offenes Wasser */
function UferBild({ nacht }: { nacht: boolean }) {
  const hinten = farbMix(colors.night, colors.forest, 0.5);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Himmel nacht={nacht} />
      {Array.from({ length: 12 }, (_, k) => (
        <Laubbaum key={k} x={k * 10 + 2} oben={62 + ((k * 9) % 16)} r={0.75} farbe={hinten} />
      ))}
      {[18, 52, 84].map((x) => (
        <Laubbaum key={x} x={x} oben={50} farbe={colors.night} />
      ))}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {/* Uferböschung und Burg aus Ästen */}
      <Path d="M96 140 C110 132 160 130 196 140 Z" fill={colors.night} />
      <Path
        d="M126 140 C128 124 140 116 152 116 C164 116 174 124 176 140 Z"
        fill={farbMix(colors.night, colors.forest, 0.7)}
      />
      {Array.from({ length: 10 }, (_, k) => (
        <Line
          key={k}
          x1={130 + k * 4.4}
          y1={136 - (k % 3) * 6}
          x2={140 + k * 3}
          y2={128 - (k % 4) * 4}
          stroke={colors.moss}
          strokeWidth={1}
        />
      ))}
      {/* Wasser mit Wellen und Spiegelung */}
      <Path d="M190 140 L300 140 L300 170 L170 170 Z" fill={colors.wasser} opacity={nacht ? 0.25 : 0.35} />
      {[146, 154, 162].map((y, k) => (
        <Path
          key={y}
          d={`M${200 + k * 6} ${y} q8 -2 16 0 t16 0 t16 0 t16 0`}
          stroke={colors.moon}
          strokeWidth={0.8}
          opacity={0.4}
          fill="none"
        />
      ))}
      <Ellipse cx={262} cy={150} rx={6} ry={1.6} fill={nacht ? colors.moon : colors.amber} opacity={0.5} />
      {/* Schilf am Wasserrand */}
      {Array.from({ length: 12 }, (_, k) => {
        const x = 178 + k * 3;
        return (
          <G key={k}>
            <Line x1={x} y1={142} x2={x + ((k % 3) - 1)} y2={116 + (k % 4) * 3} stroke={colors.moss} strokeWidth={1} />
            {k % 3 === 0 && (
              <Ellipse cx={x + ((k % 3) - 1)} cy={118 + (k % 4) * 3} rx={1.2} ry={3.5} fill={colors.night} />
            )}
          </G>
        );
      })}
      <Gluehen an={nacht} />
      <Line x1={0} y1={140} x2={190} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

/** Waldrand: Wald links, Hecke in der Mitte, Wiese rechts */
function WaldrandBild({ nacht }: { nacht: boolean }) {
  const fern = farbMix(colors.forest, colors.fog, nacht ? 0.08 : 0.25);
  const hinten = farbMix(colors.night, colors.forest, 0.5);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Himmel nacht={nacht} />
      {/* ferne Hügel */}
      <Path d="M0 112 C40 96 80 104 120 98 C170 90 220 100 300 92 L300 140 L0 140 Z" fill={fern} opacity={0.6} />
      {/* hintere Baumreihe */}
      {Array.from({ length: 16 }, (_, k) => {
        const x = k * 8 - 2;
        const h = 34 + ((k * 7) % 11);
        return k % 3 === 1 ? (
          <Path
            key={k}
            d={`M${x} 140 L${x} 126 C${x - 9} 126 ${x - 8} ${140 - h} ${x} ${140 - h} C${x + 8} ${140 - h} ${x + 9} 126 ${x} 126 Z`}
            fill={hinten}
          />
        ) : (
          <Path
            key={k}
            d={`M${x} 140 L${x - 6} 132 L${x - 2} 132 L${x - 5} 124 L${x - 1} 124 L${x} ${140 - h} L${x + 1} 124 L${x + 5} 124 L${x + 2} 132 L${x + 6} 132 Z`}
            fill={hinten}
          />
        );
      })}
      {/* vordere Waldbäume mit Stamm und Krone */}
      {[
        [14, 70, 'n'],
        [38, 58, 'l'],
        [64, 66, 'n'],
        [88, 60, 'l'],
      ].map(([x, top, art]) => {
        const xx = x as number;
        const t = top as number;
        return art === 'n' ? (
          <G key={xx}>
            <Path d={`M${xx - 1.5} 140 L${xx - 1.5} 124 L${xx + 1.5} 124 L${xx + 1.5} 140 Z`} fill={colors.night} />
            {[0, 1, 2, 3, 4].map((k) => {
              const y = 126 - k * ((126 - t) / 5);
              const w = 15 - k * 2.6;
              return (
                <Path
                  key={k}
                  d={`M${xx - w} ${y} L${xx} ${y - 22 + k * 1.5} L${xx + w} ${y} Z`}
                  fill={colors.night}
                  opacity={0.96}
                />
              );
            })}
          </G>
        ) : (
          <G key={xx}>
            <Path
              d={`M${xx - 2} 140 L${xx - 1.2} ${t + 26} L${xx + 1.2} ${t + 26} L${xx + 2} 140 Z M${xx} ${t + 40} L${xx - 9} ${t + 24} M${xx} ${t + 34} L${xx + 8} ${t + 22}`}
              fill={colors.night}
              stroke={colors.night}
              strokeWidth={1.4}
            />
            {[
              [0, 14, 13],
              [-10, 22, 10],
              [10, 21, 10],
              [-5, 6, 9],
              [6, 8, 9],
              [0, 28, 9],
            ].map(([dx, dy, r], k) => (
              <Ellipse key={k} cx={xx + dx} cy={t + dy} rx={r} ry={r * 0.9} fill={colors.night} />
            ))}
          </G>
        );
      })}
      {/* Nebel am Waldfuß */}
      <Ellipse cx={90} cy={136} rx={120} ry={10} fill="url(#dunst)" />
      {/* Hecke am Waldrand mit Beeren */}
      <Path
        d="M100 140 C96 124 108 114 118 120 C120 106 138 104 142 116 C150 108 166 112 166 124 C176 120 188 128 186 140 Z"
        fill={colors.night}
        opacity={0.85}
      />
      {HECKEN_BLAETTER.map(([x, y], k) => (
        <Ellipse
          key={k}
          cx={x}
          cy={y}
          rx={2.6}
          ry={1.5}
          fill={colors.moss}
          opacity={0.55}
          transform={`rotate(${(k * 47) % 180} ${x} ${y})`}
        />
      ))}
      {[
        [118, 126],
        [146, 120],
        [162, 128],
        [132, 132],
      ].map(([x, y]) => (
        <Ellipse key={x} cx={x} cy={y} rx={1.4} ry={1.4} fill={colors.blut} />
      ))}
      {/* Wiese mit Gräsern und Blumen */}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {Array.from({ length: 48 }, (_, k) => {
        const x = 188 + k * 2.4;
        return (
          <Line
            key={k}
            x1={x}
            y1={141}
            x2={x + ((k % 3) - 1) * 1.6}
            y2={132 - (k % 5) * 1.6}
            stroke={colors.moss}
            strokeWidth={0.9}
          />
        );
      })}
      {BLUMEN.map(([x, y, f], k) => (
        <G key={k}>
          <Line x1={x} y1={141} x2={x} y2={y} stroke={colors.moss} strokeWidth={0.7} />
          <Ellipse
            cx={x}
            cy={y}
            rx={1.5}
            ry={1.5}
            fill={[colors.amber, colors.moon, colors.rare][f]}
            opacity={nacht ? 0.5 : 0.9}
          />
        </G>
      ))}
      <Gluehen an={nacht} />
      <Line x1={0} y1={140} x2={300} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

const STERNE: [number, number][] = [
  [40, 20],
  [120, 14],
  [180, 34],
  [215, 12],
  [90, 40],
  [24, 48],
  [150, 22],
  [236, 52],
  [70, 12],
  [200, 46],
];
const HECKEN_BLAETTER: [number, number][] = Array.from({ length: 30 }, (_, k) => [
  104 + ((k * 29) % 80),
  116 + ((k * 13) % 22),
]);
const BLUMEN: [number, number, number][] = Array.from({ length: 14 }, (_, k) => [
  194 + ((k * 37) % 100),
  130 - ((k * 7) % 8),
  k % 3,
]);
function Landschaftsbild({ art, nacht }: { art: Landschaft; nacht: boolean }) {
  if (art === 'wald') return <WaldBild nacht={nacht} />;
  if (art === 'feld') return <FeldBild nacht={nacht} />;
  if (art === 'ufer') return <UferBild nacht={nacht} />;
  return <WaldrandBild nacht={nacht} />;
}

const GLUEHWUERMCHEN: [number, number][] = [
  [196, 112],
  [222, 120],
  [250, 104],
  [176, 98],
  [276, 116],
  [120, 96],
];

export function LebensraumBild({ tier }: { tier: TierSeite }) {
  const [nacht, setNacht] = useState(false);
  const [wahl, setWahl] = useState<Zone | null>(null);
  const l = tier.lebensraum;
  const ort = nacht ? l.nacht : l.tag;
  const zone = wahl ?? ort;
  const oben = l.oben?.includes(ort) ?? false;
  const pose = (nacht ? l.posen?.[1] : l.posen?.[0]) ?? (nacht ? 'aktiv' : 'steht');
  const symbole = ZONEN_SYMBOL[l.landschaft];

  return (
    <TierTafel symbol="baum" titel="Zuhause" geste="tippen">
      <SymbolSchalter
        wahl={nacht ? 'nacht' : 'tag'}
        optionen={[
          { wert: 'tag', symbol: 'sonne', name: 'Tag' },
          { wert: 'nacht', symbol: 'mond', name: 'Dämmerung' },
        ]}
        onWahl={(w) => setNacht(w === 'nacht')}
      />
      <View style={stile.landschaft}>
        <Landschaftsbild art={l.landschaft} nacht={nacht} />
        {/* gewählte Zone leicht hervorheben */}
        <View
          pointerEvents="none"
          style={[
            stile.zoneLicht,
            {
              left: `${(ZONEN[zone].von / 300) * 100}%`,
              width: `${((ZONEN[zone].bis - ZONEN[zone].von) / 300) * 100}%`,
            },
          ]}
        />
        {/* Tier in seiner Zone – oben in der Baumkrone, wenn es dort lebt (Eichhörnchen) */}
        <View
          pointerEvents="none"
          style={[stile.reh, { left: `${((TIER_X[ort] - 34) / 300) * 100}%` }, oben && stile.tierOben]}
        >
          <TierFigur tier={tier} pose={pose} licht={nacht} />
        </View>
        {ZONEN.map((z, i) => (
          <Pressable
            key={i}
            onPress={() => setWahl(i as Zone)}
            accessibilityRole="button"
            accessibilityLabel={l.orte[i]}
            style={[stile.zone, { left: `${(z.von / 300) * 100}%`, width: `${((z.bis - z.von) / 300) * 100}%` }]}
          />
        ))}
      </View>
      <View style={stile.reihe}>
        {ZONEN.map((_, i) => (
          <Chip
            key={i}
            symbol={symbole[i]}
            text={l.orte[i]}
            farbe={i === zone ? colors.amber : i === ort ? colors.moon : colors.fog}
          />
        ))}
      </View>
    </TierTafel>
  );
}

// ---------- Speiseplan ----------

export function Speiseplan({
  tier,
  monat,
  setMonat,
  children,
}: {
  tier: TierSeite;
  monat: number;
  setMonat: (m: number) => void;
  children?: ReactNode;
}) {
  const jetzt = nahrungIm(tier, monat).map((n) => n.icon);
  return (
    <TierTafel symbol="kraut" titel="Speiseplan" geste="tippen">
      <View style={stile.monate}>
        {MONATE.map((m, i) => {
          const an = i + 1 === monat;
          return (
            <Pressable
              key={m}
              onPress={() => setMonat(i + 1)}
              accessibilityRole="button"
              accessibilityLabel={m}
              hitSlop={4}
              style={[stile.monat, an && stile.monatAn]}
            >
              <Schrift style={[stile.monatText, an && { color: colors.night }]}>{m[0]}</Schrift>
            </Pressable>
          );
        })}
      </View>
      <View style={stile.teller}>
        {tier.nahrung.map((n) => {
          const da = jetzt.includes(n.icon);
          return (
            <View key={n.icon} style={[stile.tellerEintrag, !da && { opacity: 0.28 }]}>
              <View style={[stile.tellerKreis, da && { borderColor: colors.amber }]}>
                <TierSymbol name={n.icon} groesse={30} farbe={da ? colors.amber : colors.fog} />
              </View>
              <Schrift style={stile.tellerText}>{n.kurz}</Schrift>
              {/* in welchen Monaten es das gibt */}
              <View style={stile.balken}>
                {MONATE.map((m, k) => (
                  <View
                    key={m}
                    style={[
                      stile.strich,
                      n.monate.includes(k + 1) && { backgroundColor: colors.amber },
                      k + 1 === monat && stile.strichJetzt,
                    ]}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
      {children}
    </TierTafel>
  );
}

// ---------- Spuren ----------

export function SpurenKarten({ tier }: { tier: TierSeite }) {
  const [offen, setOffen] = useState<string | null>(null);
  const [echt, setEcht] = useState(false);
  // das Trittsiegel; mit Zentimeter-Angabe gibt es die 1:1-Ansicht
  const tritt = tier.spuren.find((s) => s.icon === 'tritt');

  return (
    <TierTafel symbol="tritt" titel="Spuren lesen" geste="tippen">
      <View style={stile.karten}>
        {tier.spuren.map((s) => {
          const auf = offen === s.icon;
          return (
            <Pressable
              key={s.icon}
              onPress={() => setOffen(auf ? null : s.icon)}
              accessibilityRole="button"
              accessibilityLabel={s.kurz}
              style={[stile.karte, auf && { borderColor: colors.amber }]}
            >
              {tier.fotos?.spuren?.[s.icon] ? (
                // echtes Foto der Spur füllt die Karte
                <TierFoto
                  id={tier.fotos.spuren[s.icon]!}
                  style={auf ? stile.spurFotoKlein : stile.spurFoto}
                  nachweis={!auf}
                />
              ) : (
                <View style={auf ? stile.spurKlein : stile.spurGross}>
                  <SpurBild name={s.icon} form={tier.tritt} farben={spurFarben(tier)} />
                </View>
              )}
              {auf && <Schrift style={stile.karteText}>{s.kurz}</Schrift>}
              {auf && s.cm && <Schrift style={stile.karteZahl}>{`${s.cm[0]}–${s.cm[1]} cm`}</Schrift>}
            </Pressable>
          );
        })}
      </View>
      {tritt?.cm && (
        <Pressable
          onPress={() => setEcht(!echt)}
          accessibilityRole="button"
          accessibilityLabel="Trittsiegel in Originalgröße"
          style={[stile.echtKnopf, echt && { backgroundColor: colors.amber }]}
        >
          <TierSymbol name="lineal" groesse={18} farbe={echt ? colors.night : colors.amber} />
          <Schrift style={[stile.echtText, echt && { color: colors.night }]}>1 : 1</Schrift>
        </Pressable>
      )}
      {echt && tritt?.cm && <Originalgroesse cm={(tritt.cm[0] + tritt.cm[1]) / 2} form={tier.tritt} />}
      {offen === 'tritt' && <Faehrte art={tier.faehrte} form={tier.tritt} />}
    </TierTafel>
  );
}

/**
 * Fährte: mehrere Trittsiegel hintereinander, Laufrichtung nach rechts.
 * - versetzt: links/rechts im Wechsel (Reh, Wildschwein …)
 * - geschnürt: wie auf einer Perlenkette auf einer Linie (Fuchs, Katzen)
 * - Sprungspur: Vierergruppen – die großen Hinterfüße landen vor den kleinen Vorderfüßen (Hase, Eichhörnchen)
 */
function Faehrte({ art, form }: { art: TierSeite['faehrte']; form: TrittForm }) {
  const tritte: { x: number; y: number; s: number }[] = [];
  if (art === 'sprung') {
    for (let g = 0; g < 4; g++) {
      const x0 = 14 + g * 74;
      // Vorderfüße klein, hintereinander; Hinterfüße groß, nebeneinander davor
      tritte.push({ x: x0, y: 44, s: 0.38 }, { x: x0 + 14, y: 38, s: 0.38 });
      tritte.push({ x: x0 + 36, y: 30, s: 0.6 }, { x: x0 + 36, y: 50, s: 0.6 });
    }
  } else {
    for (let k = 0; k < 9; k++) {
      tritte.push({
        x: 18 + k * 33,
        y: 40 + (art === 'versetzt' ? (k % 2 === 0 ? -7 : 7) : 0) + Math.sin(k) * 1.5,
        s: 0.55,
      });
    }
  }
  return (
    <View style={stile.faehrte} accessibilityLabel="Fährte">
      <Svg width="100%" height="100%" viewBox="0 0 300 60">
        <Path
          d="M0 44 C60 38 120 48 180 40 C230 34 270 42 300 38"
          stroke={colors.moss}
          strokeWidth={26}
          opacity={0.35}
          fill="none"
        />
        {tritte.map((t, k) => (
          <G key={k} transform={`translate(${t.x} ${t.y}) rotate(90) scale(${t.s})`}>
            <TrittsiegelForm form={form} farbe={colors.night} />
          </G>
        ))}
        <Path
          d="M262 10 L290 10 M282 4 L290 10 L282 16"
          stroke={colors.fog}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

/** Trittsiegel in (ungefähr) echter Größe mit Zentimeter-Lineal – zum Vergleichen im Wald */
function Originalgroesse({ cm, form }: { cm: number; form: TrittForm }) {
  // Das Trittsiegel ist im Raster 30 Einheiten hoch
  const hoehe = cmZuPunkten(cm);
  const bisCm = Math.ceil(cm) + 1;
  const lineal = cmZuPunkten(bisCm);
  return (
    <View style={stile.echt}>
      <Svg width={hoehe} height={hoehe} viewBox="-15 -15 30 30">
        <TrittsiegelForm form={form} farbe={colors.moon} />
      </Svg>
      <Svg width={34} height={lineal + 4}>
        <Line x1={4} y1={2} x2={4} y2={lineal + 2} stroke={colors.fog} strokeWidth={1.5} />
        {Array.from({ length: bisCm + 1 }, (_, i) => (
          <G key={i}>
            <Line
              x1={4}
              y1={2 + cmZuPunkten(i)}
              x2={14}
              y2={2 + cmZuPunkten(i)}
              stroke={colors.fog}
              strokeWidth={1.2}
            />
            <SvgText x={18} y={6 + cmZuPunkten(i)} fontSize={9} fill={colors.fog} fontFamily={fonts.etikett}>
              {i}
            </SvgText>
          </G>
        ))}
      </Svg>
      <Schrift art="klein" style={{ flex: 1 }}>
        ≈ echte Größe
      </Schrift>
    </View>
  );
}

/** Farben der Spuren-Zeichnungen: Boden und Holz aus dem Theme, Losung/Knospen aus den Fellfarben */
export function spurFarben(t: TierSeite): SpurFarben {
  return {
    boden: colors.moss,
    tief: t.farben.dunkel,
    kante: colors.moss,
    glanz: colors.moon,
    holz: t.farben.winter,
    hell: t.farben.hell,
    knospe: t.farben.sommer,
    markierung: colors.amber,
  };
}

// ---------- Gefahren ----------

export function Gefahren({ tier, sammlung }: { tier: TierSeite; sammlung: Record<string, unknown> }) {
  const reihen = [
    { jung: false, liste: tier.gefahren.filter((g) => !g.nurJung) },
    { jung: true, liste: tier.gefahren.filter((g) => g.nurJung) },
  ].filter((r) => r.liste.length > 0);
  return (
    <TierTafel symbol="wolf" titel="Gefahren" geste="tippen" art="warnung">
      {reihen.map((r) => (
        <View key={String(r.jung)} style={stile.gefahrReihe}>
          <View style={stile.gefahrQuellen}>
            {r.liste.map((g) => (
              <Gefahr key={g.kurz} gefahr={g} sammlung={sammlung} />
            ))}
          </View>
          <Svg width={34} height={20}>
            <Path
              d="M2 10 L28 10 M22 4 L29 10 L22 16"
              stroke={colors.warn}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <View style={[stile.gefahrZiel, r.jung && stile.gefahrKitz]}>
            {r.jung ? <JungFigur tier={tier} /> : <TierFigur tier={tier} />}
          </View>
        </View>
      ))}
    </TierTafel>
  );
}

function Gefahr({ gefahr, sammlung }: { gefahr: TierSeite['gefahren'][number]; sammlung: Record<string, unknown> }) {
  const e = gefahr.artId ? katalogEintrag(gefahr.artId) : undefined;
  const inhalt = (
    <>
      <View style={stile.gefahrKreis}>
        {e ? (
          <ArtTaler
            id={e.id}
            seltenheit={e.seltenheit}
            zustand={
              gefahr.artId! in sammlung ? 'gefunden' : istVerborgen(gefahr.artId!, sammlung) ? 'verborgen' : 'umriss'
            }
            groesse={58}
            modell={e.modell}
            baumModell={e.baumModell}
          />
        ) : (
          <TierSymbol name={gefahr.icon ?? 'wolf'} groesse={32} farbe={colors.fog} />
        )}
      </View>
      <Schrift style={stile.gefahrText}>{gefahr.kurz}</Schrift>
    </>
  );
  if (!e)
    return (
      <View style={stile.gefahr} accessible accessibilityLabel={gefahr.kurz}>
        {inhalt}
      </View>
    );
  return (
    <Pressable
      style={stile.gefahr}
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: gefahr.artId! } })}
      accessibilityRole="button"
      accessibilityLabel={gefahr.kurz}
    >
      {inhalt}
    </Pressable>
  );
}

/** Jungtier so, wie es zuerst draußen zu sehen ist: mit Flecken, Streifen bzw. dunklem Fell */
function JungFigur({ tier, pose }: { tier: TierSeite; pose?: 'steht' | 'liegt' }) {
  const j = tier.jung;
  return (
    <TierFigur
      tier={tier}
      pose={pose}
      flecken={!!j.flecken?.length}
      streifen={!!j.streifen?.length}
      dunkel={!!j.dunkel?.length}
    />
  );
}

// ---------- Sicherheits-Hinweis (Kitz nicht anfassen, Fuchs nicht füttern …) ----------

export function Hinweis({ tier, text }: { tier: TierSeite; text?: string }) {
  if (tier.fotos?.hinweis) return <FotoHinweis tier={tier} foto={tier.fotos.hinweis} text={text} />;
  if (tier.hinweis.bild === 'abstand') return <AbstandHinweis tier={tier} text={text} />;
  return (
    <TierTafel symbol="stopp" titel={tier.hinweis.titel}>
      <View style={stile.kitzBild}>
        <Svg width="100%" height="100%" viewBox="0 0 300 120" style={StyleSheet.absoluteFill}>
          {Array.from({ length: 60 }, (_, i) => {
            const x = 4 + i * 5;
            const h = 22 + ((i * 37) % 23);
            return (
              <Line
                key={i}
                x1={x}
                y1={118}
                x2={x + ((i % 5) - 2) * 2}
                y2={118 - h}
                stroke={colors.moss}
                strokeWidth={1.4}
              />
            );
          })}
        </Svg>
        <View style={stile.kitzFigur}>
          <JungFigur tier={tier} pose="liegt" />
        </View>
        {/* ein paar Halme vor dem Kitz: es liegt gut versteckt */}
        <Svg width="100%" height="100%" viewBox="0 0 300 120" style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 22 }, (_, i) => {
            const x = 60 + i * 6.5;
            return (
              <Line
                key={i}
                x1={x}
                y1={120}
                x2={x + ((i % 3) - 1) * 3}
                y2={96 - ((i * 13) % 14)}
                stroke={colors.moss}
                strokeWidth={1.6}
              />
            );
          })}
        </Svg>
        <View style={stile.kitzStopp}>
          <TierSymbol name="stopp" groesse={64} farbe={colors.warn} dicke={1.8} />
        </View>
      </View>
      {text ? <Schrift style={stile.kitzText}>{text}</Schrift> : null}
    </TierTafel>
  );
}

/** Hinweis mit echtem Foto (Kitz im Gras, Fuchs) und Stopp-Hand */
function FotoHinweis({ tier, foto, text }: { tier: TierSeite; foto: FotoId; text?: string }) {
  return (
    <TierTafel symbol="stopp" titel={tier.hinweis.titel}>
      <View style={stile.hinweisFoto}>
        <TierFoto id={foto} style={StyleSheet.absoluteFill} nachweis />
        <View style={stile.hinweisStopp}>
          <TierSymbol name="stopp" groesse={56} farbe={colors.warn} dicke={2} />
        </View>
      </View>
      {text ? <Schrift style={stile.kitzText}>{text}</Schrift> : null}
    </TierTafel>
  );
}

/** Tier auf Abstand: es steht am Rand, dazwischen eine Linie, davor die Stopp-Hand */
function AbstandHinweis({ tier, text }: { tier: TierSeite; text?: string }) {
  return (
    <TierTafel symbol="stopp" titel={tier.hinweis.titel}>
      <View style={stile.kitzBild}>
        <Svg width="100%" height="100%" viewBox="0 0 300 120" style={StyleSheet.absoluteFill}>
          <Line x1={0} y1={112} x2={300} y2={112} stroke={colors.moss} strokeWidth={1.5} />
          {/* Abstand halten: gestrichelte Linie mit Pfeilen */}
          <Path d="M96 100 L196 100" stroke={colors.amber} strokeWidth={1.4} strokeDasharray="5 4" />
          <Path
            d="M102 95 L96 100 L102 105 M190 95 L196 100 L190 105"
            stroke={colors.amber}
            strokeWidth={1.4}
            fill="none"
          />
        </Svg>
        <View style={stile.fuchsFigur}>
          <TierFigur tier={tier} />
        </View>
        <View style={stile.fuchsStopp}>
          <TierSymbol name="stopp" groesse={64} farbe={colors.warn} dicke={1.8} />
        </View>
      </View>
      {text ? <Schrift style={stile.kitzText}>{text}</Schrift> : null}
    </TierTafel>
  );
}

const stile = StyleSheet.create({
  landschaft: { width: '100%', aspectRatio: 300 / 170, borderRadius: radius.m, overflow: 'hidden' },
  zoneLicht: { position: 'absolute', top: 0, bottom: 0, backgroundColor: colors.amber, opacity: 0.08 },
  zone: { position: 'absolute', top: 0, bottom: 0 },
  reh: { position: 'absolute', top: '40%', width: '23%', height: '52%' },
  tierOben: { top: '6%', width: '16%', height: '30%', marginLeft: '2%' },
  reihe: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, justifyContent: 'center' },
  monate: { flexDirection: 'row', justifyContent: 'space-between' },
  monat: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.moss,
  },
  monatAn: { backgroundColor: colors.amber, borderColor: colors.amber },
  monatText: { fontFamily: fonts.etikett, fontSize: 11, color: colors.fog },
  teller: { flexDirection: 'row', justifyContent: 'space-between' },
  tellerEintrag: { alignItems: 'center', gap: 4, width: '19%' },
  tellerKreis: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  tellerText: { fontFamily: fonts.notiz, fontSize: 13, lineHeight: 16, color: colors.moon, textAlign: 'center' },
  balken: { flexDirection: 'row', gap: 1, marginTop: 2 },
  strich: { width: 3, height: 5, borderRadius: 1, backgroundColor: colors.moss },
  strichJetzt: { height: 8, marginTop: -1.5, borderWidth: 0.5, borderColor: colors.moon },
  faehrte: { width: '100%', aspectRatio: 5, borderRadius: radius.m, backgroundColor: colors.night, overflow: 'hidden' },
  karten: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  karte: {
    overflow: 'hidden',
    width: '48.5%',
    aspectRatio: 1.15,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: spacing.s,
  },
  spurGross: { width: '100%', height: '80%' },
  spurFoto: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  spurFotoKlein: { width: '100%', height: '55%', borderRadius: radius.s },
  hinweisFoto: { width: '100%', aspectRatio: 1.5, borderRadius: radius.m, overflow: 'hidden' },
  hinweisStopp: {
    position: 'absolute',
    right: spacing.s,
    top: spacing.s,
    padding: 6,
    borderRadius: 40,
    backgroundColor: `${colors.night}CC`,
  },
  spurKlein: { width: '70%', height: '50%' },
  karteText: { fontFamily: fonts.notiz, fontSize: 17, lineHeight: 21, color: colors.amber, textAlign: 'center' },
  karteZahl: { fontFamily: fonts.etikett, fontSize: 13, color: colors.moon },
  echtKnopf: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  echtText: { fontFamily: fonts.etikett, fontSize: 14, color: colors.amber },
  echt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.l,
    padding: spacing.m,
    borderRadius: radius.m,
    backgroundColor: colors.night,
  },
  gefahrReihe: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  gefahrQuellen: { flex: 1, flexDirection: 'row', gap: spacing.s },
  gefahr: { alignItems: 'center', gap: 4, width: 64 },
  gefahrKreis: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.warn,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  gefahrText: { fontFamily: fonts.notiz, fontSize: 14, lineHeight: 17, color: colors.moon, textAlign: 'center' },
  gefahrZiel: { width: 96, height: 86 },
  gefahrKitz: { width: 66, height: 60, marginHorizontal: 15 },
  kitzBild: { width: '100%', aspectRatio: 300 / 120 },
  kitzFigur: { position: 'absolute', left: '18%', top: '8%', width: '48%', height: '100%' },
  kitzStopp: { position: 'absolute', right: '6%', top: '14%' },
  fuchsFigur: { position: 'absolute', right: '2%', top: '-14%', width: '42%', height: '110%' },
  fuchsStopp: { position: 'absolute', left: '6%', top: '14%' },
  kitzText: { fontFamily: fonts.notiz, fontSize: 19, lineHeight: 25, color: colors.amber, textAlign: 'center' },
});
