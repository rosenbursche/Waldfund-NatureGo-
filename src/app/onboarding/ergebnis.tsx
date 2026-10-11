import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { WaldStreifen } from '@/components/WaldStreifen';
import { naturraumById } from '@/data/naturraeume';
import { BODEN_NAME, GROSSLANDSCHAFT_NAME, HOEHENSTUFE_NAME, type Rolle } from '@/data/typen';
import { getAngepflanzteBaeume, getHeimischeBaeume } from '@/logic/regelEngine';
import { useEinstellungen } from '@/store/einstellungen';
import { colors, radius, spacing } from '@/theme/theme';

const ROLLEN_TITEL: Record<Rolle, string> = {
  haupt: 'Hauptbaumart',
  neben: 'Nebenbaumarten',
  begleiter: 'Begleiter',
};

type Params = { id: string; per: 'standort' | 'suche' | 'liste'; km?: string; ort?: string; glon?: string; glat?: string };

/** Onboarding, Schritt 3: "Dein Naturraum" mit den heimischen Bäumen */
export default function Ergebnis() {
  const p = useLocalSearchParams<Params>();
  const setNaturraum = useEinstellungen((s) => s.setNaturraum);
  const naturraum = naturraumById[p.id];

  if (!naturraum) {
    return (
      <Hintergrund>
        <SafeAreaView style={stile.inhalt}>
          <Kopfzeile titel="Nicht gefunden" />
          <Schrift>Diesen Naturraum gibt es nicht. Geh zurück und wähle neu.</Schrift>
        </SafeAreaView>
      </Hintergrund>
    );
  }

  const baeume = getHeimischeBaeume(naturraum);
  const angepflanzt = getAngepflanzteBaeume(naturraum);
  const km = Number(p.km ?? 0);

  function bestaetigen() {
    const grob = p.glon && p.glat ? { lon: Number(p.glon), lat: Number(p.glat) } : null;
    setNaturraum(naturraum.id, p.per ?? 'liste', grob);
    // Alle Onboarding-Screens schließen und zur Startseite
    if (router.canDismiss()) router.dismissAll();
    router.replace('/');
  }

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Schritt 2 von 2" titel="Dein Naturraum" />

          {km > 0 && (
            <View style={stile.hinweis}>
              <Schrift art="text">
                {p.ort ? `${p.ort} liegt` : 'Du bist'} noch außerhalb unserer 10 Demo-Naturräume. Der nächste ist
                etwa {km} km entfernt. Du kannst ihn trotzdem wählen oder dir einen anderen aussuchen.
              </Schrift>
            </View>
          )}

          <Animated.View entering={FadeInDown.duration(1000)}>
            <Schrift art="titel" accessibilityRole="header">
              {naturraum.name}
            </Schrift>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300).duration(900)} style={stile.merkmale}>
            <Merkmal etikett="Großlandschaft" wert={GROSSLANDSCHAFT_NAME[naturraum.grosslandschaft]} />
            <Merkmal etikett="Höhenstufe" wert={HOEHENSTUFE_NAME[naturraum.hoehenstufe]} />
            <Merkmal etikett="Boden" wert={BODEN_NAME[naturraum.boden]} />
          </Animated.View>

          <WaldStreifen baeume={baeume} />

          <Schrift art="notiz">
            Diese {baeume.length} Baumarten würden hier wachsen, wenn der Mensch den Wald sich selbst überließe.
          </Schrift>

          {(['haupt', 'neben', 'begleiter'] as Rolle[]).map((rolle) => {
            const liste = baeume.filter((b) => b.rolle === rolle);
            if (liste.length === 0) return null;
            return (
              <View key={rolle} style={stile.gruppe}>
                <Schrift art="etikett">{rolle === 'haupt' && liste.length > 1 ? 'Hauptbaumarten' : ROLLEN_TITEL[rolle]}</Schrift>
                {liste.map((b) => (
                  <View key={b.baumart.id} style={stile.baum}>
                    <Schrift art={rolle === 'begleiter' ? 'text' : 'ueberschrift'} style={rolle === 'neben' && { fontSize: 21 }}>
                      {b.baumart.name}
                    </Schrift>
                    <Schrift art="klein">
                      <Schrift art="klein" style={{ fontStyle: 'italic' }}>
                        {b.baumart.lat}
                      </Schrift>
                      {b.hinweis ? ` · ${b.hinweis}` : ''}
                    </Schrift>
                  </View>
                ))}
              </View>
            );
          })}

          {angepflanzt.length > 0 && (
            <View style={[stile.gruppe, stile.angepflanzt]}>
              <Schrift art="etikett">Hier oft gepflanzt – aber nicht heimisch</Schrift>
              <Schrift art="klein">
                {angepflanzt.map((b) => b.name).join(', ')}. Diese Bäume findest du hier vielleicht trotzdem: Förster
                haben sie angepflanzt.
              </Schrift>
            </View>
          )}

          <Schrift art="klein" style={{ opacity: 0.7 }}>
            Demo-Daten: Höhenstufe und Boden sind vereinfacht und werden noch fachlich geprüft.
          </Schrift>

          <Knopf titel="Das ist mein Wald" symbol="pfeil" onPress={bestaetigen} style={{ marginTop: spacing.s }} />
          <Knopf titel="Anderen Naturraum wählen" art="leise" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

function Merkmal({ etikett, wert }: { etikett: string; wert: string }) {
  return (
    <View style={stile.merkmal}>
      <Schrift art="etikett" style={{ fontSize: 10 }}>
        {etikett}
      </Schrift>
      <Schrift art="klein" style={{ color: colors.moon }}>
        {wert}
      </Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  hinweis: {
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
  },
  merkmale: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  merkmal: {
    borderWidth: 1,
    borderColor: colors.moss,
    borderRadius: radius.s,
    paddingHorizontal: spacing.s + 2,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.forest,
  },
  gruppe: { gap: spacing.s },
  baum: { borderLeftWidth: 2, borderLeftColor: colors.moss, paddingLeft: spacing.m, gap: 2 },
  angepflanzt: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.moss,
    borderRadius: radius.m,
    padding: spacing.m,
  },
});
