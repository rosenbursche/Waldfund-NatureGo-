import { useState, type ReactNode } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { colors, fonts, spacing } from '@/theme/theme';

/**
 * Kapitel der lebendigen Tierseite: statt eines Kastens ein Abschnitt über die volle Breite.
 * Kopf mit römischer Zahl (die Kapitel erzählen die Seite der Reihe nach), Titel in Cinzel
 * und einer kurzen Zeile darunter. Beim Hineinscrollen blendet das Kapitel weich ein und
 * gleitet ein Stück nach oben. Bei „Bewegung reduzieren“ steht es sofort fertig da.
 */
const ROEMISCH = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function Kapitel({
  nummer,
  titel,
  zeile,
  scroll,
  ruhig,
  randlos = false,
  children,
}: {
  nummer: number;
  titel: string;
  zeile?: string;
  scroll: Animated.Value;
  ruhig: boolean;
  /** Inhalt über die volle Bildschirmbreite (Fotos), sonst mit Seitenrand */
  randlos?: boolean;
  children: ReactNode;
}) {
  const { height: fenster } = useWindowDimensions();
  // Position des Kapitels auf der Seite – wird einmal beim Layout gemessen
  const [y, setY] = useState<number | null>(null);

  const einblenden =
    ruhig || y === null
      ? undefined
      : {
          opacity: scroll.interpolate({
            inputRange: [y - fenster, y - fenster * 0.65],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: scroll.interpolate({
                inputRange: [y - fenster, y - fenster * 0.6],
                outputRange: [48, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        };

  return (
    <Animated.View style={[stile.kapitel, einblenden]} onLayout={(e) => setY(e.nativeEvent.layout.y)}>
      <View style={stile.kopf}>
        <View style={stile.nummerZeile}>
          <View style={stile.strich} />
          <Schrift style={stile.nummer}>{ROEMISCH[nummer - 1] ?? nummer}</Schrift>
          <View style={stile.strich} />
        </View>
        <Schrift style={stile.titel} accessibilityRole="header">
          {titel}
        </Schrift>
        {zeile && <Schrift style={stile.zeile}>{zeile}</Schrift>}
      </View>
      <View style={[stile.inhalt, randlos && stile.randlos]}>{children}</View>
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  kapitel: { gap: spacing.m, paddingTop: spacing.xl },
  kopf: { alignItems: 'center', gap: 4, paddingHorizontal: spacing.m },
  nummerZeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  strich: { width: 28, height: 1, backgroundColor: colors.amber, opacity: 0.6 },
  nummer: { fontFamily: fonts.titel, fontSize: 13, letterSpacing: 3, color: colors.amber },
  titel: {
    fontFamily: fonts.titel,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: 2,
    color: colors.moon,
    textAlign: 'center',
  },
  zeile: { fontFamily: fonts.notiz, fontSize: 17, lineHeight: 23, color: colors.fog, textAlign: 'center' },
  inhalt: { gap: spacing.m },
  randlos: { marginHorizontal: -spacing.m },
});
