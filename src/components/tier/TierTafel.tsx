import { useEffect, useState } from 'react';
import { Animated, Easing, PanResponder, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme/theme';

/**
 * Die Tierseiten benutzen die festen Bausteine aus `src/components/ui/`
 * (siehe docs/DESIGNSYSTEM.md). Die alten Namen bleiben als Verweis erhalten.
 */
export { Sektion as TierTafel } from '@/components/ui/Sektion';
export { Schalter as SymbolSchalter } from '@/components/ui/Schalter';

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
  punktRahmen: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  punktWelle: { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  punkt: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, backgroundColor: colors.night },
});
