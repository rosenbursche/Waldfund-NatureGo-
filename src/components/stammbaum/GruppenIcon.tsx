import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Gruselig-schöne Symbole für die Knöpfe im Lebensbaum – handgezeichnete Linien,
 * dazu glimmende Augen, die langsam pulsieren (bei "Bewegung reduzieren" ruhig).
 * Zeichenfläche 32 × 32.
 */
type Teil = { d: string; art: 'linie' | 'flaeche' } | { auge: [number, number, number] };

const k = (x: number, y: number, r: number): Teil => ({ auge: [x, y, r] });
const l = (d: string): Teil => ({ d, art: 'linie' });
const f = (d: string): Teil => ({ d, art: 'flaeche' });

export const SCHATTENWURZELN = 'Schattenwurzeln';

const ICONS: Record<string, Teil[]> = {
  // toter, knorriger Baum mit Gesicht im Stamm
  Bäume: [
    l('M14 29 C14 24 13.5 21 15 17 C13 14 9 13 6 9 M15 17 C17 13 21 12 25 7 M15.5 16 C16 12 15 9 16 4'),
    l('M18 29 C17.6 24 18 21 17 17 M10 11 C9 9 9 7 10 5 M21 10.5 C23 9 25 9 27 10 M16 8 C17.5 7 18.5 6 19 4'),
    l('M10 29 C12.5 28 14 27.5 14.2 26 M22 29 C19.5 28 18 27.5 17.8 26'),
    l('M15.2 24.2 Q16 25.4 16.8 24.2'),
    k(15.1, 21.2, 0.8),
    k(17, 21.2, 0.8),
  ],
  // Dornenranke mit blutigen Beeren
  Büsche: [
    l('M4 27 C8 19 14 14 20 12 C24 11 27 8 28 5 M8 28 C12 23 18 20.5 26 20.5 M16 28.5 C16 22 19 17 23 15'),
    l(
      'M9.2 20 l-2.4 -0.8 M13 16.3 l-1.4 -2 M19 13 l-0.4 -2.2 M14 22.2 l-1.2 2 M21 20.6 l1 2 M18.4 21.4 l-2.2 0.8 M24.5 9.8 l1.8 1 M20.5 16.5 l-2 -0.6',
    ),
    k(25, 15, 1.1),
    k(11, 25, 1),
    k(27.5, 18.5, 0.9),
  ],
  // Schneeglöckchen wie Laternen – in den Blüten glimmt etwas
  Frühblüher: [
    l('M16 29.5 C16 22 17 15 20 9.5 C21 7.6 23 6.4 24 7.2'),
    l(
      'M24 7.2 C21 9 20.8 14 22 16.2 L26 16.2 C27.2 14 27 9 24 7.2 Z M22 16.2 L21.4 18.4 M24 16.2 L24 18.8 M26 16.2 L26.6 18.4',
    ),
    l(
      'M16 22.5 C14 18.5 11 15.5 8 14.4 M8 14.4 C6 15.4 5.6 19 6.4 21.2 L9.6 21.2 C10.4 19 10 15.4 8 14.4 Z M6.4 21.2 L6 23 M9.6 21.2 L10 23',
    ),
    l('M16 29.5 C13 25 11.5 21 12.2 16 M16 29.5 C18 26 20 24 21.5 23'),
    k(24, 13.6, 1.1),
    k(8, 18.6, 0.9),
  ],
  // Farnspirale mit Auge im Herzen
  'Waldboden & Wiese': [
    l('M12 29.5 C12 22 13 16 17 12 C20 9 24 10 24 13 C24 16 20 17 19 14.2 C18.6 12.6 20.6 12.2 21 13.6'),
    l('M12.1 25 l-4.2 -2 M12.4 21 l-4.2 -2.8 M13.6 17 l-3.2 -3.6 M12.8 24 l3.4 -1.2 M13.2 20 l3.2 -2'),
    l('M22 29.5 C22 25.5 24 22.5 26 22.5 C28 22.5 28.2 25.2 26.3 25.2 M5 29.5 C5.5 27 6.5 25.5 8 25'),
    k(20.9, 13.5, 0.9),
  ],
  // Fliegenpilz, dessen Stiel zurückschaut
  Blätterpilze: [
    l('M4.5 15.5 C5.5 8 11 5 16 5 C21 5 26.5 8 27.5 15.5 Q16 13 4.5 15.5 Z'),
    l('M9 15 L13 17.4 M13 14.4 L14.8 17.4 M19 14.4 L17.2 17.4 M23 15 L19 17.4'),
    l('M13.8 17.4 C13.4 22 13 26 12 29.5 L20 29.5 C19 26 18.6 22 18.2 17.4'),
    f(
      'M11 9.6 a1.3 1.3 0 1 0 0.01 0 Z M19.5 8 a1 1 0 1 0 0.01 0 Z M23.4 11.2 a0.9 0.9 0 1 0 0.01 0 Z M7.8 12.6 a0.8 0.8 0 1 0 0.01 0 Z',
    ),
    l('M14.6 25.6 Q16 26.6 17.4 25.6'),
    k(14.7, 21.6, 0.9),
    k(17.3, 21.6, 0.9),
  ],
  // dicker Röhrling mit Grinsen
  Röhrlinge: [
    l('M3.5 15 C3.5 8 10 5 16 5 C22 5 28.5 8 28.5 15 C22 17.4 10 17.4 3.5 15 Z'),
    f(
      'M8.5 16.4 a0.6 0.6 0 1 0 0.01 0 Z M12 17 a0.6 0.6 0 1 0 0.01 0 Z M16 17.2 a0.6 0.6 0 1 0 0.01 0 Z M20 17 a0.6 0.6 0 1 0 0.01 0 Z M23.5 16.4 a0.6 0.6 0 1 0 0.01 0 Z',
    ),
    l('M11 17.4 C9 22 9 27 11 29.5 L21 29.5 C23 27 23 22 21 17.4'),
    l('M13 25.6 Q14.5 27.6 16 26.2 Q17.5 27.6 19 25.6 M14.3 26.4 L14.6 27.3 M17.7 26.4 L17.4 27.3'),
    l('M7 10.5 Q10 7.5 14 7'),
    k(13.6, 21.8, 1),
    k(18.4, 21.8, 1),
  ],
  // Pilz-Tentakel mit Augen an den Spitzen
  'Besondere Formen': [
    l('M16 29.5 C16 24 15 22 13 19 C11 16 8 15 7 11 C6.6 9 8 8 9 9'),
    l('M16 29.5 C17 24 18 21 21 18 C23 16 26 14 25 10.2 C24.7 8.6 23 8.6 23 10'),
    l('M15.4 23 C15 17 16 12 15 6.6 C14.8 5 17 4.6 17 6.2'),
    l('M12 29.5 C11 27 9 26 6.5 26.5 M20 29.5 C21 27.5 23 27 25.5 27.5'),
    k(9, 9.2, 1),
    k(23, 10.2, 1),
    k(16.6, 6, 1),
  ],
  // Krähe mit glühendem Auge
  Singvögel: [
    l(
      'M5 23 C7 17 12 14 17.5 14 L21 11.4 C23 10.2 25.2 10.6 26 12.2 L29.5 13.4 L26.2 14.4 C26.2 17.5 24 20.4 20 21.4 L12 22.4 Z',
    ),
    l('M12 22.4 L4 26 M12 22.4 L5 27.8 M14 18 C16 17 19 17 21.5 18.5'),
    l('M15.5 22 L15 25.6 M18.5 21.6 L18.6 25.6 M2.5 25.8 L29.5 25.8'),
    k(23.6, 12.6, 0.9),
  ],
  // Specht vor einem Baumloch, aus dem ein Auge späht
  Spechte: [
    l('M3.5 2.5 L3.5 29.5 M10.5 2.5 L10.5 29.5 M4.5 20 L9.5 21 M4 25 L8 24.4'),
    l('M7 9.5 C5.4 9.5 5.2 14.5 7 14.5 C8.8 14.5 8.6 9.5 7 9.5 Z'),
    l('M27 9 C27 6 24 5 21 6 C19 7 18 9 18 11 L12 13 L18 14 C18 18 20 22 22 27 M27 9 C28.2 13 27.2 18 26 23'),
    l('M21 6 C22 4 25 3 27.4 5'),
    k(7, 12, 0.85),
    k(22.6, 9, 0.85),
  ],
  // Mond über dem Wasser – Augen schauen aus den Wellen
  'Am Wasser': [
    l('M23 3.5 A6 6 0 1 0 27.5 13 A5 5 0 1 1 23 3.5 Z'),
    l(
      'M2.5 22 Q5.5 20 8.5 22 T14.5 22 T20.5 22 T26.5 22 T30 21.6 M4.5 26.5 Q7.5 24.5 10.5 26.5 T16.5 26.5 T22.5 26.5 T28.5 26.5',
    ),
    l('M7 22 L6 9 M9.5 22 L10.4 11.5 M6 9 C5 10.5 5 13 6.2 14 M10.4 11.5 C11.4 13 11.4 15 10.2 16'),
    k(17.2, 19.6, 0.75),
    k(19.8, 19.6, 0.75),
  ],
  // Eulengesicht
  Eulen: [
    l('M8 9.5 L9.6 4 L13 8 M24 9.5 L22.4 4 L19 8'),
    l('M8 9.5 C5 15 7 25 16 28.5 C25 25 27 15 24 9.5 C20 7.4 12 7.4 8 9.5 Z'),
    l('M12 11.4 a3.6 3.6 0 1 0 0.01 0 Z M20 11.4 a3.6 3.6 0 1 0 0.01 0 Z M16 17.2 L15 20 L16 21.6 L17 20 Z'),
    l('M11 23 L12 24 M14.5 24.4 L15.2 25.4 M18 24.2 L17.2 25.3 M21 23 L20 24'),
    k(12, 15, 1.4),
    k(20, 15, 1.4),
  ],
  // einsamer, toter Baum auf dem Hügel unter dem Mond
  Offenland: [
    l('M2 27 Q16 17 30 27'),
    l('M20.5 21.8 L20.5 11.5 M20.5 15.5 L17 12 M20.5 14 L24 10.4 M17 12 L16.4 9.6 M24 10.4 L26 10'),
    l('M9 6 a3.2 3.2 0 1 0 0.01 0 Z'),
    l('M5 27 l0.6 -2.4 M7.5 25.6 l0.2 -2.2 M26 25.4 l0.4 -2.2'),
    k(11.6, 24.4, 0.65),
    k(13.6, 24.4, 0.65),
  ],
  // Hirschschädel mit Geweih
  Wald: [
    l('M12 14 C12 10.6 20 10.6 20 14 L19 21 C18 25.4 14 25.4 13 21 Z'),
    l(
      'M13 13 C10 10 8 8 7 3 M9 8.4 L4.8 7.2 M7.8 5.4 L4.8 3 M19 13 C22 10 24 8 25 3 M23 8.4 L27.2 7.2 M24.2 5.4 L27.2 3',
    ),
    l('M15.3 21 L16 22.6 L16.7 21 M14 23.4 L14.6 24.4 M18 23.4 L17.4 24.4'),
    l('M12 14 L9.5 15.5 M20 14 L22.5 15.5'),
    k(14.5, 16.2, 1.15),
    k(17.5, 16.2, 1.15),
  ],
  // Hase mit leuchtendem Auge unter dem Mond
  'Feld & Garten': [
    l(
      'M8 27.5 C6 22 9 18 14 18 C16 14 17 11 16 6 C15.6 4 17 3.6 18 5 C19 8 19 11 19 13 C19.6 9 21 5 22.6 5 C24 5 23.6 9 21 14 C23 15 24 17 23 19 L19 20 C20 23 20 26 18 27.5 Z',
    ),
    l('M23 19 L24.2 19.6 M3 28 L29 28'),
    l('M28 3.5 A3.4 3.4 0 1 0 29.4 9.4 A2.8 2.8 0 1 1 28 3.5 Z'),
    k(20.6, 16.2, 0.85),
  ],
  // Totenkopf, durch den Wurzeln wachsen
  [SCHATTENWURZELN]: [
    l('M9 13 C9 6 23 6 23 13 C23 16 21 17 21 19 L11 19 C11 17 9 16 9 13 Z'),
    l('M12 19 L12 22 L20 22 L20 19 M14 19 L14 22 M16 19 L16 22 M18 19 L18 22 M16 15 L15 17.2 L17 17.2 Z'),
    l(
      'M12 22 C10 25 7 26 4 29.5 M16 22 C16.5 25 15.5 27 16 29.5 M20 22 C22 25 25 26 28 29.5 M9.2 12 C6 11.5 4 9.5 3 6.5 M22.8 12 C26 11.5 28 9.5 29 6.5',
    ),
    k(13, 13, 1.7),
    k(19, 13, 1.7),
  ],
};

