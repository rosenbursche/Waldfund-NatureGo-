import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { ruck } from './helfer';

/**
 * Säugetiere: Der Bildschirm wird schwarz, zwei rote Augen öffnen sich und blinzeln,
 * dann taucht ein Maul mit Zähnen auf, kommt näher – und schnappt zu (der Bildschirm ruckelt).
 * Nur ganze Ebenen werden bewegt (Position, Größe, Deckkraft), keine animierten SVG-Formen.
 */
export const MAUL_ABLAUF = { hoehepunkt: 2600, ende: 3200 };
const SCHNAPP = 2450;

export function MaulSchnappt({ W, H }: { W: number; H: number }) {
  const dunkel = useSharedValue(0);
  const augen = useSharedValue(0);
  const augenWeg = useSharedValue(1);
  const maul = useSharedValue(0);
  const offen = H * 0.3;
  const oben = useSharedValue(-offen);
  const unten = useSharedValue(offen);
  const naeher = useSharedValue(0.75);
  const ruetteln = useSharedValue(0);

  useEffect(() => {
    dunkel.value = withTiming(1, { duration: 350 });
    // Augen öffnen sich, blinzeln einmal und verengen sich böse
    augen.value = withDelay(
      450,
      withSequence(
        withTiming(1, { duration: 260 }),
        withDelay(650, withTiming(0.08, { duration: 80 })),
        withTiming(1, { duration: 110 }),
        withDelay(250, withTiming(0.5, { duration: 220 })),
      ),
    );
    // das Maul taucht auf und kommt näher …
    maul.value = withDelay(1700, withTiming(1, { duration: 350 }));
    naeher.value = withDelay(
      1700,
      withSequence(
        withTiming(1.1, { duration: SCHNAPP - 1700, easing: Easing.in(Easing.quad) }),
        withTiming(1.55, { duration: 140, easing: Easing.in(Easing.cubic) }),
      ),
    );
    // … und schnappt zu
    oben.value = withDelay(SCHNAPP, withTiming(0, { duration: 130, easing: Easing.in(Easing.cubic) }));
    unten.value = withDelay(SCHNAPP, withTiming(0, { duration: 130, easing: Easing.in(Easing.cubic) }));
    // die Augen verschwinden, sobald das Maul aus der Dunkelheit auftaucht
    augenWeg.value = withDelay(1750, withTiming(0, { duration: 350 }));
    ruetteln.value = withDelay(
      SCHNAPP + 120,
      withSequence(...[16, -13, 10, -7, 4, 0].map((x) => withTiming(x, { duration: 45 }))),
    );
    const t = [setTimeout(() => ruck(false), 480), setTimeout(() => ruck(true), SCHNAPP + 120)];
    t.push(setTimeout(() => ruck(true), SCHNAPP + 260));
    return () => t.forEach(clearTimeout);
  }, [dunkel, augen, augenWeg, maul, naeher, oben, unten, ruetteln]);

  const dunkelStil = useAnimatedStyle(() => ({ opacity: dunkel.value }));
  const augeStil = useAnimatedStyle(() => ({ opacity: augenWeg.value, transform: [{ scaleY: augen.value }] }));
  const ganzStil = useAnimatedStyle(() => ({ transform: [{ translateX: ruetteln.value }] }));
  const maulStil = useAnimatedStyle(() => ({ opacity: maul.value, transform: [{ scale: naeher.value }] }));
  const obenStil = useAnimatedStyle(() => ({ transform: [{ translateY: oben.value }] }));
  const untenStil = useAnimatedStyle(() => ({ transform: [{ translateY: unten.value }, { rotate: '180deg' }] }));

  const kieferH = H * 0.5;
  const kiefer = useMemo(() => kieferForm(W * 1.3, kieferH), [W, kieferH]);
  const augeG = Math.min(W, H) * 0.2;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, ganzStil]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.abgrund }, dunkelStil]} />

      {/* Augen */}
      {[-1, 1].map((s) => (
        <Animated.View
          key={s}
          style={[
            stile.auge,
            { left: W / 2 + s * W * 0.17 - augeG / 2, top: H * 0.24 - augeG / 2, width: augeG, height: augeG },
            augeStil,
          ]}
        >
          <Auge g={augeG} gespiegelt={s > 0} />
        </Animated.View>
      ))}

      {/* Maul: Rachen und zwei Kiefer */}
      <Animated.View style={[StyleSheet.absoluteFill, maulStil]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="rachen">
              <Stop offset={0} stopColor={colors.blut} stopOpacity={0.75} />
              <Stop offset={1} stopColor={colors.blut} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={W / 2} cy={H / 2} r={Math.min(W, H) * 0.5} fill="url(#rachen)" />
        </Svg>
        <Animated.View style={[stile.kiefer, { top: 0, left: -W * 0.15, height: kieferH }, obenStil]}>
          <Kiefer form={kiefer} b={W * 1.3} h={kieferH} />
        </Animated.View>
        <Animated.View
          style={[stile.kiefer, { top: H / 2, left: -W * 0.15 - kiefer.zahnBreite / 2, height: kieferH }, untenStil]}
        >
          <Kiefer form={kiefer} b={W * 1.3} h={kieferH} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

/** glühendes, mandelförmiges Auge mit Schlitzpupille */
function Auge({ g, gespiegelt }: { g: number; gespiegelt: boolean }) {
  const m = g / 2;
  const w = g * 0.42;
  const h = g * 0.2;
  // Mandel, innen etwas tiefer – das macht den Blick böse
  const mandel = gespiegelt
    ? `M${m - w} ${m - h * 0.6} Q${m} ${m - h * 1.6} ${m + w} ${m + h * 0.4} Q${m} ${m + h * 1.5} ${m - w} ${m - h * 0.6} Z`
    : `M${m + w} ${m - h * 0.6} Q${m} ${m - h * 1.6} ${m - w} ${m + h * 0.4} Q${m} ${m + h * 1.5} ${m + w} ${m - h * 0.6} Z`;
  return (
    <Svg width={g} height={g}>
      <Defs>
        <RadialGradient id={`augenSchein${gespiegelt ? 1 : 0}`}>
          <Stop offset={0} stopColor={colors.augenRot} stopOpacity={0.55} />
          <Stop offset={1} stopColor={colors.augenRot} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={m} cy={m} r={m} fill={`url(#augenSchein${gespiegelt ? 1 : 0})`} />
      <Path d={mandel} fill={colors.augenRot} />
      <Path
        d={`M${m} ${m - h * 0.95} Q${m + h * 0.28} ${m} ${m} ${m + h * 0.95} Q${m - h * 0.28} ${m} ${m} ${m - h * 0.95} Z`}
        fill={colors.abgrund}
      />
    </Svg>
  );
}

type KieferForm = { kiefer: string; lefze: string; zaehne: string; zahnBreite: number };

/** Oberkiefer: Zahnfleisch oben, Zähne zeigen nach unten (der Unterkiefer ist derselbe, um 180° gedreht) */
function kieferForm(b: number, h: number): KieferForm {
  const n = 11;
  const tw = b / n;
  const g = h * 0.8; // Zahnfleischkante
  let lefze = `M0 ${g - h * 0.06}`;
  let zaehne = '';
  for (let i = 0; i < n; i++) {
    const x0 = i * tw;
    const fang = i === 3 || i === 7; // zwei lange Reißzähne
    const lang = fang ? h - g + h * 0.06 : (h - g) * (0.55 + ((i * 37) % 10) / 30);
    const krumm = ((i * 53) % 7) - 3;
    zaehne += `M${x0 + tw * 0.08} ${g - 2} Q${x0 + tw * 0.2} ${g + lang * 0.6} ${x0 + tw * 0.5 + krumm} ${g + lang} Q${x0 + tw * 0.8} ${g + lang * 0.6} ${x0 + tw * 0.92} ${g - 2} Z `;
    lefze += ` Q${x0 + tw * 0.5} ${g + h * 0.05} ${x0 + tw} ${g - h * 0.06}`;
  }
  lefze += ` L${b} 0 L0 0 Z`;
  return { kiefer: `M0 0 L${b} 0 L${b} ${g} L0 ${g} Z`, lefze, zaehne, zahnBreite: tw };
}

function Kiefer({ form, b, h }: { form: KieferForm; b: number; h: number }) {
  return (
    <Svg width={b} height={h}>
      <Path d={form.kiefer} fill={colors.abgrund} />
      <Path d={form.zaehne} fill={colors.zahn} stroke={colors.abgrund} strokeWidth={1.5} />
      <Path d={form.lefze} fill={colors.blut} opacity={0.9} />
      <Path d={form.lefze} fill={colors.abgrund} opacity={0.55} />
    </Svg>
  );
}

const stile = StyleSheet.create({ auge: { position: 'absolute' }, kiefer: { position: 'absolute', width: '130%' } });
