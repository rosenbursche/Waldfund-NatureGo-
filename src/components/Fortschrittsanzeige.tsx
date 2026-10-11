import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { levelInfo } from '@/logic/fortschritt';
import { useSammlung } from '@/store/sammlung';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Schrift } from './Schrift';

/**
 * Kleine Anzeige oben auf der Lichtung: Level, Rang, Fortschritt zum nächsten Level,
 * Aktivitätspunkte und Serie. Antippen öffnet das Feldtagebuch.
 */
export function Fortschrittsanzeige() {
  const ap = useSammlung((s) => s.ap);
  const serie = useSammlung((s) => s.serie);
  const info = levelInfo(ap);

  // Balken füllt sich weich, wenn Punkte dazukommen
  const breite = useSharedValue(info.fortschritt);
  useEffect(() => {
    breite.value = withTiming(info.fortschritt, { duration: 800 });
  }, [info.fortschritt, breite]);
  const balken = useAnimatedStyle(() => ({ width: `${breite.value * 100}%` }));

  return (
    <Pressable
      onPress={() => router.push('/tagebuch')}
      accessibilityRole="button"
      accessibilityLabel={`Level ${info.level}, ${info.rang}, ${ap} Aktivitätspunkte, noch ${info.fehlend} bis zum nächsten Level, Serie ${serie} Tage. Feldtagebuch öffnen`}
      style={({ pressed }) => [stile.zeile, pressed && { opacity: 0.7 }]}
    >
      <View style={stile.level}>
        <Schrift style={stile.levelZahl}>{info.level}</Schrift>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Schrift style={stile.rang} numberOfLines={1}>
          {info.rang}
        </Schrift>
        <View style={stile.spur}>
          <Animated.View style={[stile.fuellung, balken]} />
        </View>
        <Schrift style={stile.klein}>
          {ap} AP{serie > 1 ? ` · ${serie} Tage in Folge` : ''}
        </Schrift>
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s + 2, flex: 1 },
  level: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.amber,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.amber,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  levelZahl: { fontFamily: fonts.handBold, fontSize: 19, color: colors.amber, lineHeight: 24 },
  rang: {
    fontFamily: fonts.hand,
    fontSize: 17,
    lineHeight: 20,
    color: colors.moon,
    textShadowColor: colors.night,
    textShadowRadius: 6,
  },
  spur: { height: 5, borderRadius: radius.s, backgroundColor: colors.forest, overflow: 'hidden', maxWidth: 180 },
  fuellung: { height: '100%', backgroundColor: colors.amber, borderRadius: radius.s },
  klein: { fontFamily: fonts.type, fontSize: 11, color: colors.fog },
});
