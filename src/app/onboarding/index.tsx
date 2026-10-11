import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Schrift } from '@/components/Schrift';
import { colors, spacing } from '@/theme/theme';

/** Onboarding, Schritt 1: Begrüßung */
export default function Willkommen() {
  return (
    <Hintergrund>
      <SafeAreaView style={stile.flaeche}>
        <View style={stile.mitte}>
          <Animated.View entering={FadeIn.duration(1600)}>
            <Schrift art="etikett" style={stile.zentriert}>
              Feldtagebuch · Eintrag 1
            </Schrift>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(1400)}>
            <Schrift art="titel" style={[stile.zentriert, stile.gross]} accessibilityRole="header">
              Wildfund
            </Schrift>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1200).duration(1800)}>
            <Schrift art="notiz" style={[stile.zentriert, stile.satz]}>
              Ganz in deiner Nähe leben Pflanzen, Pilze und Tiere, die du noch nie bemerkt hast. Finde sie,
              fotografiere sie – und lüfte das Geheimnis deines Waldes.
            </Schrift>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(2200).duration(1000)}>
          <Knopf titel="Meinen Wald finden" symbol="pfeil" onPress={() => router.push('/onboarding/waehlen')} />
          <Schrift art="klein" style={[stile.zentriert, { marginTop: spacing.m }]}>
            Kein Konto nötig. Alles bleibt auf deinem Handy.
          </Schrift>
        </Animated.View>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  flaeche: { flex: 1, padding: spacing.m, paddingBottom: spacing.xl },
  mitte: { flex: 1, justifyContent: 'center', gap: spacing.m },
  zentriert: { textAlign: 'center' },
  gross: {
    fontSize: 64,
    lineHeight: 76,
    // weiches Mondlicht-Leuchten um den Titel
    textShadowColor: colors.rune,
    textShadowRadius: 18,
  },
  satz: { paddingHorizontal: spacing.s },
});
