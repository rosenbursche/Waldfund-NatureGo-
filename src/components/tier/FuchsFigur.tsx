import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import type { TierSeite } from '@/data/tierSeiten';
import { farbMix } from '@/logic/tierJahr';
import { colors } from '@/theme/theme';

/**
 * Rotfuchs als Zeichnung aus Code (Seitenansicht, schaut nach rechts).
 * Gleiches Zeichenraster wie das Reh: x 0–200, y −24–156, Boden bei y = 150.
 *
 * - pose: steht, aktiv (Mäusesprung: im Bogen, Schnauze voran nach unten) oder liegt (eingerollt,
 *   die Lunte über der Nase)
 * - fell: 0 = dichtes Winterfell (buschigere Lunte), 1 = Sommerfell
 * - dunkel: Welpe mit noch dunklem, graubraunem Fell
 * - umriss: nur die Silhouette (noch nicht gesammelt)
 */
export type FuchsPose = 'steht' | 'aktiv' | 'liegt';

type Props = {
  farben: TierSeite['farben'];
  pose?: FuchsPose;
  fell?: number;
  dunkel?: boolean;
  umriss?: string;
  licht?: boolean;
};

/** Schulterhöhe in der Zeichnung (für den Größenvergleich) */
export const FUCHS_SCHULTER_Y = 88;
/** Bildausschnitt: der Fuchs ist niedriger als das Reh, oben bleibt sonst viel Luft */
export const FUCHS_AUSSCHNITT = { y0: 30, hoehe: 126 };
const VIEWBOX = `0 ${FUCHS_AUSSCHNITT.y0} 200 ${FUCHS_AUSSCHNITT.hoehe}`;

// ---------- Formen (fest, von Hand gezeichnet) ----------
const KOERPER =
  'M64 90 C80 84 112 84 132 86 C140 88 144 96 142 104 C140 110 134 113 126 114 C108 116 86 116 74 113 C66 112 60 108 58 100 C57 95 59 92 64 90 Z';
const BAUCH = 'M76 113 C90 116 110 116 126 114 C112 111 92 110 76 109 Z';
const KOPF =
  'M126 94 C132 88 139 81 146 74 C150 70 156 68 162 69 C170 71 178 76 186 82 C188 84 186 87 182 87 C174 88 166 88 160 90 C152 94 146 102 142 110 L126 108 Z';
const KOPF_UMRISS =
  'M126 94 C132 88 139 81 146 74 C150 70 156 68 162 69 C170 71 178 76 186 82 C188 84 186 87 182 87 C174 88 166 88 160 90 C152 94 146 102 142 110';
/** weiße Wange, Kehle und Brust */
const KEHLE = 'M160 89 C168 88 176 88 182 87 C178 92 168 95 158 97 C151 99 146 105 142 112 C139 104 146 94 160 89 Z';
const OHR_HINTEN = 'M156 70 L161 49 L168 69 Z';
const OHR_VORN = 'M147 73 L148 50 L158 70 Z';
const OHR_INNEN = 'M149.5 70 L150 56 L155.5 69 Z';
const RUECKEN_LICHT = 'M66 90 C82 85 112 85 132 86';
const STIRN_LICHT = 'M140 80 C146 74 152 70 160 69';

// Läufe: vorn nah/fern, hinten nah/fern; untere Hälfte dunkel („Strümpfe“)
const VORDERLAUF = 'M124 108 C125 122 125 136 124 146 L129 146 C130 136 130 122 131 108 Z';
const VORDER_STRUMPF = 'M124.7 126 C125 134 124.6 141 124 146 L129 146 C129.5 141 129.8 134 130 126 Z';
const HINTERLAUF =
  'M64 98 C76 98 82 106 80 116 C78 122 74 126 72 130 L74 146 L69.5 146 L67 130 C65 122 62 112 62 104 Z';
const HINTER_STRUMPF = 'M67.6 132 L69.5 146 L74 146 L72.4 132 Z';
const PFOTE = 'M-3 0 C-3 -2 3 -2 4 0 C4 2 -3 2 -3 0 Z';

// Lunte (buschiger Schwanz) mit weißer Spitze
const LUNTE = 'M64 94 C46 96 30 104 18 114 C11 120 6 126 8 131 C14 134 23 130 31 125 C43 118 55 111 66 106 Z';
const LUNTE_SPITZE = 'M8 131 C6 126 10 120 16 115 C17 121 15 127 13 131 C11 132 9 132 8 131 Z';
const LUNTE_HAARE = ['M54 100 q-6 4 -12 5', 'M44 104 q-6 4 -11 6', 'M34 110 q-5 4 -10 6', 'M26 116 q-4 3 -8 5'];

