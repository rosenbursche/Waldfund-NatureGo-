import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { MysteryKarte } from '@/components/MysteryKarte';
import { Schrift } from '@/components/Schrift';
import { KATEGORIEN } from '@/data/spiel';
import { mysteryArten } from '@/logic/katalog';
import { useSammlung } from '@/store/sammlung';
import { spacing } from '@/theme/theme';

/** Mystery-Zone: die seltensten Arten aus allen vier Reichen */
export default function Mystery() {
  const gefunden = useSammlung((s) => s.gefunden);
  const alle = mysteryArten();
  const n = alle.filter((e) => e.id in gefunden).length;

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett={`Alle Reiche · ${n}/${alle.length}`} titel="Mystery-Zone" />
          <Schrift art="text">
            Die seltensten Arten Deutschlands. Lies das Rätsel, schau später auf die Karte – und geh suchen. Streng
            geschützte Arten nur fotografieren, nie stören oder pflücken. Bleib auf den Wegen.
          </Schrift>
          {KATEGORIEN.map((k) => (
            <View key={k.id} style={{ gap: spacing.s }}>
              <Schrift art="ueberschrift" accessibilityRole="header" style={{ marginTop: spacing.m }}>
                {k.name}
              </Schrift>
              <View style={stile.raster}>
                {mysteryArten(k.id).map((e, i) => (
                  <MysteryKarte key={e.id} e={e} ok={e.id in gefunden} index={i} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m, paddingBottom: spacing.xxl },
  raster: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.m },
});
