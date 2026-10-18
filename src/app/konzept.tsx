import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { ArtVerweise } from '@/components/ArtVerweise';
import { Icon } from '@/components/Icon';
import { Fressfeinde } from '@/components/lebendig/Fressfeinde';
import { Jahreszeiten } from '@/components/lebendig/Jahreszeiten';
import { Kapitel } from '@/components/lebendig/Kapitel';
import { LebendigHero } from '@/components/lebendig/LebendigHero';
import { LebensraumPanorama } from '@/components/lebendig/LebensraumPanorama';
import { Lupe } from '@/components/lebendig/Lupe';
import { Spurensuche } from '@/components/lebendig/Spurensuche';
import { Schrift } from '@/components/Schrift';
import { Bildnachweis } from '@/components/tier/TierFoto';
import { TierHintergrund } from '@/components/tier/TierHintergrund';
import { alleFotos } from '@/components/tier/TierSeiteInhalt';
import { Hinweis, Speiseplan } from '@/components/tier/UmweltTafeln';
import { Jahresrad, TagesUhr } from '@/components/tier/ZeitTafeln';
import { Kennzahl } from '@/components/ui/Kennzahl';
import { OhneRahmen } from '@/components/ui/Sektion';
import { WappenReihe } from '@/components/ui/Wappen';
import { artById } from '@/data/arten';
import { KATEGORIEN } from '@/data/spiel';
import { STECKBRIEFE } from '@/data/steckbriefe';
import { tierSeite } from '@/data/tierSeiten';
import { useSammlung } from '@/store/sammlung';
import { colors, spacing } from '@/theme/theme';

/**
 * KONZEPT (Branch feature/tierseite-lebendig): die lebendige Tierseite.
 * Gleiche Inhalte wie die grafische Tierseite, aber erzählt in Kapiteln über die volle Breite,
 * mit echten Fotos als Bühne und Bewegung, die etwas bedeutet (Spuren laufen, Schnee fällt im Winter …).
 * Jahresrad, Tagesuhr und Speiseplan sind die bewährten Sektionen – hier ohne Rahmen (`OhneRahmen`).
 * Beschreibung und nächste Schritte: docs/KONZEPT-TIERSEITE.md
 */
export default function Konzept() {
  const { id = 'reh' } = useLocalSearchParams<{ id?: string }>();
  const ruhig = useReducedMotion();
  const sammlung = useSammlung((s) => s.gefunden);
  const [scroll] = useState(() => new Animated.Value(0));
  // gemeinsamer Monat für Jahresrad und Speiseplan (Start: jetzt)
  const [monat, setMonat] = useState(() => new Date().getMonth() + 1);
  const tier = tierSeite(id);
  const art = artById[id];

  if (!tier?.fotos || !art) {
    return (
      <View style={stile.leer}>
        <Schrift>Für diese Art gibt es das Konzept noch nicht. Es braucht echte Fotos (Reh oder Rotfuchs).</Schrift>
      </View>
    );
  }

  const kapitel = { scroll, ruhig };
  const hinweisText =
    tier.hinweis.text === 'eigen'
      ? tier.hinweis.eigenerText
      : tier.hinweis.text === 'gefahr'
        ? art.gefahr
        : art.wusstestDu;

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
            wappen={<WappenReihe id={id} art={art} />}
            scroll={scroll}
            ruhig={ruhig}
          />
        </View>

        <Kapitel nummer={1} titel="Erkunden" zeile="Schau mit der Lupe genau hin" randlos {...kapitel}>
          <Lupe tier={tier} ruhig={ruhig} />
          {/* „So groß“ nur noch kurz nebenbei: zwei Kennzahlen */}
          <View style={stile.masse}>
            <Kennzahl
              wert={`${tier.groesse.cm[0]}–${tier.groesse.cm[1]}`}
              einheit="cm"
              etikett={tier.groesse.mass === 'schulter' ? 'Schulterhöhe' : 'Körperlänge'}
              ausrichtung="mitte"
            />
            <Kennzahl
              wert={`${tier.groesse.gewicht[0]}–${tier.groesse.gewicht[1]}`}
              einheit={tier.groesse.einheit}
              etikett="Gewicht"
              ausrichtung="mitte"
            />
          </View>
        </Kapitel>

        <Kapitel nummer={2} titel="Ein Jahr" zeile="Wische durch die Jahreszeiten, dreh am Rad" {...kapitel}>
          <View style={stile.randlos}>
            <Jahreszeiten tier={tier} ruhig={ruhig} />
          </View>
          <OhneRahmen>
            <Jahresrad tier={tier} monat={monat} setMonat={setMonat} />
          </OhneRahmen>
        </Kapitel>

        <Kapitel nummer={3} titel="Ein Tag" zeile="Zieh den Zeiger: Was macht es gerade?" {...kapitel}>
          <OhneRahmen>
            <TagesUhr tier={tier} />
          </OhneRahmen>
        </Kapitel>

        <Kapitel nummer={4} titel="Zuhause" zeile="Wisch durch die Landschaft" randlos {...kapitel}>
          <LebensraumPanorama tier={tier} ruhig={ruhig} />
        </Kapitel>

        <Kapitel nummer={5} titel="Speiseplan" zeile="Was es im Lauf des Jahres frisst" {...kapitel}>
          <OhneRahmen>
            <Speiseplan tier={tier} monat={monat} setMonat={setMonat}>
              <ArtVerweise
                ids={STECKBRIEFE[id]?.nahrungIds ?? []}
                titel="Futterpflanzen im Katalog"
                sammlung={sammlung}
              />
            </Speiseplan>
          </OhneRahmen>
        </Kapitel>

        <Kapitel nummer={6} titel="Spuren" zeile="Wer ist hier entlanggelaufen?" {...kapitel}>
          <Spurensuche tier={tier} ruhig={ruhig} />
        </Kapitel>

        <Kapitel nummer={7} titel="Fressfeinde" zeile="Wer lauert im Schatten? Tippe sie an" {...kapitel}>
          <Fressfeinde tier={tier} ruhig={ruhig} />
        </Kapitel>

        <View style={stile.schluss}>
          <Hinweis tier={tier} text={hinweisText} />
          <Bildnachweis ids={alleFotos(tier, true)} />
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
  masse: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, paddingTop: spacing.s },
  schluss: { marginTop: spacing.xl, gap: spacing.m },
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