// Liegend: eingerollt, die Lunte liegt über der Schnauze
const LIEGT_KOERPER =
  'M58 140 C56 124 76 112 102 112 C128 112 146 120 148 134 C148 144 134 148 102 148 C76 148 60 146 58 140 Z';
const LIEGT_KOPF =
  'M126 124 C130 116 140 112 150 114 C158 116 165 122 168 129 C164 133 154 133 146 133 C138 133 130 131 126 124 Z';
const LIEGT_OHR = 'M139 117 L141 101 L149 115 Z';
const LIEGT_LUNTE =
  'M58 136 C70 128 100 130 128 134 C148 137 162 134 172 126 C170 138 156 148 130 150 C100 153 68 152 58 144 Z';
const LIEGT_SPITZE = 'M172 126 C171 133 167 139 160 143 C162 136 166 131 172 126 Z';
const LIEGT_LUNTE_HAARE = ['M80 138 q6 3 12 3', 'M100 139 q6 3 12 2', 'M120 140 q6 2 12 1', 'M140 139 q5 1 10 -1'];

/** Fellstriche entlang Rücken und Flanke */
const FELLSTRICHE: string[] = [];
for (let i = 0; i < 22; i++) {
  const x = 70 + (i % 11) * 6 + (i > 10 ? 3 : 0);
  const y = (i > 10 ? 98 : 91) + Math.sin(i * 1.3) * 1.5;
  FELLSTRICHE.push(`M${x} ${y} q-2.5 2 -4 3.5`);
}

