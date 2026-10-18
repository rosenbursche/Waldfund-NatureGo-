import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme/theme';

/**
 * Dunkler Rand über einer 3D-Szene (wie bei einer alten Fotografie):
 * lenkt den Blick in die Mitte und lässt die Ränder im Dunkel verschwinden.
 */
export function Vignette({ staerke = 0.8 }: { staerke?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="48%" r="72%">
            <Stop offset={0.45} stopColor={colors.night} stopOpacity={0} />
            <Stop offset={1} stopColor={colors.night} stopOpacity={staerke} />
          </RadialGradient>
          <LinearGradient id="unten" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0.7} stopColor={colors.night} stopOpacity={0} />
            <Stop offset={1} stopColor={colors.night} stopOpacity={staerke * 0.9} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={100} height={100} fill="url(#vignette)" />
        <Rect x={0} y={0} width={100} height={100} fill="url(#unten)" />
      </Svg>
    </View>
  );
}
