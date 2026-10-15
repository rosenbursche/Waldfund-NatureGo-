import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import type { GeweihZustand, TierSeite } from '@/data/tierSeiten';
import { farbMix } from '@/logic/tierJahr';
import { colors } from '@/theme/theme';

/**
 * Reh als Zeichnung aus Code (Seitenansicht, schaut nach rechts).
 * Zeichenraster: x 0–200, y −24–156, Boden bei y = 150.
 *
 * - pose: steht, äst (Kopf gesenkt) oder liegt (in der Mulde, Beine untergeschlagen)
 * - fell: 0 = graubraunes Winterfell, 1 = rotbraunes Sommerfell
 * - geweih: nur beim Bock – blank (gefegt), im Bast (mit Haut überzogen) oder keins (abgeworfen)
 * - flecken: Kitz mit weißen Tupfen
 * - umriss: nur die Silhouette in einer Farbe (noch nicht gesammelt)
 */
export type RehPose = 'steht' | 'aest' | 'liegt';

type Props = {
  farben: TierSeite['farben'];
  pose?: RehPose;
  fell?: number;
  geweih?: GeweihZustand;
  flecken?: boolean;
  umriss?: string;
  /** Lichtkante am Rücken (Mondlicht) */
  licht?: boolean;
};

export const REH_VIEWBOX = '0 -24 200 180';

// ---------- Formen (fest, von Hand gezeichnet) ----------
const KOERPER =
  'M52 64 C70 56 104 57 124 60 C134 62 139 72 137 82 C135 90 130 95 124 97 C108 101 84 101 70 97 C62 96 56 96 52 92 C45 86 44 72 52 64 Z';
const BAUCH = 'M70 97 C84 101 108 101 124 97 C111 94 86 93 70 92 Z';
const HALS_KOPF =
  'M118 66 C127 57 134 43 141 31 C144 24 150 21 156 23 C163 27 171 33 176 39 C179 43 176 47 169 46 C161 45 154 45 150 48 C145 57 142 70 138 84 L122 84 Z';
/** sichtbare Umrisslinie von Hals und Kopf (ohne die Kante, die im Körper verschwindet) */
const HALS_UMRISS =
  'M118 66 C127 57 134 43 141 31 C144 24 150 21 156 23 C163 27 171 33 176 39 C179 43 176 47 169 46 C161 45 154 45 150 48 C145 57 142 70 138 84';
const OHR_HINTEN = 'M151 25 C152 15 156 7 162 4 C163 11 160 19 155 27 Z';
const OHR_VORN = 'M146 27 C140 16 139 8 142 3 C148 7 151 16 151 25 Z';
const OHR_INNEN = 'M145 22 C142 15 142 10 143 7 C147 11 148 16 148 22 Z';
const RUECKEN_LICHT = 'M53 64 C70 56 104 57 124 60';
const HALS_LICHT = 'M127 56 C133 46 138 37 142 30 C145 24 150 21 156 23';

// Beine: vorn nah/fern, hinten nah/fern (Hinterlauf mit nach hinten zeigendem Sprunggelenk)
const VORDERLAUF = 'M121 90 C123 110 123 128 122 146 L126.5 146 C127.5 128 128.5 110 130 90 Z';
const HINTERLAUF = 'M54 76 C66 76 74 88 72 100 C70 108 64 114 61 120 L63 146 L58.5 146 L56 121 C54 114 52 104 50 92 Z';
const HUF = 'M-2.5 0 L2.5 0 L3 4 L-3 4 Z';

// Spiegel (weißer Fleck am Hinterteil)
const SPIEGEL = 'M50 67 C45 75 45 86 52 92 C57 86 58 75 55 67 Z';

