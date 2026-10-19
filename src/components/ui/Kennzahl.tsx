import { StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { colors, fonts } from '@/theme/theme';

/**
 * Kennzahl: große Zahl in Cinzel, kleine Einheit daneben, Etikett darunter.
 * Für Maße, Gewicht, Punkte, Fortschritt („12 / 48“).
 */
export function Kennzahl({
  wert,
  einheit,
  etikett,
  farbe = colors.moon,
  ausrichtung = 'links',
}: {
  wert: string;
  einheit?: string;
  etikett: string;
  farbe?: string;
  ausrichtung?: 'links' | 'mitte';
}) {
  const mitte = ausrichtung === 'mitte';
  return (
    <View
      style={[stile.kennzahl, mitte && { alignItems: 'center' }]}
      accessible
      accessibilityLabel={`${etikett}: ${wert}${einheit ? ` ${einheit}` : ''}`}
    >
      <View style={stile.zeile}>
        <Schrift style={[stile.wert, { color: farbe }]} numberOfLines={1} adjustsFontSizeToFit>
          {wert}
        </Schrift>
        {einheit && <Schrift style={stile.einheit}>{einheit}</Schrift>}
      </View>
      <Schrift art="etikett" style={stile.etikett}>
        {etikett}
      </Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  kennzahl: { gap: 0 },
  zeile: { flexDirection: 'row', alignItems: 'baseline', gap: 4, maxWidth: '100%' },
  wert: { flexShrink: 1, fontFamily: fonts.titel, fontSize: 26, lineHeight: 32, fontVariant: ['tabular-nums'] },
  einheit: { fontFamily: fonts.body, fontSize: 14, color: colors.fog },
  etikett: { fontSize: 10, letterSpacing: 1.6 },
});
