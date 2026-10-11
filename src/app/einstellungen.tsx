import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { NATURRAUM_QUELLE, naturraumById } from '@/data/naturraeume';
import { useEinstellungen } from '@/store/einstellungen';
import { colors, radius, spacing } from '@/theme/theme';

const PER_TEXT = { standort: 'per Standort (grob)', suche: 'per Ortssuche', liste: 'aus der Liste' } as const;

export default function Einstellungen() {
  const { naturraumId, gewaehltPer, grobStandort, allesZuruecksetzen } = useEinstellungen();
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;

  function zuruecksetzen() {
    Alert.alert('Alles zurücksetzen?', 'Dein Naturraum und alle Einstellungen werden von diesem Handy gelöscht.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Zurücksetzen',
        style: 'destructive',
        onPress: () => {
          allesZuruecksetzen();
          if (router.canDismiss()) router.dismissAll();
          router.replace('/onboarding');
        },
      },
    ]);
  }

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile titel="Einstellungen" />

          <View style={stile.karte}>
            <Schrift art="etikett">Dein Naturraum</Schrift>
            <Schrift art="ueberschrift">{naturraum?.name ?? '–'}</Schrift>
            {gewaehltPer && <Schrift art="klein">Gewählt {PER_TEXT[gewaehltPer]}</Schrift>}
            <Knopf
              titel="Naturraum ändern"
              symbol="standort"
              art="leise"
              onPress={() => router.push('/onboarding/waehlen')}
              style={{ marginTop: spacing.s }}
            />
          </View>

          <View style={stile.karte}>
            <Schrift art="etikett">Deine Daten</Schrift>
            <Schrift art="klein">
              Wildfund braucht kein Konto. Alles bleibt auf diesem Handy und wird nirgendwohin geschickt.
              {grobStandort
                ? ` Gespeichert ist nur ein grober Standort (auf ca. 10 km gerundet): ${grobStandort.lat}° N, ${grobStandort.lon}° O.`
                : ' Ein Standort ist nicht gespeichert.'}
            </Schrift>
            <Knopf titel="Alles zurücksetzen" art="leise" onPress={zuruecksetzen} style={{ marginTop: spacing.s }} />
          </View>

          <View style={stile.karte}>
            <Schrift art="etikett">Datenquellen</Schrift>
            <Schrift art="klein">Grenzen der Naturräume: {NATURRAUM_QUELLE}.</Schrift>
            <Schrift art="klein">Orte und Postleitzahlen: GeoNames (geonames.org), CC BY 4.0.</Schrift>
            <Schrift art="klein">Baumarten-Zuordnung: Demo-Stand, wird noch fachlich geprüft.</Schrift>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m },
  karte: {
    gap: spacing.xs,
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
});
