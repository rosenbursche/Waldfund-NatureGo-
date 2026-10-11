import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Knopf } from '@/components/Knopf';
import { Kopfzeile } from '@/components/Kopfzeile';
import { MysteryKarte } from '@/components/MysteryKarte';
import { Schrift } from '@/components/Schrift';
import { Stammbaum } from '@/components/Stammbaum';
import type { KategorieId } from '@/data/artTypen';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN } from '@/data/spiel';
import { fortschrittDerKategorie, katalogGruppen, mysteryArten } from '@/logic/katalog';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, spacing } from '@/theme/theme';

/** Katalog einer Kategorie: Stammbaum der Gruppen und darunter die Mystery-Zone */
export default function Katalog() {
  const { kategorie } = useLocalSearchParams<{ kategorie: KategorieId }>();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const gefunden = useSammlung((s) => s.gefunden);
  const kat = KATEGORIEN.find((k) => k.id === kategorie);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;

  if (!kat) {
    return (
      <Hintergrund>
        <SafeAreaView style={stile.inhalt}>
          <Kopfzeile titel="Unbekannte Kategorie" />
        </SafeAreaView>
      </Hintergrund>
    );
  }

  const gruppen = katalogGruppen(kat.id, naturraum);
  const mystery = mysteryArten(kat.id);
  const f = fortschrittDerKategorie(kat.id, gefunden, naturraum);

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett={`Reich ${kat.tag} · ${f.gefunden}/${f.gesamt}`} titel={kat.name} />

          <Stammbaum gruppen={gruppen} gefunden={gefunden} kategorieIcon={kat.icon} />

          <View style={stile.kopf}>
            <Schrift art="ueberschrift" style={{ color: colors.rare }} accessibilityRole="header">
              Mystery-Zone
            </Schrift>
            <Schrift art="etikett">sehr selten</Schrift>
          </View>
          <Schrift art="klein">
            Diese Arten zeigen sich nur als Rätsel, bis du sie findest. Nur fotografieren – nie stören oder pflücken.
          </Schrift>
          <View style={stile.raster}>
            {mystery.map((e, i) => (
              <MysteryKarte key={e.id} e={e} ok={e.id in gefunden} index={i} />
            ))}
          </View>

          <Knopf
            titel="Alle Mystery-Arten"
            untertitel="Die seltensten Arten aus allen vier Reichen"
            art="leise"
            onPress={() => router.push('/mystery')}
            style={{ marginTop: spacing.m }}
          />
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  kopf: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.l },
  raster: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.m },
});
