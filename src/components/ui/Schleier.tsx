import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme/theme';

/**
 * Schleier über jedem Hintergrund (Stimmung „Hohlweg“):
 * - oben ein weicher Lichtschein, als fiele Licht am Ende des Weges ein
 * - an den Rändern eine dunkle Vignette, die den Blick zur Mitte zieht
 * Liegt zwischen Hintergrund-Schichten und Inhalt, fängt keine Berührungen ab, ist unbewegt.
 */
export function Schleier() {
  const { width: b, height: h } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={b} height={h}>
        <Defs>
          <RadialGradient id="schleier-licht" cx="50%" cy="0%" rx="75%" ry="45%">
            <Stop offset="0" stopColor={colors.rune} stopOpacity={0.16} />
            <Stop offset="0.5" stopColor={colors.nebel} stopOpacity={0.05} />
            <Stop offset="1" stopColor={colors.nebel} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="schleier-rand" cx="50%" cy="45%" rx="80%" ry="70%">
            <Stop offset="0.55" stopColor={colors.shadow} stopOpacity={0} />
            <Stop offset="1" stopColor={colors.shadow} stopOpacity={0.6} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={b} height={h} fill="url(#schleier-licht)" />
        <Rect x={0} y={0} width={b} height={h} fill="url(#schleier-rand)" />
      </Svg>
    </View>
  );
}
