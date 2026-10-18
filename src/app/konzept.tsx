import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { Kapitel } from '@/components/lebendig/Kapitel';
import { Jahreszeiten } from '@/components/lebendig/Jahreszeiten';
import { LebendigHero } from '@/components/lebendig/LebendigHero';
import { Lupe } from '@/components/lebendig/Lupe';
import { Spurensuche } from '@/components/lebendig/Spurensuche';
import { Schrift } from '@/components/Schrift';
import { alleFotos } from '@/components/tier/TierSeiteInhalt';
import { Bildnachweis } from '@/components/tier/TierFoto';
import { TierHintergrund } from '@/components/tier/TierHintergrund';
import { artById } from '@/data/arten';
import { KATEGORIEN } from '@/data/spiel';
import { tierSeite } from '@/data/tierSeiten';
import { colors, spacing } from '@/theme/theme';

/**
 * KONZEPT (Branch feature/tierseite-lebendig): die lebendige Tierseite.
 * Gleiche Inhalte wie die grafische Tierseite, aber erzählt in Kapiteln über die volle Breite,
 * mit echten Fotos als Bühne und Bewegung, die etwas bedeutet (Spuren laufen, Schnee fällt im Winter …).
 * Beschreibung und nächste Schritte: docs/KONZEPT-TIERSEITE.md
 */
export default function Konzept() {
  const { id = 'reh' } = useLocalSearchParams<{ id?: string }>();
  const ruhig = useReducedMotion();
  const [scroll] = useState(() => new Animated.Value(0));
  const tier = tierSeite(id);
  const art = artById[id];

  if (!tier?.fotos || !art) {
    return (
      <View style={stile.leer}>
        <Schrift>Für diese Art gibt es das Konzept noch nicht. Es braucht echte Fotos (Reh oder Rotfuchs).</Schrift>
      </View>
    );
  }

  return (
    <TierHintergrund scroll={scroll} ruhig={ruhig}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }], { useNativeDriver: true })}
        contentContainerStyle={stile.inhalt}
      >
        <View style={stile.randlos}>
          <LebendigHero
            foto={tier.fotos.hero}
            x={tier.fotos.heroX}
            name={art.name}
            latein={art.lat}
            etikett={KATEGORIEN.find((k) => k.id === art.kategorie)?.name ?? ''}
            seltenheit={art.seltenheit}
            scroll={scroll}
            ruhig={ruhig}
          />
        </View>

        <Kapitel nummer={1} titel="Erkunden" zeile="Schau mit der Lupe genau hin" scroll={scroll} ruhig={ruhig} randlos>
          <Lupe tier={tier} ruhig={ruhig} />
        </Kapitel>

        <Kapitel
          nummer={2}
          titel="Ein Jahr"
          zeile="Wische durch die Jahreszeiten"
          scroll={scroll}
          ruhig={ruhig}
          randlos
        >
          <Jahreszeiten tier={tier} ruhig={ruhig} />
        </Kapitel>

        <Kapitel nummer={3} titel="Spuren" zeile="Wer ist hier entlanggelaufen?" scroll={scroll} ruhig={ruhig}>
          <Spurensuche tier={tier} ruhig={ruhig} />
        </Kapitel>

        <View style={{ marginTop: spacing.xl }}>
          <Bildnachweis ids={alleFotos(tier)} />
        </View>
      </Animated.ScrollView>

      {/* Zurück schwebt über allem */}
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Zurück"
        hitSlop={8}
        style={({ pressed }) => [stile.zurueck, pressed && { opacity: 0.6 }]}
      >
        <Icon name="zurueck" groesse={20} />
      </Pressable>
    </TierHintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { paddingHorizontal: spacing.m, paddingBottom: spacing.xxl },
  randlos: { marginHorizontal: -spacing.m },
  leer: { flex: 1, backgroundColor: colors.night, padding: spacing.l, justifyContent: 'center' },
  zurueck: {
    position: 'absolute',
    top: 54,
    left: spacing.m,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    backgroundColor: `${colors.night}B3`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
