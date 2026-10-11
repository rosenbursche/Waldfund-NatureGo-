import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SELTENHEIT } from '@/data/spiel';
import type { KatalogEintrag } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Schrift } from './Schrift';

/**
 * Karte in der Mystery-Zone.
 * Noch nicht gefunden: großes "?" und ein Rätsel. Gefunden: Name und Lebensraum.
 */
export function MysteryKarte({ e, ok, index = 0 }: { e: KatalogEintrag; ok: boolean; index?: number }) {
  const s = SELTENHEIT[e.seltenheit];
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(500)} style={stile.platz}>
      <Pressable
        onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
        accessibilityRole="button"
        accessibilityLabel={ok ? `${e.name}, ${s.name}, gefunden` : `Unbekannte Art, ${s.name}. Rätsel: ${e.raetsel}`}
        style={({ pressed }) => [
          stile.karte,
          { borderColor: s.farbe },
          ok ? { borderStyle: 'solid', shadowColor: s.farbe, shadowOpacity: 0.45, shadowRadius: 14 } : null,
          pressed && { opacity: 0.7 },
        ]}
      >
        {ok ? (
          <Schrift art="ueberschrift" style={{ fontSize: 20, lineHeight: 24 }}>
            {e.name}
          </Schrift>
        ) : (
          <Schrift style={[stile.frage, { color: s.farbe }]}>?</Schrift>
        )}
        <Schrift style={[stile.stufe, { color: s.farbe }]}>
          {s.name} · {s.punkte} AP
        </Schrift>
        <Schrift art="klein" style={{ fontSize: 12.5, lineHeight: 17 }}>
          {ok ? e.lebensraum : e.raetsel}
        </Schrift>
      </Pressable>
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  platz: { width: '48%' },
  karte: {
    flex: 1,
    gap: spacing.xs + 2,
    padding: spacing.m - 4,
    borderRadius: radius.m,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: colors.forest,
  },
  frage: { fontFamily: fonts.handBold, fontSize: 38, lineHeight: 42 },
  stufe: { fontFamily: fonts.type, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
});
