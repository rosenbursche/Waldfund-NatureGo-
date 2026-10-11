import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme/theme';

import { Schrift } from './Schrift';
import { Symbol } from './Symbol';

/** Kopfzeile für Unterseiten: Zurück-Knopf, kleines Etikett und Überschrift. */
export function Kopfzeile({ titel, etikett }: { titel: string; etikett?: string }) {
  return (
    <View style={stile.zeile}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Zurück"
        hitSlop={8}
        style={({ pressed }) => [stile.zurueck, pressed && { opacity: 0.6 }]}
      >
        <Symbol name="zurueck" groesse={20} />
      </Pressable>
      <View style={{ flex: 1 }}>
        {etikett && <Schrift art="etikett">{etikett}</Schrift>}
        <Schrift art="ueberschrift" accessibilityRole="header">
          {titel}
        </Schrift>
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, marginBottom: spacing.m },
  zurueck: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
