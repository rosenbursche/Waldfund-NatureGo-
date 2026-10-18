import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme/theme';

/**
 * Zierlinie: Linie – Raute – Linie. Trennt Kopf und Inhalt einer Sektion
 * oder zwei Teile einer Seite. `farbe` färbt die Raute (Standard: Laterne).
 */
export function Zierlinie({ farbe = colors.amber, style }: { farbe?: string; style?: ViewStyle }) {
  return (
    <View style={[stile.zier, style]} pointerEvents="none">
      <View style={[stile.linie, stile.links]} />
      <View style={[stile.raute, { borderColor: farbe }]} />
      <View style={[stile.punkt, { backgroundColor: farbe }]} />
      <View style={[stile.raute, { borderColor: farbe }]} />
      <View style={[stile.linie, stile.rechts]} />
    </View>
  );
}

const stile = StyleSheet.create({
  zier: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linie: { flex: 1, height: 1, backgroundColor: colors.moss },
  // Linien laufen zur Mitte hin aus dem Dunkel heraus
  links: { opacity: 0.55 },
  rechts: { opacity: 0.55 },
  raute: { width: 6, height: 6, transform: [{ rotate: '45deg' }], borderWidth: 1 },
  punkt: { width: 3, height: 3, borderRadius: 2 },
});