export function FuchsFigur({ farben, pose = 'steht', fell = 1, dunkel, umriss, licht = true }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const grund = dunkel && farben.jung ? farben.jung : farbMix(farben.winter, farben.sommer, fell);
  const schwarz = umriss ?? farben.dunkel;
  const weiss = umriss ?? (dunkel ? farbMix(farben.hell, grund, 0.5) : farben.hell);
  const verlauf = umriss ? umriss : `url(#fuchs${id})`;
  const ferne = umriss ?? farbMix(grund, farben.dunkel, 0.35);
  // Winterfell: buschigere Lunte
  const lunteDick = 1 + (1 - fell) * 0.18;

  const verlaufDef = (
    <Defs>
      <LinearGradient id={`fuchs${id}`} x1="0" y1="60" x2="0" y2="150" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor={farbMix(grund, farben.dunkel, 0.2)} />
        <Stop offset="0.5" stopColor={grund} />
        <Stop offset="1" stopColor={farbMix(grund, farben.hell, 0.3)} />
      </LinearGradient>
    </Defs>
  );

  if (pose === 'liegt') {
    return (
      <Svg width="100%" height="100%" viewBox={VIEWBOX}>
        {verlaufDef}
        {!umriss && <Ellipse cx={110} cy={151} rx={64} ry={4} fill={colors.night} opacity={0.5} />}
        <Path d={LIEGT_KOERPER} fill={verlauf} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.4} />
        <Path d={LIEGT_OHR} fill={schwarz} />
        <Path d={LIEGT_KOPF} fill={verlauf} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.4} />
        {!umriss && (
          <G>
            {/* geschlossenes Auge, Nase */}
            <Path d="M150 122 C152 123.5 155 123.5 157 122" stroke={schwarz} strokeWidth={1} fill="none" />
            <Ellipse cx={167} cy={128.5} rx={2} ry={1.6} fill={schwarz} />
          </G>
        )}
        {/* die Lunte liegt vorn über Körper und Schnauze */}
        <Path d={LIEGT_LUNTE} fill={verlauf} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.4} />
        <Path d={LIEGT_SPITZE} fill={weiss} />
        {!umriss &&
          LIEGT_LUNTE_HAARE.map((d) => (
            <Path key={d} d={d} stroke={farben.dunkel} strokeWidth={0.7} opacity={0.25} fill="none" />
          ))}
        {licht && !umriss && (
          <Path d="M64 126 C76 114 100 111 124 114" stroke={colors.moon} strokeWidth={1.2} opacity={0.4} fill="none" />
        )}
      </Svg>
    );
  }

  // Mäusesprung: der ganze Fuchs im Bogen, Schnauze voran nach unten
  const sprung = pose === 'aktiv' ? 'translate(4 -30) rotate(32 104 100)' : undefined;

  return (
    <Svg width="100%" height="100%" viewBox={VIEWBOX}>
      {verlaufDef}
      {!umriss && (
        <Ellipse
          cx={pose === 'aktiv' ? 130 : 100}
          cy={150}
          rx={pose === 'aktiv' ? 34 : 56}
          ry={pose === 'aktiv' ? 3 : 4}
          fill={colors.night}
          opacity={0.5}
        />
      )}
      <G transform={sprung}>
        {/* ferne Läufe */}
        <G>
          <Path d={VORDERLAUF} fill={ferne} transform="translate(-7 1)" />
          <Path d={VORDER_STRUMPF} fill={schwarz} transform="translate(-7 1)" opacity={0.9} />
          <Path d={HINTERLAUF} fill={ferne} transform="translate(8 1)" />
          <Path d={HINTER_STRUMPF} fill={schwarz} transform="translate(8 1)" opacity={0.9} />
        </G>
        {/* Lunte hinter dem Körper */}
        <G transform={`translate(64 100) scale(1 ${lunteDick}) translate(-64 -100)`}>
          <Path d={LUNTE} fill={verlauf} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.4} />
          <Path d={LUNTE_SPITZE} fill={weiss} />
          {!umriss &&
            LUNTE_HAARE.map((d) => (
              <Path key={d} d={d} stroke={farben.dunkel} strokeWidth={0.7} opacity={0.25} fill="none" />
            ))}
        </G>
        {/* Körper */}
        <Path d={KOERPER} fill={verlauf} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.45} />
        {!umriss && (
          <G>
            <Path d={BAUCH} fill={weiss} opacity={0.5} />
            {FELLSTRICHE.map((d, i) => (
              <Path
                key={i}
                d={d}
                stroke={farben.dunkel}
                strokeWidth={0.6}
                opacity={0.2}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </G>
        )}
        {licht && !umriss && (
          <Path d={RUECKEN_LICHT} stroke={colors.moon} strokeWidth={1.2} strokeOpacity={0.45} fill="none" />
        )}
        {/* nahe Läufe mit Strümpfen und Pfoten */}
        <Path d={VORDERLAUF} fill={verlauf} />
        <Path d={VORDER_STRUMPF} fill={schwarz} />
        <Path d={HINTERLAUF} fill={verlauf} />
        <Path d={HINTER_STRUMPF} fill={schwarz} />
        <Path d={PFOTE} fill={schwarz} transform="translate(127 146.5)" />
        <Path d={PFOTE} fill={schwarz} transform="translate(72 146.5)" />
        {/* Kopf */}
        <Path d={OHR_HINTEN} fill={schwarz} />
        <Path d={KOPF} fill={verlauf} />
        <Path d={KEHLE} fill={weiss} />
        <Path d={KOPF_UMRISS} stroke={schwarz} strokeWidth={0.8} strokeOpacity={0.5} fill="none" />
        <Path d={OHR_VORN} fill={schwarz} />
        {!umriss && (
          <G>
            <Path d={OHR_INNEN} fill={weiss} opacity={0.75} />
            {licht && <Path d={STIRN_LICHT} stroke={colors.moon} strokeWidth={1} strokeOpacity={0.4} fill="none" />}
            {/* Auge mit senkrechter Schlitzpupille, dunkle Tränenlinie, Nase, Maul */}
            <Ellipse cx={165} cy={76} rx={3} ry={1.9} fill={farben.auge} />
            <Ellipse cx={165.3} cy={76} rx={0.55} ry={1.7} fill={farben.dunkel} />
            <Path d="M162 75 C163.5 73.6 166.5 73.6 168 75" stroke={farben.dunkel} strokeWidth={0.8} fill="none" />
            <Path
              d="M167.5 77.5 C170 80 172 82 173 85"
              stroke={farben.dunkel}
              strokeWidth={0.9}
              opacity={0.6}
              fill="none"
            />
            <Circle cx={185.6} cy={83.6} r={2.4} fill={farben.dunkel} />
            <Path
              d="M183 87.5 C178 88.2 172 88.5 167 88.6"
              stroke={farben.dunkel}
              strokeWidth={0.7}
              opacity={0.6}
              fill="none"
            />
            {/* Schnurrhaare */}
            <Path
              d="M178 85 l10 -2 M178 86 l10 1.5 M177 84 l8 -4"
              stroke={colors.moon}
              strokeWidth={0.35}
              opacity={0.6}
            />
          </G>
        )}
      </G>
    </Svg>
  );
}
