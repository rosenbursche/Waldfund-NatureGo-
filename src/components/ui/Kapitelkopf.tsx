import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { colors, fonts, spacing } from '@/theme/theme';

/**
 * Kapitelkopf: oben ein gesperrtes Etikett zwischen zwei kurzen Linien,
 * darunter der Titel in Cinzel und (optional) eine Unterzeile, z. B. der lateinische Name.
 * „gross“ für den Namen im Hero einer Seite, „normal“ für Überschriften innerhalb einer Seite.
 */
export function Kapitelkopf({
  etikett,
  titel,
  unter,
  groesse = 'normal',
  style,
}: {
  etikett?: string;
  titel: string;
  unter?: string;
  groesse?: 'gross' | 'normal';
  style?: ViewStyle;
}) {
  const gross = groesse === 'gross';
  return (
    <View style={[stile.kopf, style]}>
      {etikett && (
        <View style={stile.etikettZeile}>
          <View style={stile.strich} />
          <Schrift art="etikett" style={stile.etikett}>
            {etikett}
          </Schrift>
          <View style={stile.strich} />
        </View>
      )}
      <Schrift
        accessibilityRole="header"
        maxFontSizeMultiplier={1.2}
        adjustsFontSizeToFit
        numberOfLines={gross ? 2 : 3}
        style={[stile.titel, gross && stile.titelGross]}
      >
        {titel}
      </Schrift>
      {unter && <Schrift style={stile.unter}>{unter}</Schrift>}
    </View>
  );
}

const stile = StyleSheet.create({
  kopf: { gap: 2 },
  etikettZeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s, marginBottom: 2 },
  strich: { width: 18, height: 1, backgroundColor: colors.amber, opacity: 0.8 },
  etikett: { color: colors.moon, opacity: 0.85 },
  titel: { fontFamily: fonts.titel, fontSize: 26, lineHeight: 32, letterSpacing: 1.2, color: colors.moon },
  titelGross: {
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 2,
    // weicher Schein, damit der Name auch auf hellen Fotos lesbar bleibt
    textShadowColor: colors.night,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 2 },
  },
  unter: { fontFamily: fonts.notiz, fontSize: 17, lineHeight: 22, color: colors.fog },
});
