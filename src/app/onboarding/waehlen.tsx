import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { NATURRAEUME } from '@/data/naturraeume';
import { naechsterNaturraum, vergroebern } from '@/logic/geo';
import { colors, radius, spacing } from '@/theme/theme';

/** Onboarding, Schritt 2: Naturraum wählen – per Standort, Suche oder Liste */
export default function Waehlen() {
  const [sucht, setSucht] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  async function standortVerwenden() {
    setMeldung(null);
    setSucht(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMeldung('Kein Problem! Ohne Standort kannst du deinen Ort einfach suchen oder aus der Liste wählen.');
        return;
      }
      // Geringe Genauigkeit reicht völlig und schont den Akku.
      const pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
        new Promise<null>((ok) => setTimeout(() => ok(null), 15000)),
      ]);
      const coords = pos?.coords ?? (await Location.getLastKnownPositionAsync())?.coords;
      if (!coords) {
        setMeldung('Dein Standort ließ sich gerade nicht bestimmen. Versuch es draußen noch mal oder such deinen Ort.');
        return;
      }

      // Genauer Punkt wird nur hier kurz zum Zuordnen benutzt und dann verworfen.
      const { naturraum, km } = naechsterNaturraum(coords.longitude, coords.latitude, NATURRAEUME);
      const grob = vergroebern(coords.longitude, coords.latitude);
      router.push({
        pathname: '/onboarding/ergebnis',
        params: { id: naturraum.id, per: 'standort', km: String(Math.round(km)), glon: String(grob.lon), glat: String(grob.lat) },
      });
    } catch {
      setMeldung('Beim Standort ist etwas schiefgelaufen. Such deinen Ort lieber über die Suche.');
    } finally {
      setSucht(false);
    }
  }

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Schritt 1 von 2" titel="Wo liegt dein Wald?" />
          <Schrift art="text">
            Jede Landschaft hat ihre eigenen Bäume. Sag uns, wo du unterwegs bist, und wir verraten dir, welche
            Arten dort von Natur aus wachsen.
          </Schrift>

          <View style={stile.optionen}>
            <Knopf
              titel="Standort verwenden"
              untertitel="Einmalig und nur grob (ca. 10 km). Bleibt auf deinem Handy."
              symbol="standort"
              onPress={standortVerwenden}
              deaktiviert={sucht}
            />
            <Knopf
              titel="Ort oder Postleitzahl suchen"
              untertitel="z. B. „Bispingen“ oder „29646“"
              symbol="lupe"
              art="leise"
              onPress={() => router.push('/onboarding/suche')}
              deaktiviert={sucht}
            />
            <Knopf
              titel="Naturraum aus Liste wählen"
              untertitel="z. B. Lüneburger Heide, Schwarzwald"
              symbol="liste"
              art="leise"
              onPress={() => router.push('/onboarding/liste')}
              deaktiviert={sucht}
            />
          </View>

          {sucht && (
            <View style={stile.zeile}>
              <ActivityIndicator color={colors.amber} />
              <Schrift art="klein">Suche deinen Standort …</Schrift>
            </View>
          )}
          {meldung && (
            <View style={stile.meldung} accessibilityLiveRegion="polite">
              <Schrift art="text">{meldung}</Schrift>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m },
  optionen: { gap: spacing.m, marginTop: spacing.s },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  meldung: {
    borderWidth: 1,
    borderColor: colors.moss,
    borderRadius: radius.m,
    padding: spacing.m,
    backgroundColor: colors.forest,
  },
});
