import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArtTaler } from '@/components/taler/ArtTaler';
import { Schrift } from '@/components/Schrift';
import { SELTENHEIT } from '@/data/spiel';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { colors, radius, spacing } from '@/theme/theme';

/** Verknüpfte Arten als antippbare Chips mit Miniatur (Mystery-Arten bleiben verborgen) */
export function ArtVerweise({
  ids,
  titel,
  sammlung,
}: {
  ids: string[];
  titel?: string;
  sammlung: Record<string, unknown>;
}) {
  if (ids.length === 0) return null;
  return (
    <View style={{ gap: spacing.s }}>
      {titel && <Schrift art="etikett">{titel}</Schrift>}
      <View style={stile.verweise}>
        {ids.map((vid) => {
          const e = katalogEintrag(vid);
          if (!e) return null;
          const versteckt = istVerborgen(vid, sammlung);
          const ok = vid in sammlung;
          const s = SELTENHEIT[e.seltenheit];
          return (
            <Pressable
              key={vid}
              onPress={() => router.push({ pathname: '/art/[id]', params: { id: vid } })}
              accessibilityRole="button"
              accessibilityLabel={versteckt ? 'Unbekannte Art' : e.name}
              style={({ pressed }) => [
                stile.verweis,
                { borderColor: ok ? s.farbe : colors.moss },
                pressed && { opacity: 0.6 },
              ]}
            >
              <ArtTaler
                id={e.id}
                seltenheit={e.seltenheit}
                zustand={ok ? 'gefunden' : versteckt ? 'verborgen' : 'umriss'}
                groesse={41}
                modell={e.modell}
                baumModell={e.baumModell}
              />
              <Schrift art="klein" style={{ color: ok ? colors.moon : colors.fog }}>
                {versteckt ? '???' : e.name}
              </Schrift>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  verweise: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  verweis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 3,
    borderRadius: radius.l,
    borderWidth: 1.2,
    backgroundColor: colors.forest,
  },
});
