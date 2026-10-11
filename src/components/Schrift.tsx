import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts } from '@/theme/theme';

/**
 * Text mit festen Stilen aus dem Theme, damit alle Screens gleich aussehen.
 * Beispiel: <Schrift art="titel">Wildfund</Schrift>
 */
type Art = 'titel' | 'ueberschrift' | 'notiz' | 'text' | 'klein' | 'etikett';

export function Schrift({ art = 'text', style, ...rest }: TextProps & { art?: Art }) {
  return <Text style={[stile[art], style]} {...rest} />;
}

const stile = StyleSheet.create({
  titel: { fontFamily: fonts.handBold, fontSize: 44, lineHeight: 52, color: colors.moon },
  ueberschrift: { fontFamily: fonts.handBold, fontSize: 26, lineHeight: 32, color: colors.moon },
  notiz: { fontFamily: fonts.hand, fontSize: 19, lineHeight: 27, color: colors.amber },
  text: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.moon },
  klein: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.fog },
  etikett: { fontFamily: fonts.type, fontSize: 12, letterSpacing: 1.4, color: colors.fog, textTransform: 'uppercase' },
});
