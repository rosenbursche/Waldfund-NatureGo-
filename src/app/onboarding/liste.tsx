import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { Icon } from '@/components/Icon';
import { NATURRAEUME } from '@/data/naturraeume';
import { GROSSLANDSCHAFT_NAME, type Grosslandschaft } from '@/data/typen';
import { colors, radius, spacing } from '@/theme/theme';

const REIHENFOLGE: Grosslandschaft[] = ['tiefland', 'mittelgebirge', 'alpenvorland', 'alpen'];

/** Onboarding: Naturraum direkt aus der Liste wählen, nach Großlandschaft gruppiert */
export default function Liste() {
  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett="Liste" titel="Naturraum wählen" />
          <Schrift art="klein">
            Demo-Version mit 10 Naturräumen. Weitere folgen, sobald die Daten fachlich geprüft sind.
          </Schrift>

          {REIHENFOLGE.map((gl) => {
            const raeume = NATURRAEUME.filter((n) => n.grosslandschaft === gl);
            if (raeume.length === 0) return null;
            return (
              <View key={gl} style={stile.gruppe}>
                <Schrift art="etikett" accessibilityRole="header">
                  {GROSSLANDSCHAFT_NAME[gl]}
                </Schrift>
                {raeume.map((n) => (
                  <Pressable
                    key={n.id}
                    onPress={() => router.push({ pathname: '/onboarding/ergebnis', params: { id: n.id, per: 'liste' } })}
                    accessibilityRole="button"
                    accessibilityLabel={n.name}
                    style={({ pressed }) => [stile.eintrag, pressed && { borderColor: colors.rune }]}
                  >
                    <Schrift art="text" style={{ flex: 1 }}>
                      {n.name}
                    </Schrift>
                    <Icon name="pfeil" groesse={18} farbe={colors.fog} />
                  </Pressable>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.m },
  gruppe: { gap: spacing.s, marginTop: spacing.s },
  eintrag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    minHeight: 52,
    paddingHorizontal: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
});
