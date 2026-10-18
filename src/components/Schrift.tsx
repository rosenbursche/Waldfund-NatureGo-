import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts } from '@/theme/theme';

/**
 * Text mit festen Stilen aus dem Theme, damit alle Screens gleich aussehen.
 * Beispiel: <Schrift art="titel">Wildfund</Schrift>
 */
type Art = 'titel' | 'ueberschrift' | 'notiz' | 'text' | 'klein' | 'etikett';

export function Schrift({ art = 'text', style, ...rest }: TextProps & { art?: Art }) {
  // Systemschriftgröße wird beachtet, aber auf das 1,5-Fache begrenzt, damit nichts überläuft
  return <Text maxFontSizeMultiplier={art === 'titel' ? 1.25 : 1.5} style={[stile[art], style]} {...rest} />;
}

const stile = StyleSheet.create({
  titel: { fontFamily: fonts.titel, fontSize: 34, lineHeight: 42, letterSpacing: 1.5, color: colors.moon },
  ueberschrift: { fontFamily: fonts.titelLeicht, fontSize: 21, lineHeight: 28, letterSpacing: 0.8, color: colors.moon },
  notiz: { fontFamily: fonts.notiz, fontSize: 18, lineHeight: 25, color: colors.amber },
  text: { fontFamily: fonts.body, fontSize: 16.5, lineHeight: 24, color: colors.moon },
  klein: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.fog },
  etikett: {
    fontFamily: fonts.etikett,
    fontSize: 11.5,
    letterSpacing: 2,
    color: colors.fog,
    textTransform: 'uppercase',
  },
});
