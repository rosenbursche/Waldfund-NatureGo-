import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { Kennzahl } from '@/components/ui/Kennzahl';
import type { TierSeite } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * „Wie schnell? Wie gefährlich?“ im Kapitel Erkunden (alle Zahlen belegt, siehe tier.quellen):
 * - Kennzahlen (z. B. Tempo auf der Flucht, Länge der Hauer)
 * - Einschätzung der Gefahr für Menschen, dazu antippbare Situationen „Gefährlich wird es, wenn …“
 * - Zahlen (Wildunfälle, Todesfälle) und „So verhältst du dich richtig“
 */
export function GefahrTempo({ tier }: { tier: TierSeite }) {
  const g = tier.gefahrMensch;
  const [offen, setOffen] = useState<number | null>(null);
  if (!tier.kennzahlen?.length && !g) return null;
  return (
    <View style={stile.flaeche}>
      {tier.kennzahlen && tier.kennzahlen.length > 0 && (
        <View style={stile.raster}>
          {tier.kennzahlen.map((k) => (
            <View key={k.etikett} style={stile.kachel}>
              <Kennzahl wert={k.wert} einheit={k.einheit} etikett={k.etikett} farbe={colors.amber} />
            </View>
          ))}
        </View>
      )}

      {g && (
        <View style={stile.gefahr}>
          <View style={stile.kopf}>
            <TierSymbol name="stopp" groesse={22} farbe={colors.warn} />
            <Schrift style={stile.titel}>Wie gefährlich?</Schrift>
          </View>
          <Schrift style={stile.urteil}>{g.urteil}</Schrift>

          {g.wann.length > 0 && (
            <>
              <Schrift art="etikett" style={{ color: colors.warn }}>
                Gefährlich wird es, wenn …
              </Schrift>
              <View style={stile.chips}>
                {g.wann.map((w, i) => (
                  <Pressable
                    key={w.titel}
                    onPress={() => setOffen(offen === i ? null : i)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: offen === i }}
                    style={[stile.chip, offen === i && stile.chipAn]}
                  >
                    <Schrift style={[stile.chipText, offen === i && { color: colors.night }]}>{w.titel}</Schrift>
                  </Pressable>
                ))}
              </View>
              {offen !== null && <Schrift style={stile.erklaerung}>{g.wann[offen].text}</Schrift>}
            </>
          )}

          {g.zahlen.length > 0 && (
            <View style={stile.raster}>
              {g.zahlen.map((z) => (
                <View key={z.etikett} style={stile.kachel}>
                  <Kennzahl wert={z.wert} einheit={z.einheit} etikett={z.etikett} farbe={colors.warn} />
                </View>
              ))}
            </View>
          )}

          {g.verhalten.length > 0 && (
            <View style={stile.verhalten}>
              <Schrift art="etikett" style={{ color: colors.rune }}>
                So verhältst du dich richtig
              </Schrift>
              {g.verhalten.map((v) => (
                <View key={v} style={stile.zeile}>
                  <TierSymbol name="schild" groesse={16} farbe={colors.rune} />
                  <Schrift style={stile.zeileText}>{v}</Schrift>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const stile = StyleSheet.create({
  flaeche: { gap: spacing.m, paddingHorizontal: spacing.m },
  raster: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  kachel: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: spacing.s + 2,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    backgroundColor: colors.sektion,
  },
  gefahr: {
    gap: spacing.s + 2,
    padding: spacing.m,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: `${colors.warn}66`,
    backgroundColor: colors.abgrund,
  },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  titel: { fontFamily: fonts.titel, fontSize: 19, letterSpacing: 1.2, color: colors.moon },
  urteil: { fontFamily: fonts.notiz, fontSize: 19, lineHeight: 25, color: colors.moon },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: `${colors.warn}88`,
  },
  chipAn: { backgroundColor: colors.warn, borderColor: colors.warn },
  chipText: { fontFamily: fonts.body, fontSize: 14.5, color: colors.warn },
  erklaerung: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 22, color: colors.moon },
  verhalten: { gap: 6, marginTop: spacing.xs },
  zeile: { flexDirection: 'row', gap: spacing.s, alignItems: 'flex-start' },
  zeileText: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, lineHeight: 21, color: colors.moon },
});
