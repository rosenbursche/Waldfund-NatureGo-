import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { TierSymbol, type SymbolName } from './TierSymbol';

/**
 * Rahmen für einen Abschnitt der grafischen Tierseite: Symbol, kurzer Titel (1–2 Wörter)
 * und rechts ein Gesten-Hinweis (Hand tippt bzw. zieht) statt einer Erklärung in Worten.
 */
export function TierTafel({
  symbol,
  titel,
  geste,
  children,
}: {
  symbol: SymbolName;
  titel: string;
  geste?: 'tippen' | 'ziehen';
  children: ReactNode;
}) {
  return (
    <View style={stile.tafel}>
      {/* großes, kaum sichtbares Symbol als Wasserzeichen */}
      <View style={stile.wasserzeichen} pointerEvents="none">
        <TierSymbol name={symbol} groesse={170} farbe={colors.moon} dicke={0.8} />
      </View>
      <View style={stile.kopf} accessibilityRole="header">
        <View style={stile.siegel}>
          <TierSymbol name={symbol} groesse={20} farbe={colors.amber} />
        </View>
        <Schrift style={stile.titel}>{titel}</Schrift>
        {geste && (
          <View accessibilityLabel={geste === 'tippen' ? 'Antippen' : 'Ziehen'}>
            <TierSymbol name={geste} groesse={22} farbe={colors.fog} dicke={1.3} />
          </View>
        )}
      </View>
      {/* Zierlinie mit Rune in der Mitte */}
      <View style={stile.zier} pointerEvents="none">
        <View style={stile.zierLinie} />
        <View style={stile.zierRaute} />
        <View style={stile.zierLinie} />
      </View>
      {children}
    </View>
  );
}

/** Umschalter aus Symbol-Knöpfen (z. B. Bock / Ricke, Tag / Nacht) */
export function SymbolSchalter<T extends string>({
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
            style={[stile.schalterKnopf, an && stile.schalterAn]}
            onPress={() => onWahl(o.wert)}
            accessibilityRole="button"
            accessibilityState={{ selected: an }}
            accessibilityLabel={o.name}
          >
            <TierSymbol name={o.symbol} groesse={18} farbe={an ? colors.night : colors.fog} />
            <Schrift style={[stile.schalterText, an && { color: colors.night }]}>{o.name}</Schrift>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Pulsierender Leuchtpunkt zum Antippen (bei „Bewegung reduzieren“ ruhig) */
export function Leuchtpunkt({ an, ruhig, farbe = colors.amber }: { an: boolean; ruhig: boolean; farbe?: string }) {
  const [puls] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (ruhig) return;
    const schleife = Animated.loop(
      Animated.timing(puls, { toValue: 1, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    schleife.start();
    return () => schleife.stop();
  }, [ruhig, puls]);
  return (
    <View style={stile.punktRahmen} pointerEvents="none">
      {!ruhig && (
        <Animated.View
          style={[
            stile.punktWelle,
            {
              borderColor: farbe,
              opacity: puls.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
              transform: [{ scale: puls.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.8] }) }],
            },
          ]}
        />
      )}
      <View style={[stile.punkt, { borderColor: farbe }, an && { backgroundColor: farbe }]} />
    </View>
  );
}

type Melder = (x: number, y: number, breite: number, hoehe: number) => void;

/** Merkt sich Größe der Fläche und den aktuellen Empfänger – als Klasse, damit React nichts neu zeichnen muss */
class Finger {
  breite = 1;
  hoehe = 1;
  empfaenger: Melder = () => {};
  setzeGroesse(b: number, h: number) {
    this.breite = b;
    this.hoehe = h;
  }
  setzeEmpfaenger(m: Melder) {
    this.empfaenger = m;
  }
  melden(x: number, y: number) {
    this.empfaenger(x, y, this.breite, this.hoehe);
  }
}

/**
 * Fläche, die Finger-Positionen meldet (Tippen und Ziehen), z. B. für Uhr und Jahresrad.
 * Hält den Finger fest, damit die Seite beim Drehen nicht scrollt.
 */
export function Fingerflaeche({ onPunkt, style, label }: { onPunkt: Melder; style?: ViewStyle; label: string }) {
  const [finger] = useState(() => new Finger());
  useEffect(() => {
    finger.setzeEmpfaenger(onPunkt);
  });
  const [antwort] = useState(() => {
    const melden = (e: { nativeEvent: { locationX: number; locationY: number } }) =>
      finger.melden(e.nativeEvent.locationX, e.nativeEvent.locationY);
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: melden,
      onPanResponderMove: melden,
    });
  });
  return (
    <View
      style={[StyleSheet.absoluteFill, style]}
      onLayout={(e) => finger.setzeGroesse(e.nativeEvent.layout.width, e.nativeEvent.layout.height)}
      accessible
      accessibilityLabel={label}
      {...antwort.panHandlers}
    />
  );
}

const stile = StyleSheet.create({
  tafel: {
    // leicht durchscheinend: der gezeichnete Wald dahinter schimmert durch
    backgroundColor: `${colors.forest}E6`,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    padding: spacing.m,
    gap: spacing.m,
    overflow: 'hidden',
  },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  wasserzeichen: { position: 'absolute', right: -30, bottom: -30, opacity: 0.045 },
  zier: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -spacing.s },
  zierLinie: { flex: 1, height: 1, backgroundColor: colors.moss, opacity: 0.7 },
  zierRaute: { width: 7, height: 7, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: colors.amber },
  siegel: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  titel: { flex: 1, fontFamily: fonts.handBold, fontSize: 24, lineHeight: 30, color: colors.moon },
  schalter: { flexDirection: 'row', gap: spacing.s, alignSelf: 'center' },
  schalterKnopf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
  },
  schalterAn: { backgroundColor: colors.amber, borderColor: colors.amber },
  schalterText: { fontFamily: fonts.type, fontSize: 12, color: colors.fog, letterSpacing: 1 },
  punktRahmen: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  punktWelle: { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  punkt: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, backgroundColor: colors.night },
});
