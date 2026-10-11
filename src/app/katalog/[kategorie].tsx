import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Hintergrund } from '@/components/Hintergrund';
import { Kopfzeile } from '@/components/Kopfzeile';
import { Schrift } from '@/components/Schrift';
import { artById } from '@/data/arten';
import type { KategorieId } from '@/data/artTypen';
import { baumById } from '@/data/baumarten';
import { naturraumById } from '@/data/naturraeume';
import { KATEGORIEN, MYSTERY_AB } from '@/data/spiel';
import { artIdsDerKategorie } from '@/logic/katalog';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';
import { colors, radius, spacing } from '@/theme/theme';

/**
 * Katalog einer Kategorie – vorläufige Liste.
 * In Phase 4 wird daraus der Stammbaum mit Mystery-Zone.
 */
export default function Katalog() {
  const { kategorie } = useLocalSearchParams<{ kategorie: KategorieId }>();
  const naturraumId = useEinstellungen((s) => s.naturraumId);
  const gefunden = useSammlung((s) => s.gefunden);
  const kat = KATEGORIEN.find((k) => k.id === kategorie);
  const naturraum = naturraumId ? naturraumById[naturraumId] : undefined;
  const ids = artIdsDerKategorie(kategorie, naturraum);

  return (
    <Hintergrund>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={stile.inhalt}>
          <Kopfzeile etikett={`Reich ${kat?.tag ?? ''}`} titel={kat?.name ?? 'Katalog'} />
          {ids.map((id) => {
            const art = artById[id];
            const ok = id in gefunden;
            const mystery = !ok && (art?.seltenheit ?? 1) >= MYSTERY_AB;
            const name = mystery ? '???' : (art?.name ?? baumById[id]?.name ?? id);
            return (
              <Pressable
                key={id}
                onPress={() => router.push({ pathname: '/art/[id]', params: { id } })}
                accessibilityRole="button"
                accessibilityLabel={`${name}, ${ok ? 'gesammelt' : 'noch offen'}`}
                style={[stile.zeile, ok && { borderColor: colors.rune }]}
              >
                <Schrift art="text" style={{ flex: 1, color: ok ? colors.moon : colors.fog }}>
                  {name}
                </Schrift>
                <Schrift art="etikett">{ok ? 'gesammelt' : mystery ? 'Mystery' : 'offen'}</Schrift>
              </Pressable>
            );
          })}
          <Schrift art="klein" style={{ marginTop: spacing.m }}>
            Der Stammbaum mit Mystery-Zone folgt in Phase 4.
          </Schrift>
        </ScrollView>
      </SafeAreaView>
    </Hintergrund>
  );
}

const stile = StyleSheet.create({
  inhalt: { padding: spacing.m, gap: spacing.s },
  zeile: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
});