// Feine Details: Fellstriche, Muskelschatten, Gesicht
/** kurze Haarstriche entlang Rücken und Flanke (Richtung: nach hinten unten) */
const FELLSTRICHE: string[] = [];
for (let i = 0; i < 26; i++) {
  const x = 58 + (i % 13) * 5.6 + (i > 12 ? 2.5 : 0);
  const y = (i > 12 ? 74 : 66) + Math.sin(i * 1.7) * 2;
  FELLSTRICHE.push(`M${x} ${y} q-2 2.5 -3.5 4.5`);
}
for (let i = 0; i < 9; i++) {
  const x = 66 + i * 7;
  FELLSTRICHE.push(`M${x} ${86 + Math.sin(i) * 1.5} q-1.5 2 -2.5 3.5`);
}
const SCHULTER = 'M112 66 C122 64 130 70 132 80 C128 88 120 90 114 86 C110 80 109 72 112 66 Z';
const KEULE = 'M50 70 C58 64 70 68 72 80 C72 90 66 98 58 98 C52 94 48 84 50 70 Z';
const KEULE_LICHT = 'M58 70 C64 70 69 75 70 82';
const OHR_RAND_VORN = 'M146 27 C140 16 139 8 142 3 C148 7 151 16 151 25';
const OHR_RAND_HINTEN = 'M151 25 C152 15 156 7 162 4 C163 11 160 19 155 27';
const OHR_HAARE = 'M144 20 l2 -1 M143.5 16 l2 -1 M143.5 12 l1.8 -0.8';
const AUGENLID = 'M154 29.6 C155.6 28.2 158.4 28.2 160 29.8';
const TRAENENGRUBE = 'M161 33 C163 34 164.5 35.5 165 37';
const MUFFEL = 'M171 37 C174 37.5 177 39.5 178 42 C176 44.5 173 44.5 171 43.5 C170 41.5 170 39 171 37 Z';
const MAUL = 'M171.5 45.6 C168 46.4 165 46.2 162.5 45.4';
const KEHLFLECK_OBEN = 'M141 53 C144 52 147 54 146 57 C143 58 140 56 141 53 Z';
const KEHLFLECK_UNTEN = 'M134 66 C138 64 142 67 140 71 C136 72 133 70 134 66 Z';
/** Afterklauen: kleine Zehen hinten über dem Huf */
const AFTERKLAUE = 'M0 0 C-1.6 0.4 -2.2 2 -1.4 3.2 C-0.4 3 0.4 1.6 0 0 Z';

// Flecken des Kitzes (Reihen entlang des Rückens)
const FLECKEN: [number, number][] = [
  [66, 66],
  [78, 64],
  [90, 63],
  [102, 63],
  [114, 64],
  [72, 74],
  [84, 72],
  [96, 72],
  [108, 72],
  [120, 72],
  [78, 82],
  [92, 81],
  [106, 81],
  [64, 78],
];

/** Geweih: Stange mit Vorder- und Hintersprosse (Sechser), Basis über der Stirn */
function geweihPfade(g: GeweihZustand, dx: number, dy: number) {
  const h = 26 * g.groesse;
  const x0 = 151 + dx;
  const y0 = 22 + dy;
  const stange = `M${x0} ${y0} C${x0 - 1} ${y0 - h * 0.4} ${x0 - 2} ${y0 - h * 0.75} ${x0} ${y0 - h}`;
  if (g.groesse < 0.4) return [stange];
  const vorne = `M${x0 - 1} ${y0 - h * 0.55} C${x0 + 3} ${y0 - h * 0.62} ${x0 + 6} ${y0 - h * 0.72} ${x0 + 7} ${y0 - h * 0.85}`;
  const hinten = `M${x0 - 1.5} ${y0 - h * 0.8} C${x0 - 4} ${y0 - h * 0.85} ${x0 - 6} ${y0 - h * 0.92} ${x0 - 7} ${y0 - h * 1.02}`;
  return [stange, vorne, hinten];
}

