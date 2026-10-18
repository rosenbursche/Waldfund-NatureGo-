import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/theme/theme';

import { Schleier } from './ui/Schleier';

/**
 * Mystischer Hintergrund: Dämmerungsverlauf, langsam ziehende Nebelbänke
 * und schwebende Sporen. Bei "Bewegung reduzieren" bleibt alles still.
 *
 * Das ist die einfache 2D-Variante für die Menüs. Die große 3D-Szene kommt in Phase 3.
 */
export function Hintergrund({ children }: { children?: React.ReactNode }) {
  return (
    <View style={stile.flaeche}>
      <LinearGradient
        colors={[colors.night, colors.forest, colors.night]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Nebelbank y={0.18} dauer={38000} versatz={0} deckkraft={0.1} />
      <Nebelbank y={0.62} dauer={52000} versatz={0.4} deckkraft={0.13} />
      <Nebelbank y={0.86} dauer={44000} versatz={0.7} deckkraft={0.16} />
      <Sporen />
      <Schleier />
      {children}
    </View>
  );
}

/** Eine weiche, breite Nebelbank, die langsam hin und her zieht. */
function Nebelbank({ y, dauer, versatz, deckkraft }: { y: number; dauer: number; versatz: number; deckkraft: number }) {
  const { width, height } = useWindowDimensions();
  const ruhig = useReducedMotion();
  const t = useSharedValue(versatz);

  useEffect(() => {
    if (ruhig) return;
    t.value = withRepeat(withTiming(1 + versatz, { duration: dauer, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [ruhig, dauer, versatz, t]);

  const stil = useAnimatedStyle(() => ({ transform: [{ translateX: (t.value - 0.5) * width * 0.5 }] }));

  const breite = width * 1.8;
  const hoehe = height * 0.28;
  const id = `nebel-${Math.round(y * 100)}`;

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: -width * 0.4, top: height * y - hoehe / 2 }, stil]}
    >
      <Svg width={breite} height={hoehe}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={colors.fog} stopOpacity={deckkraft} />
            <Stop offset="1" stopColor={colors.fog} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={breite / 2} cy={hoehe / 2} rx={breite / 2} ry={hoehe / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Feste Pseudo-Zufallswerte, damit die Sporen bei jedem Start gleich verteilt sind. */
const SPOREN = Array.from({ length: 14 }, (_, i) => ({
  x: ((i * 37) % 100) / 100,
  y: ((i * 53 + 17) % 100) / 100,
  groesse: 2 + (i % 3),
  verzoegerung: (i * 700) % 5000,
  farbe: i % 4 === 0 ? colors.amber : colors.rune,
}));

function Sporen() {
  return (
    <>
      {SPOREN.map((s, i) => (
        <Spore key={i} {...s} />
      ))}
    </>
  );
}

function Spore({ x, y, groesse, verzoegerung, farbe }: (typeof SPOREN)[number]) {
  const { width, height } = useWindowDimensions();
  const ruhig = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (ruhig) return;
    t.value = withDelay(
      verzoegerung,
      withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
  }, [ruhig, verzoegerung, t]);

  const stil = useAnimatedStyle(() => ({
    opacity: ruhig ? 0.35 : 0.1 + t.value * 0.6,
    transform: [{ translateY: -t.value * 18 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x * width,
          top: y * height,
          width: groesse,
          height: groesse,
          borderRadius: groesse,
          backgroundColor: farbe,
          shadowColor: farbe,
          shadowOpacity: 0.9,
          shadowRadius: 4,
        },
        stil,
      ]}
    />
  );
}

const stile = StyleSheet.create({ flaeche: { flex: 1, backgroundColor: colors.night, overflow: 'hidden' } });
