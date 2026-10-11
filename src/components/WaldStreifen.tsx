import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type { HeimischerBaum } from '@/logic/regelEngine';
import { colors } from '@/theme/theme';

import { BaumSilhouette } from './BaumSilhouette';

/**
 * Eine Reihe Bäume, die nacheinander aus dem Boden "wachsen".
 * Hauptbaumarten erscheinen mehrfach und größer, Begleiter seltener und kleiner.
 */
const GROESSE = { haupt: 74, neben: 60, begleiter: 46 } as const;
const ANZAHL = { haupt: 3, neben: 2, begleiter: 1 } as const;

/** Mischt die Bäume so, dass gleiche Arten nicht nebeneinander stehen. */
function verteile(baeume: HeimischerBaum[]): HeimischerBaum[] {
  const liste = baeume.flatMap((b) => Array.from({ length: ANZAHL[b.rolle] }, () => b));
  // Feste "Zufalls"-Reihenfolge: in Sprüngen durch die Liste gehen. Die Sprungweite darf
  // keinen gemeinsamen Teiler mit der Länge haben, sonst würden Bäume doppelt kommen.
  const ggt = (a: number, b: number): number => (b === 0 ? a : ggt(b, a % b));
  const sprung = [7, 5, 3, 11, 13].find((s) => ggt(s, liste.length) === 1) ?? 1;
  return liste.map((_, i) => liste[(i * sprung) % liste.length]);
}

export function WaldStreifen({ baeume, max = 14 }: { baeume: HeimischerBaum[]; max?: number }) {
  const reihe = verteile(baeume).slice(0, max);
  return (
    <View style={stile.streifen} accessible accessibilityLabel={`Wald mit ${baeume.length} heimischen Baumarten`}>
      {reihe.map((b, i) => (
        <WachsenderBaum key={i} baum={b} index={i} />
      ))}
      <View style={stile.boden} />
    </View>
  );
}

function WachsenderBaum({ baum, index }: { baum: HeimischerBaum; index: number }) {
  const ruhig = useReducedMotion();
  const wachstum = useSharedValue(ruhig ? 1 : 0);

  useEffect(() => {
    if (ruhig) return;
    wachstum.value = withDelay(300 + index * 140, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.4)) }));
  }, [ruhig, index, wachstum]);

  const stil = useAnimatedStyle(() => ({
    opacity: Math.min(1, wachstum.value * 1.5),
    transform: [{ scaleY: wachstum.value }, { scaleX: 0.6 + wachstum.value * 0.4 }],
  }));

  const breite = GROESSE[baum.rolle] * baum.baumart.modell.hoehe;
  // Leicht versetzt nach oben/unten, damit Tiefe entsteht
  const tiefe = (index * 13) % 3;

  return (
    <Animated.View
      style={[
        { marginHorizontal: -breite * 0.18, marginBottom: tiefe * 6, zIndex: 3 - tiefe, transformOrigin: 'bottom' },
        stil,
      ]}
    >
      <BaumSilhouette modell={baum.baumart.modell} breite={breite} />
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  streifen: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 150,
    overflow: 'hidden',
  },
  boden: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 10,
    backgroundColor: colors.moss,
    opacity: 0.35,
    borderRadius: 5,
  },
});
