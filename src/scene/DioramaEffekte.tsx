import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { Punkt } from '@/data/szenen';
import { colors } from '@/theme/theme';

/**
 * Bewegte Effekte über den Bildebenen des Dioramas – alles aus Code, nicht im Bild:
 * Glühwürmchen, Nebelbänke, Schornsteinrauch, flackerndes Fensterlicht, glitzernder Tümpel,
 * Mondstrahlen. Koordinaten sind Bildpixel × Maßstab (m), also relativ zur jeweiligen Ebene.
 *
 * `laeuft` = false (Seite verdeckt oder "Bewegung reduzieren"): Effekte stehen still.
 */
type Basis = { m: number; laeuft: boolean };

/** fester Zufall: jedes Glühwürmchen bekommt immer dieselbe Bahn */
function zufallsFolge(saat: number) {
  let s = saat;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Endlosschleife 0 → 1 → 0 mit eigener Dauer und Verzögerung; stoppt, wenn `laeuft` false wird */
function useSchleife(laeuft: boolean, dauer: number, verzoegerung = 0, hinUndZurueck = true) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!laeuft) {
      cancelAnimation(t);
      return;
    }
    t.set(
      withDelay(
        verzoegerung,
        withRepeat(withTiming(1, { duration: dauer, easing: Easing.inOut(Easing.sin) }), -1, hinUndZurueck),
      ),
    );
    return () => cancelAnimation(t);
  }, [laeuft, dauer, verzoegerung, hinUndZurueck, t]);
  return t;
}

// ---------- Glühwürmchen ----------

function Gluehwuermchen({ x, y, m, laeuft, nr }: Basis & Punkt & { nr: number }) {
  const z = zufallsFolge(nr * 97 + 13);
  const dauer = 3200 + z() * 3000;
  const weite = (30 + z() * 50) * m;
  const flug = useSchleife(laeuft, dauer, z() * 2000);
  const blink = useSchleife(laeuft, 900 + z() * 1400, z() * 1500);
  const richtung = z() > 0.5 ? 1 : -1;
  const stil = useAnimatedStyle(() => {
    const f = flug.get();
    return {
      opacity: 0.25 + 0.75 * blink.get(),
      transform: [{ translateX: richtung * weite * (f - 0.5) }, { translateY: -weite * 0.6 * Math.sin(f * Math.PI) }],
    };
  });
  const r = Math.max(5, 9 * m);
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: x * m - r, top: y * m - r }, stil]}>
      <View style={{ width: r * 2, height: r * 2, borderRadius: r, backgroundColor: '#F4E3A1', opacity: 0.18 }} />
      <View style={[stile.kern, { left: r - 2, top: r - 2 }]} />
    </Animated.View>
  );
}

export function GluehwuermchenSchwarm({
  bereich,
  anzahl,
  m,
  laeuft,
}: Basis & { bereich: { x1: number; y1: number; x2: number; y2: number }; anzahl: number }) {
  const z = zufallsFolge(42);
  const orte = Array.from({ length: 24 }, () => ({
    x: bereich.x1 + z() * (bereich.x2 - bereich.x1),
    y: bereich.y1 + z() * (bereich.y2 - bereich.y1),
  })).slice(0, anzahl);
  return (
    <>
      {orte.map((o, i) => (
        <Gluehwuermchen key={i} nr={i} x={o.x} y={o.y} m={m} laeuft={laeuft} />
      ))}
    </>
  );
}

// ---------- Nebelbänke ----------

export function Nebelbank({
  y,
  farbe,
  dichte,
  m,
  laeuft,
  nr,
}: Basis & { y: number; farbe: string; dichte: number; nr: number }) {
  const t = useSchleife(laeuft, 26000 + nr * 7000, 0);
  const breite = 1024 * m;
  const hoehe = (90 + nr * 30) * m;
  const stil = useAnimatedStyle(() => ({
    transform: [{ translateX: (nr % 2 === 0 ? 1 : -1) * (t.get() - 0.5) * breite * 0.25 }],
  }));
  // 0,02 (klar) … 0,08 (dicht) → Deckkraft 0,2 … 0,65
  const deckkraft = Math.min(0.65, Math.max(0.2, 0.05 + dichte * 7.5));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: -breite * 0.25,
          top: y * m - hoehe / 2,
          width: breite * 1.5,
          height: hoehe,
          opacity: deckkraft,
        },
        stil,
      ]}
    >
      <LinearGradient
        colors={[`${farbe}00`, `${farbe}99`, `${farbe}00`]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </Animated.View>
  );
}

// ---------- Rauch aus dem Schornstein ----------

function Rauchwolke({ x, y, m, laeuft, nr }: Basis & Punkt & { nr: number }) {
  const t = useSchleife(laeuft, 6000, nr * 1200, false);
  const r = 16 * m;
  const stil = useAnimatedStyle(() => {
    const f = t.get();
    return {
      opacity: f < 0.15 ? (f / 0.15) * 0.32 : 0.32 * (1 - (f - 0.15) / 0.85),
      transform: [{ translateX: f * f * 60 * m }, { translateY: -f * 190 * m }, { scale: 0.6 + f * 2.2 }],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x * m - r,
          top: y * m - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          backgroundColor: '#B8C2BE',
        },
        stil,
      ]}
    />
  );
}

