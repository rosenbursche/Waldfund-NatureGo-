import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/theme';

/**
 * Schwebende Teilchen über einem Bild: Schnee, Pollen, fallendes Laub oder Glühwürmchen.
 * Feste Pseudo-Zufallswerte, damit das Bild bei jedem Öffnen gleich aussieht.
 * Bei „Bewegung reduzieren“ stehen die Teilchen still an ihrem Platz.
 */
export type PartikelArt = 'schnee' | 'pollen' | 'laub' | 'gluehen';

const EINSTELLUNG: Record<PartikelArt, { anzahl: number; farbe: string; groesse: [number, number]; dauer: number }> = {
  schnee: { anzahl: 34, farbe: colors.moon, groesse: [2, 5], dauer: 9000 },
  pollen: { anzahl: 22, farbe: colors.legend, groesse: [2, 3.5], dauer: 12000 },
  laub: { anzahl: 12, farbe: colors.eichel, groesse: [5, 8], dauer: 10000 },
  gluehen: { anzahl: 14, farbe: colors.rune, groesse: [2.5, 4], dauer: 7000 },
};

/** `hoehe`: Höhe der Fläche in Punkten (die Teilchen wandern über `transform`, damit es flüssig bleibt) */
export function Partikel({ art, ruhig, hoehe }: { art: PartikelArt; ruhig: boolean; hoehe: number }) {
  const e = EINSTELLUNG[art];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: e.anzahl }, (_, i) => (
        <Teilchen key={`${art}-${i}`} i={i} art={art} ruhig={ruhig} hoehe={hoehe} />
      ))}
    </View>
  );
}

function Teilchen({ i, art, ruhig, hoehe }: { i: number; art: PartikelArt; ruhig: boolean; hoehe: number }) {
  const e = EINSTELLUNG[art];
  const x = ((i * 37 + 11) % 100) / 100;
  const start = ((i * 53 + 7) % 100) / 100;
  const g = e.groesse[0] + (((i * 29) % 10) / 10) * (e.groesse[1] - e.groesse[0]);
  const dauer = e.dauer * (0.7 + ((i * 17) % 10) / 16);
  const [t] = useState(() => new Animated.Value(start));

  useEffect(() => {
    if (ruhig) return;
    // von der Startposition bis unten, danach in einer Endlosschleife von oben
    const erst = Animated.timing(t, {
      toValue: 1,
      duration: dauer * (1 - start),
      easing: Easing.linear,
      useNativeDriver: true,
    });
    const schleife = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(t, { toValue: 1, duration: dauer, easing: Easing.linear, useNativeDriver: true }),
      ]),
    );
    const ablauf = Animated.sequence([erst, schleife]);
    ablauf.start();
    return () => ablauf.stop();
  }, [ruhig, t, dauer, start]);

  const glueht = art === 'gluehen' || art === 'pollen';
  // Glühwürmchen und Pollen steigen langsam auf, Schnee und Laub fallen
  const yBereich = glueht ? [hoehe + 10, -10] : [-10, hoehe + 10];
  const seitlich = art === 'laub' ? 26 : art === 'schnee' ? 10 : 16;
  return (
    <Animated.View
      style={[
        stile.teilchen,
        {
          left: `${x * 100}%`,
          width: g,
          height: art === 'laub' ? g * 0.6 : g,
          borderRadius: art === 'laub' ? 1 : g,
          backgroundColor: e.farbe,
          opacity: art === 'schnee' ? 0.85 : 0.75,
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: yBereich }) },
            {
              translateX: t.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [0, seitlich, 0, -seitlich, 0],
              }),
            },
            {
              rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', art === 'laub' ? '540deg' : '0deg'] }),
            },
          ],
        },
        glueht && { shadowColor: e.farbe, shadowOpacity: 0.9, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } },
      ]}
    />
  );
}

const stile = StyleSheet.create({ teilchen: { position: 'absolute', top: 0 } });
