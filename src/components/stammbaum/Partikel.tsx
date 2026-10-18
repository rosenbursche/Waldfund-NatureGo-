import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import type { Partikel as PartikelArt } from './baumStile';

/**
 * Schwebende Teilchen über dem Lebensbaum:
 * Blütenblätter und Federn sinken pendelnd herab, Sporen steigen auf, Glühwürmchen schwirren und blinken.
 * Bei "Bewegung reduzieren" gibt es keine Teilchen.
 */
type Props = { art: PartikelArt; breite: number; hoehe: number; farbe: string; anzahl?: number };

/** feste Pseudo-Zufallszahl je Teilchen (damit jedes Rendern gleich aussieht) */
const pz = (i: number, n: number) => {
  const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function Partikel({ art, breite, hoehe, farbe, anzahl = 12 }: Props) {
  const ruhig = useReducedMotion();
  if (ruhig) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: anzahl }, (_, i) => (
        <Teilchen key={i} i={i} art={art} breite={breite} hoehe={hoehe} farbe={farbe} />
      ))}
    </View>
  );
}

function Teilchen({
  i,
  art,
  breite,
  hoehe,
  farbe,
}: {
  i: number;
  art: PartikelArt;
  breite: number;
  hoehe: number;
  farbe: string;
}) {
  const t = useSharedValue(0);
  const dauer = (art === 'gluehwurm' ? 5000 : art === 'spore' ? 7000 : 9000) + pz(i, 1) * 5000;
  useEffect(() => {
    t.value = withDelay(pz(i, 2) * dauer, withRepeat(withTiming(1, { duration: dauer, easing: Easing.linear }), -1));
  }, [t, i, dauer]);

  const x0 = breite * (0.15 + pz(i, 3) * 0.7);
  const pendel = 10 + pz(i, 4) * 18;
  const groesse = art === 'feder' ? 12 : art === 'bluete' ? 5 : art === 'gluehwurm' ? 4 : 3;
  // vorher ausrechnen: im Animations-Thread (Worklet) darf keine normale Funktion wie pz() aufgerufen werden
  const hoehenAnteil = 0.35 + pz(i, 5) * 0.4;

  const stil = useAnimatedStyle(() => {
    const v = t.value;
    let x = x0;
    let y = 0;
    let o = 1;
    let dreh = 0;
    if (art === 'bluete' || art === 'feder') {
      // sinkt aus der Krone pendelnd zu Boden
      y = hoehe * (0.2 + v * 0.62);
      x = x0 + Math.sin(v * Math.PI * 4) * pendel;
      dreh = Math.sin(v * Math.PI * 4) * 40;
      o = v < 0.1 ? v * 10 : v > 0.85 ? (1 - v) / 0.15 : 1;
    } else if (art === 'spore') {
      // steigt vom Boden auf und verblasst
      y = hoehe * (0.78 - v * 0.6);
      x = x0 + Math.sin(v * Math.PI * 3) * pendel * 0.5;
      o = Math.sin(v * Math.PI) * 0.9;
    } else {
      // Glühwürmchen: schwirrt im Kreis und blinkt
      y = hoehe * hoehenAnteil + Math.sin(v * Math.PI * 2) * 14;
      x = x0 + Math.cos(v * Math.PI * 2) * pendel;
      const b = Math.max(0, Math.sin(v * Math.PI * 6));
      o = b * b;
    }
    return { opacity: o, transform: [{ translateX: x }, { translateY: y }, { rotate: `${dreh}deg` }] };
  });

  return (
    <Animated.View style={[stile.teilchen, stil]}>
      {art === 'feder' ? (
        <Svg width={groesse} height={groesse} viewBox="0 0 12 12">
          <Path
            d="M1 11 C3 7 6 3 11 1 C9 5 6 9 1 11 Z M1 11 L8 4"
            fill={farbe}
            stroke={farbe}
            strokeWidth={0.6}
            opacity={0.8}
          />
        </Svg>
      ) : (
        <View
          style={{
            width: groesse,
            height: art === 'bluete' ? groesse * 0.7 : groesse,
            borderRadius: groesse,
            backgroundColor: farbe,
            shadowColor: farbe,
            shadowOpacity: 1,
            shadowRadius: art === 'bluete' ? 0 : 6,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      )}
    </Animated.View>
  );
}

const stile = StyleSheet.create({ teilchen: { position: 'absolute', left: 0, top: 0 } });
