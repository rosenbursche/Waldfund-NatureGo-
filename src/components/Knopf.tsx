import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Schrift } from './Schrift';
import { Icon, type IconArt } from './Icon';

/**
 * Knopf im Laternen-Stil (fester Baustein, siehe docs/DESIGNSYSTEM.md).
 * - "haupt": mit Laternenlicht gefüllt, dunkle Schrift – nur EINMAL pro Screen, für die wichtigste Aktion
 * - "leise": dunkel mit Moos-Rahmen, für Nebenaktionen
 * Titel in Cinzel (gesperrt), Untertitel in Alegreya Sans.
 */
type Props = {
  titel: string;
  untertitel?: string;
  symbol?: IconArt;
  art?: 'haupt' | 'leise';
  onPress: () => void;
  deaktiviert?: boolean;
  style?: ViewStyle;
};

export function Knopf({ titel, untertitel, symbol, art = 'haupt', onPress, deaktiviert, style }: Props) {
  const haupt = art === 'haupt';
  return (
    <Pressable
      onPress={onPress}
      disabled={deaktiviert}
      accessibilityRole="button"
      accessibilityLabel={untertitel ? `${titel}. ${untertitel}` : titel}
      accessibilityState={{ disabled: deaktiviert }}
      style={({ pressed }) => [
        stile.knopf,
        haupt ? stile.haupt : stile.leise,
        pressed && stile.gedrueckt,
        deaktiviert && stile.aus,
        style,
      ]}
    >
      {symbol && (
        <View style={[stile.symbol, haupt && stile.symbolHaupt]}>
          <Icon name={symbol} farbe={haupt ? colors.night : colors.rune} />
        </View>
      )}
      <View style={stile.texte}>
        <Schrift style={[stile.titel, haupt && { color: colors.night }]}>{titel}</Schrift>
        {untertitel && (
          <Schrift art="klein" style={haupt ? { color: colors.night, opacity: 0.75 } : undefined}>
            {untertitel}
          </Schrift>
        )}
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  knopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: 56,
    paddingVertical: spacing.m - 2,
    paddingHorizontal: spacing.m + 2,
    borderRadius: radius.m,
    borderWidth: 1,
  },
  haupt: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
    // weiches Laternenleuchten statt harter Glow-Kante
    shadowColor: colors.amber,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  leise: { backgroundColor: colors.sektion, borderColor: `${colors.moss}AA` },
  gedrueckt: { transform: [{ scale: 0.98 }], opacity: 0.85 },
  aus: { opacity: 0.45 },
  symbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolHaupt: { borderColor: `${colors.night}55` },
  texte: { flex: 1, gap: 2 },
  titel: { fontFamily: fonts.titel, fontSize: 14.5, lineHeight: 20, letterSpacing: 1.6, color: colors.moon },
});