export function RehFigur({ farben, pose = 'steht', fell = 1, geweih, flecken, umriss, licht = true }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fellFarbe = farbMix(farben.winter, farben.sommer, fell);
  const dunkel = umriss ?? farben.dunkel;
  const hell = umriss ?? farben.hell;
  const spiegel = umriss ?? farben.spiegel;
  const verlauf = umriss ? umriss : `url(#fell${id})`;
  const liegt = pose === 'liegt';
  const tief = liegt ? 46 : 0; // liegend: Körper sinkt auf den Boden
  const kopfDrehung = pose === 'aest' ? 96 : 0;
  // Spiegel im Winter größer und reinweiß, im Sommer kleiner und gelblich
  const spiegelGroesse = 1.15 - fell * 0.3;
  const spiegelFarbe = umriss ?? farbMix(spiegel, farben.hell, fell);
  const ferne = umriss ?? farbMix(fellFarbe, farben.dunkel, 0.35);

  return (
    <Svg width="100%" height="100%" viewBox={REH_VIEWBOX}>
      <Defs>
        <LinearGradient id={`fell${id}`} x1="0" y1="20" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={farbMix(fellFarbe, farben.dunkel, 0.25)} />
          <Stop offset="0.55" stopColor={fellFarbe} />
          <Stop offset="1" stopColor={farbMix(fellFarbe, farben.hell, 0.35)} />
        </LinearGradient>
      </Defs>

      {/* Schatten am Boden */}
      {!umriss && <Ellipse cx={96} cy={150} rx={liegt ? 58 : 52} ry={4} fill={colors.night} opacity={0.5} />}

      {/* ferne Beine (dunkler, leicht versetzt) */}
      {!liegt && (
        <G>
          <Path d={VORDERLAUF} fill={ferne} transform="translate(-7 1)" />
          <Path d={HINTERLAUF} fill={ferne} transform="translate(8 1)" />
          <Path d={HUF} fill={dunkel} transform="translate(117.5 146)" />
          <Path d={HUF} fill={dunkel} transform="translate(68.8 146)" />
        </G>
      )}

      <G transform={`translate(0 ${tief})`}>
        {/* liegend: untergeschlagene Beine */}
        {liegt && (
          <G>
            <Ellipse cx={128} cy={99} rx={13} ry={5} fill={ferne} />
            <Ellipse cx={64} cy={97} rx={16} ry={6} fill={ferne} />
          </G>
        )}
        {/* Körper */}
        <Path d={KOERPER} fill={verlauf} stroke={dunkel} strokeWidth={0.8} strokeOpacity={0.5} />
        {!umriss && <Path d={BAUCH} fill={hell} opacity={0.3} />}
        {!umriss && (
          <G>
            {/* Muskelschatten an Schulter und Keule, darüber feine Fellstriche */}
            <Path d={SCHULTER} fill={farben.dunkel} opacity={0.13} />
            <Path d={KEULE} fill={farben.dunkel} opacity={0.12} />
            <Path d={KEULE_LICHT} stroke={hell} strokeWidth={1} opacity={0.18} fill="none" strokeLinecap="round" />
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
        {flecken &&
          !umriss &&
          FLECKEN.map(([x, y]) => (
            <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.2} ry={1.5} fill={hell} opacity={0.9} />
          ))}
        <Path
          d={SPIEGEL}
          fill={spiegelFarbe}
          transform={`translate(52 79) scale(${spiegelGroesse}) translate(-52 -79)`}
        />
        {licht && !umriss && (
          <Path d={RUECKEN_LICHT} stroke={colors.moon} strokeWidth={1.2} strokeOpacity={0.45} fill="none" />
        )}

        {/* nahe Beine */}
        {!liegt && (
          <G transform={`translate(0 ${-tief})`}>
            <Path d={VORDERLAUF} fill={verlauf} />
            <Path d={HINTERLAUF} fill={verlauf} />
            <Path d={HUF} fill={dunkel} transform="translate(124.3 146)" />
            <Path d={HUF} fill={dunkel} transform="translate(60.8 146)" />
            {!umriss && (
              <G>
                <Path d={AFTERKLAUE} fill={dunkel} transform="translate(122.4 139)" />
                <Path d={AFTERKLAUE} fill={dunkel} transform="translate(58.6 139)" />
                {/* Fesselgelenke etwas dunkler */}
                <Ellipse cx={124.3} cy={141} rx={2.4} ry={1.2} fill={farben.dunkel} opacity={0.25} />
                <Ellipse cx={60.8} cy={141} rx={2.4} ry={1.2} fill={farben.dunkel} opacity={0.25} />
              </G>
            )}
          </G>
        )}

        {/* Hals und Kopf – drehen sich beim Äsen um den Halsansatz */}
        <G transform={`rotate(${kopfDrehung} 126 70)`}>
          <Path d={OHR_HINTEN} fill={ferne} />
          <Path d={HALS_KOPF} fill={verlauf} />
          <Path d={HALS_UMRISS} stroke={dunkel} strokeWidth={0.8} strokeOpacity={0.5} fill="none" />
          <Path d={OHR_VORN} fill={verlauf} stroke={dunkel} strokeWidth={0.7} strokeOpacity={0.5} />
          {!umriss && (
            <G>
              <Path d={OHR_INNEN} fill={hell} opacity={0.35} />
              <Path d={OHR_HAARE} stroke={hell} strokeWidth={0.5} opacity={0.6} />
              <Path d={OHR_RAND_VORN} stroke={farben.dunkel} strokeWidth={1.1} fill="none" opacity={0.7} />
              <Path d={OHR_RAND_HINTEN} stroke={farben.dunkel} strokeWidth={1} fill="none" opacity={0.6} />
              {/* im Winterfell zwei helle Flecken an der Kehle */}
              {fell < 0.5 && (
                <G>
                  <Path d={KEHLFLECK_OBEN} fill={hell} opacity={0.85} />
                  <Path d={KEHLFLECK_UNTEN} fill={hell} opacity={0.8} />
                </G>
              )}
            </G>
          )}
          {licht && !umriss && (
            <Path d={HALS_LICHT} stroke={colors.moon} strokeWidth={1.1} strokeOpacity={0.4} fill="none" />
          )}
          {!umriss && (
            <G>
              {/* weißes Kinn, schwarze Nase, Auge mit Lichtpunkt */}
              <Ellipse cx={166} cy={46} rx={5} ry={2.4} fill={hell} />
              <Ellipse cx={175.4} cy={41.6} rx={2.7} ry={2.3} fill={dunkel} />
              <Circle cx={157} cy={31} r={2.4} fill={dunkel} />
              <Circle cx={157.8} cy={30.2} r={0.8} fill={colors.moon} />
              <Path d={AUGENLID} stroke={farben.dunkel} strokeWidth={0.8} fill="none" />
              <Path d={TRAENENGRUBE} stroke={farben.dunkel} strokeWidth={0.7} fill="none" opacity={0.5} />
              <Path d={MUFFEL} fill={farben.dunkel} opacity={0.85} />
              <Ellipse cx={175.6} cy={41.4} rx={0.9} ry={0.6} fill={colors.moon} opacity={0.35} />
              <Path d={MAUL} stroke={farben.dunkel} strokeWidth={0.7} fill="none" opacity={0.7} />
            </G>
          )}
          {geweih && geweih.art !== 'keins' && (
            <G>
              {[
                { dx: 4, dy: 1, farbe: ferne },
                { dx: 0, dy: 0, farbe: geweih.art === 'bast' ? verlauf : (umriss ?? farben.geweih) },
              ].map((s) =>
                geweihPfade(geweih, s.dx, s.dy).map((d, i) => (
                  <Path
                    key={`${s.dx}-${i}`}
                    d={d}
                    stroke={s.farbe}
                    strokeWidth={geweih.art === 'bast' ? 4 : 2.9}
                    strokeLinecap="round"
                    fill="none"
                  />
                )),
              )}
              {/* Rosen: der raue Ring am Ansatz */}
              {!umriss && <Ellipse cx={151} cy={22} rx={2.6} ry={1.4} fill={farben.geweih} opacity={0.9} />}
            </G>
          )}
        </G>
      </G>
    </Svg>
  );
}
