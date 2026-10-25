import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { NATURRAEUME } from '@/data/naturraeume';
import { naechsterNaturraum, vergroebern } from '@/logic/geo';
import { sucheOrte, type OrtEintrag, type Treffer } from '@/logic/ortsuche';
import { colors, fonts, radius, spacing } from '@/theme/theme';

// Die Ortsliste ist groß (ca. 19.000 Einträge). Sie wird erst geladen, wenn dieser Screen öffnet.
let ORTE: OrtEintrag[] | null = null;
function orte(): OrtEintrag[] {
  if (!ORTE) ORTE = (require('@/data/orte.json') as { orte: OrtEintrag[] }).orte;
  return ORTE;
}

/** Onboarding: Ort oder Postleitzahl suchen – komplett offline */
export default function Suche() {
  const [eingabe, setEingabe] = useState('');
  const treffer = useMemo(() => sucheOrte(eingabe, orte()), [eingabe]);

  function waehle(t: Treffer) {
    const { naturraum, km } = naechsterNaturraum(t.lon, t.lat, NATURRAEUME);
    // nur grob gerundet (ca. 10 km) – für den Standort-Punkt auf der Karte
    const grob = vergroebern(t.lon, t.lat);
    router.push({
      pathname: '/onboarding/ergebnis',
      params: {
        id: naturraum.id,
        per: 'suche',
        km: String(Math.round(km)),
        ort: t.ort,
        glon: String(grob.lon),
        glat: String(grob.lat),
      },
    });
  }

  return (
    <Hintergrund>
      <SafeAreaView style={stile.flaeche}>
        <Kopfzeile etikett="Suche" titel="Ort oder PLZ" />
        <TextInput
          value={eingabe}
          onChangeText={setEingabe}
          placeholder="z. B. Bispingen oder 29646"
          placeholderTextColor={colors.fog}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Ort oder Postleitzahl eingeben"
          style={stile.eingabe}
        />
        <FlatList
          data={treffer}
          keyExtractor={(t) => `${t.plz}-${t.ort}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingVertical: spacing.s }}
          ListEmptyComponent={
            eingabe.length >= 2 ? (
              <Schrift art="klein" style={{ marginTop: spacing.m }}>
                Nichts gefunden. Prüf die Schreibweise oder versuch die Postleitzahl.
              </Schrift>
            ) : undefined
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => waehle(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.ort}, ${item.plz}`}
              style={({ pressed }) => [stile.zeile, pressed && { backgroundColor: colors.forest }]}
            >
              <Schrift art="text" style={{ flex: 1 }}>
                {item.ort}
              </Schrift>
              <Schrift art="etikett">{item.plz}</Schrift>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={stile.trenner} />}
        />
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  flaeche: { flex: 1, padding: spacing.m },
  eingabe: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.moon,
    backgroundColor: colors.forest,
    borderWidth: 1.5,
    borderColor: colors.moss,
    borderRadius: radius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m - 2,
  },
  zeile: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.s,
    borderRadius: radius.s,
  },
  trenner: { height: 1, backgroundColor: colors.moss, opacity: 0.4 },
});
