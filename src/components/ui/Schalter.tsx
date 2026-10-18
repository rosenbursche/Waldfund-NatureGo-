import { Pressable, StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { TierSymbol, type SymbolName } from '@/components/tier/TierSymbol';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Schalter aus Symbol-Knöpfen (z. B. Bock / Ricke, Tag / Nacht, Sommer / Winter).
 * Die gewählte Option ist mit Laternenlicht gefüllt, die anderen bleiben dunkel.
 */
export function Schalter<T extends string>({
  wahl,
  optionen,
  onWahl,
}: {
  wahl: T;
  optionen: { wert: T; symbol: SymbolName; name: string }[];
  onWahl: (w: T) => void;
}) {
  return (
    <View style={stile.schalter}>
      {optionen.map((o) => {
        const an = o.wert === wahl;
        return (
          <Pressable
            key={o.wert}
            style={({ pressed }) => [stile.knopf, an && stile.an, pressed && { opacity: 0.7 }]}
            onPress={() => onWahl(o.wert)}
            accessibilityRole="button"
            accessibilityState={{ selected: an }}
            accessibilityLabel={o.name}
          >
            <TierSymbol name={o.symbol} groesse={17} farbe={an ? colors.night : colors.fog} />
            <Schrift style={[stile.text, an && { color: colors.night }]}>{o.name}</Schrift>
          </Pressable>
        );
      })}
    </View>
  );
}

const stile = StyleSheet.create({
  schalter: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 3,
    gap: 3,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    backgroundColor: colors.night,
  },
  knopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.m - 4,
    paddingVertical: 7,
    borderRadius: radius.s + 1,
  },
  an: {
    backgroundColor: colors.amber,
    shadowColor: colors.amber,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  text: {
    fontFamily: fonts.etikett,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.4,
    color: colors.fog,
    textTransform: 'uppercase',
  },
});
