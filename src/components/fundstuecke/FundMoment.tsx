import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { FUNDSTUECK_SYMBOL } from '@/components/fundstuecke/FundstueckAlbum';
import { ArtTaler } from '@/components/taler/ArtTaler';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { artById } from '@/data/arten';
import type { Fundstueck } from '@/data/fundstueckTypen';
import { colors, fonts } from '@/theme/theme';

/**
 * Der Moment nach „Das ist es“ (Entwurf, das endgültige Design kommt später):
 * - Sichtung: Das Icon der Art wechselt von grau zu farbig, ein Leuchtkreis zieht sich darum.
 * - Fundstück: Die Art bleibt grau in der Mitte. Um sie herum liegt ein Kreis aus Kuchenstücken, eins je Fundstück.
 *   Das gefundene Stück leuchtet mit seinem Symbol auf, dann erscheint „2 von 6“.
 */
const PLATZ = 280;
const M = PLATZ / 2;
const TALER = 132;
const R_AUSSEN = 134;
const R_INNEN = 98;
const R_RING = 116;
const UMFANG = 2 * Math.PI * R_RING;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props =
  | { art: 'sichtung'; artId: string }
  | { art: 'fundstueck'; artId: string; alle: readonly Fundstueck[]; neu: string; gefunden: ReadonlySet<string> };

export function FundMoment(props: Props) {
  const ruhig = useReducedMotion();
  const dauer = ruhig ? 0 : 1;
  const a = artById[props.artId];
  const farbe = useSharedValue(0); // 0 = grau, 1 = farbig
  const ring = useSharedValue(0); // 0 = kein Kreis, 1 = geschlossen
  const stueck = useSharedValue(0);

  useEffect(() => {
    farbe.value = withDelay(300 * dauer, withTiming(1, { duration: 900 * dauer }));
    ring.value = withDelay(200 * dauer, withTiming(1, { duration: 1300 * dauer, easing: Easing.out(Easing.cubic) }));
    stueck.value = withDelay(500 * dauer, withTiming(1, { duration: 700 * dauer, easing: Easing.out(Easing.back(2)) }));
  }, [farbe, ring, stueck, dauer]);

  const farbig = useAnimatedStyle(() => ({ opacity: farbe.value }));
  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: UMFANG * (1 - ring.value) }));
  const stueckProps = useAnimatedProps(() => ({ opacity: stueck.value }));
  const stueckStil = useAnimatedStyle(() => ({
    opacity: stueck.value,
    transform: [{ scale: 0.6 + 0.4 * stueck.value }],
  }));

  if (!a) return null;
  const taler = (zustand: 'gefunden' | 'umriss') => (
    <ArtTaler
      id={a.id}
      seltenheit={a.seltenheit}
      zustand={zustand}
      groesse={TALER}
      modell={a.modell}
    />
  );

  if (props.art === 'sichtung') {
    return (
      <View style={stile.platz} accessibilityLabel={`${a.name} gesammelt`}>
        <Svg width={PLATZ} height={PLATZ} style={StyleSheet.absoluteFill}>
          <AnimatedCircle
            cx={M}
            cy={M}
            r={R_RING}
            stroke={colors.amber}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${UMFANG} ${UMFANG}`}
            animatedProps={ringProps}
            transform={`rotate(-90 ${M} ${M})`}
          />
        </Svg>
        <View style={stile.mitte}>{taler('umriss')}</View>
        <Animated.View style={[stile.mitte, farbig]}>{taler('gefunden')}</Animated.View>
      </View>
    );
  }

  const { alle, neu, gefunden } = props;
  const n = Math.max(alle.length, 1);
  const winkel = 360 / n;
  const zahl = alle.filter((f) => gefunden.has(f.id)).length;
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={stile.platz} accessibilityLabel={`${a.name}: Fundstück ${zahl} von ${n}`}>
        <Svg width={PLATZ} height={PLATZ} style={StyleSheet.absoluteFill}>
          {alle.map((f, i) => {
            const d = stueckPfad(i * winkel, (i + 1) * winkel);
            if (f.id === neu)
              return (
                <AnimatedPath
                  key={f.id}
                  d={d}
                  fill={colors.amber}
                  fillOpacity={0.35}
                  stroke={colors.amber}
                  strokeWidth={2}
                  animatedProps={stueckProps}
                />
              );
            const da = gefunden.has(f.id);
            return (
              <Path
                key={f.id}
                d={d}
                fill={da ? colors.moss : colors.forest}
                fillOpacity={da ? 0.55 : 0.5}
                stroke={colors.night}
                strokeWidth={2}
              />
            );
          })}
        </Svg>
        {alle.map((f, i) => {
          const mitteWinkel = ((i + 0.5) * winkel - 90) * (Math.PI / 180);
          const r = (R_AUSSEN + R_INNEN) / 2;
          const pos = { left: M + r * Math.cos(mitteWinkel) - 12, top: M + r * Math.sin(mitteWinkel) - 12 };
          const istNeu = f.id === neu;
          const symbol = (
            <TierSymbol
              name={FUNDSTUECK_SYMBOL[f.typ]}
              groesse={24}
              farbe={istNeu ? colors.night : gefunden.has(f.id) ? colors.moon : colors.fog}
              dicke={1.4}
            />
          );
          return istNeu ? (
            <Animated.View key={f.id} style={[stile.symbol, pos, stueckStil]}>
              {symbol}
            </Animated.View>
          ) : (
            <View key={f.id} style={[stile.symbol, pos, { opacity: gefunden.has(f.id) ? 0.9 : 0.35 }]}>
              {symbol}
            </View>
          );
        })}
        <View style={stile.mitte}>{taler('umriss')}</View>
      </View>
      <Animated.View entering={ruhig ? undefined : FadeIn.delay(1100).duration(500)}>
        <Schrift style={stile.zahl}>
          {zahl} von {n}
        </Schrift>
      </Animated.View>
    </View>
  );
}

/** Ein Kuchenstück des Rings von Winkel a bis b (Grad, 0 = oben, im Uhrzeigersinn), mit kleiner Lücke */
function stueckPfad(a: number, b: number): string {
  const luecke = 1.5;
  const p = (r: number, w: number) => {
    const rad = ((w - 90) * Math.PI) / 180;
    return `${(M + r * Math.cos(rad)).toFixed(2)} ${(M + r * Math.sin(rad)).toFixed(2)}`;
  };
  const s = a + luecke;
  const e = b - luecke;
  const gross = e - s > 180 ? 1 : 0;
  return [
    `M ${p(R_AUSSEN, s)}`,
    `A ${R_AUSSEN} ${R_AUSSEN} 0 ${gross} 1 ${p(R_AUSSEN, e)}`,
    `L ${p(R_INNEN, e)}`,
    `A ${R_INNEN} ${R_INNEN} 0 ${gross} 0 ${p(R_INNEN, s)}`,
    'Z',
  ].join(' ');
}

const stile = StyleSheet.create({
  platz: { width: PLATZ, height: PLATZ, alignItems: 'center', justifyContent: 'center' },
  mitte: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  symbol: { position: 'absolute', width: 24, height: 24 },
  zahl: {
    fontFamily: fonts.etikett,
    fontSize: 26,
    color: colors.amber,
    textShadowColor: colors.amber,
    textShadowRadius: 10,
  },
});