/** Ersatz, falls eine Gruppe (noch) kein eigenes Symbol hat: ein Runenauge */
const ERSATZ: Teil[] = [l('M3.5 16 Q16 5.5 28.5 16 Q16 26.5 3.5 16 Z M16 5 L16 8 M16 24 L16 27'), k(16, 16, 2.6)];

export function hatIcon(name: string) {
  return name in ICONS;
}

export function GruppenIcon({
  name,
  farbe,
  augenFarbe,
  groesse = 26,
  phase = 0,
}: {
  name: string;
  farbe: string;
  augenFarbe: string;
  groesse?: number;
  /** Versatz des Pulsierens, damit nicht alle Augen gleichzeitig glimmen */
  phase?: number;
}) {
  const ruhig = useReducedMotion();
  const teile = ICONS[name] ?? ERSATZ;
  const linien = teile.filter((t): t is { d: string; art: 'linie' | 'flaeche' } => 'd' in t);
  const augen = teile.filter((t): t is { auge: [number, number, number] } => 'auge' in t);

  const glimmen = useSharedValue(1);
  useEffect(() => {
    if (ruhig) return;
    glimmen.value = withDelay(
      phase * 450,
      withRepeat(
        withSequence(
          withTiming(0.35, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          // ab und zu ein Blinzeln
          withTiming(0.05, { duration: 90 }),
          withTiming(1, { duration: 140 }),
        ),
        -1,
      ),
    );
  }, [ruhig, phase, glimmen]);
  const glimmStil = useAnimatedStyle(() => ({ opacity: glimmen.value }));

  return (
    <View style={{ width: groesse, height: groesse }} pointerEvents="none">
      <Svg width={groesse} height={groesse} viewBox="0 0 32 32">
        {linien.map((t, i) =>
          t.art === 'linie' ? (
            <Path
              key={i}
              d={t.d}
              stroke={farbe}
              strokeWidth={1.35}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <Path key={i} d={t.d} fill={farbe} />
          ),
        )}
        {augen.map(({ auge: [x, y, r] }, i) => (
          <Circle key={i} cx={x} cy={y} r={r * 0.55} fill={augenFarbe} opacity={0.5} />
        ))}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, glimmStil]}>
        <Svg width={groesse} height={groesse} viewBox="0 0 32 32">
          {augen.map(({ auge: [x, y, r] }, i) => (
            <Circle key={`h${i}`} cx={x} cy={y} r={r * 2.4} fill={augenFarbe} opacity={0.22} />
          ))}
          {augen.map(({ auge: [x, y, r] }, i) => (
            <Circle key={i} cx={x} cy={y} r={r} fill={augenFarbe} />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}