export function Rauch({ ort, m, laeuft }: Basis & { ort: Punkt }) {
  if (!laeuft) return null; // stehender Rauch sähe falsch aus
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <Rauchwolke key={i} nr={i} x={ort.x} y={ort.y} m={m} laeuft={laeuft} />
      ))}
    </>
  );
}

// ---------- weiches Leuchten (Fenster, Mond, Runen) ----------

/** Runder Lichthof mit weichem Rand (SVG-Verlauf, funktioniert auf iOS und Android gleich) */
export function Lichthof({ groesse, farbe, staerke = 1 }: { groesse: number; farbe: string; staerke?: number }) {
  const id = `hof-${farbe.replace('#', '')}`;
  return (
    <Svg width={groesse} height={groesse} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={farbe} stopOpacity={0.55 * staerke} />
          <Stop offset="0.45" stopColor={farbe} stopOpacity={0.18 * staerke} />
          <Stop offset="1" stopColor={farbe} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width={groesse} height={groesse} fill={`url(#${id})`} />
    </Svg>
  );
}

export function Fensterlicht({ ort, staerke, m, laeuft }: Basis & { ort: Punkt; staerke: number }) {
  const flacker = useSchleife(laeuft, 380, 0);
  const langsam = useSchleife(laeuft, 2300, 0);
  const g = 220 * m;
  const stil = useAnimatedStyle(() => ({ opacity: staerke * (0.7 + 0.18 * langsam.get() + 0.12 * flacker.get()) }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: ort.x * m - g / 2, top: ort.y * m - g / 2 }, stil]}
    >
      <Lichthof groesse={g} farbe={colors.amber} />
    </Animated.View>
  );
}

// ---------- Tümpel ----------

function Glitzer({ x, y, breite, m, laeuft, nr }: Basis & Punkt & { breite: number; nr: number }) {
  const t = useSchleife(laeuft, 1800 + nr * 700, nr * 400);
  const stil = useAnimatedStyle(() => ({
    opacity: 0.1 + 0.45 * t.get(),
    transform: [{ translateX: (t.get() - 0.5) * 14 * m }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: (x - breite / 2) * m,
          top: y * m,
          width: breite * m,
          height: Math.max(1.5, 2.5 * m),
          borderRadius: 2,
          backgroundColor: colors.moon,
        },
        stil,
      ]}
    />
  );
}

export function TuempelGlitzern({ ort, m, laeuft }: Basis & { ort: Punkt & { rx: number; ry: number } }) {
  const streifen = [
    { dx: -0.3, dy: -0.35, b: 0.35 },
    { dx: 0.15, dy: -0.05, b: 0.5 },
    { dx: -0.1, dy: 0.3, b: 0.3 },
    { dx: 0.4, dy: 0.25, b: 0.22 },
  ];
  return (
    <>
      {streifen.map((s, i) => (
        <Glitzer
          key={i}
          nr={i}
          x={ort.x + s.dx * ort.rx}
          y={ort.y + s.dy * ort.ry}
          breite={s.b * ort.rx}
          m={m}
          laeuft={laeuft}
        />
      ))}
    </>
  );
}

// ---------- Mondstrahlen ----------

function Strahl({
  ort,
  winkel,
  laenge,
  m,
  laeuft,
  nr,
  staerke,
}: Basis & { ort: Punkt; winkel: number; laenge: number; nr: number; staerke: number }) {
  const t = useSchleife(laeuft, 7000 + nr * 2500, nr * 1500);
  const breite = (70 + nr * 25) * m;
  const stil = useAnimatedStyle(() => ({ opacity: staerke * (0.35 + 0.65 * t.get()) }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: ort.x * m - breite / 2,
          top: ort.y * m,
          width: breite,
          height: laenge * m,
          transformOrigin: 'top',
          transform: [{ rotate: `${winkel}deg` }],
        },
        stil,
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id={`strahl-${nr}`} cx="50%" cy="0%" r="100%">
            <Stop offset="0" stopColor={colors.moon} stopOpacity={0.16} />
            <Stop offset="1" stopColor={colors.moon} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Path d="M45 0 L55 0 L100 100 L0 100 Z" fill={`url(#strahl-${nr})`} />
      </Svg>
    </Animated.View>
  );
}

export function Mondstrahlen({ ort, staerke, m, laeuft }: Basis & { ort: Punkt; staerke: number }) {
  return (
    <>
      {[
        { w: 28, l: 900 },
        { w: 40, l: 1000 },
        { w: 52, l: 850 },
      ].map((s, i) => (
        <Strahl key={i} nr={i} ort={ort} winkel={s.w} laenge={s.l} m={m} laeuft={laeuft} staerke={staerke} />
      ))}
    </>
  );
}

const stile = StyleSheet.create({
  kern: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF6C8' },
});
