import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, type ReactNode } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Schleier } from '@/components/ui/Schleier';
import { zufall } from '@/logic/lichtung';
import { farbMix } from '@/logic/tierJahr';
import { colors } from '@/theme/theme';

/**
 * Gezeichneter Nachtwald hinter der grafischen Tierseite, in Schichten:
 * Sternenhimmel mit Mond → ferner Höhenzug mit Baumkante → Waldsaum → Nebelband →
 * große Stämme am Rand → Glühwürmchen. Beim Scrollen wandern die Schichten unterschiedlich
 * schnell (Parallaxe): hinten langsam, vorne schneller. Bei „Bewegung reduzieren“ steht alles still.
 */
export function TierHintergrund({
  scroll,
  ruhig,
  children,
}: {
  scroll: Animated.Value;
  ruhig: boolean;
  children: ReactNode;
}) {
  const { width: b, height: h } = useWindowDimensions();
  const schichten = useMemo(() => zeichneSchichten(b, h), [b, h]);
  /** Verschiebung einer Schicht: Anteil der Scrollstrecke, höchstens `max` Punkte */
  const wandern = (anteil: number, max: number) =>
    ruhig
      ? undefined
      : {
          transform: [
            {
              translateY: scroll.interpolate({
                inputRange: [0, max / anteil],
                outputRange: [0, -max],
                extrapolate: 'clamp',
              }),
            },
          ],
        };

  return (
    <View style={stile.flaeche}>
      <LinearGradient
        colors={[colors.night, farbMix(colors.night, colors.forest, 0.6), colors.forest, colors.night]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[stile.schicht, wandern(0.03, h * 0.1)]} pointerEvents="none">
        {schichten.himmel}
      </Animated.View>
      <Animated.View style={[stile.schicht, wandern(0.08, h * 0.25)]} pointerEvents="none">
        {schichten.ferne}
      </Animated.View>
      <Animated.View style={[stile.schicht, wandern(0.14, h * 0.4)]} pointerEvents="none">
        {schichten.saum}
      </Animated.View>
      <Animated.View style={[stile.schicht, wandern(0.22, h * 0.6)]} pointerEvents="none">
        {schichten.nah}
      </Animated.View>
      <Schleier />
      {children}
    </View>
  );
}

/** Nadelbaum: übereinanderliegende, nach unten hängende Astetagen, oben spitz */
function nadelbaum(
  x: number,
  boden: number,
  hoehe: number,
  breite: number,
  rnd: () => number,
  farbe: string,
  k: number,
) {
  const etagen = 6;
  return (
    <G key={k}>
      <Rect x={x - breite * 0.05} y={boden - hoehe * 0.12} width={breite * 0.1} height={hoehe * 0.12} fill={farbe} />
      {Array.from({ length: etagen }, (_, e) => {
        const t = e / etagen;
        const y = boden - hoehe * 0.08 - t * hoehe * 0.78;
        const w = breite * (1 - t * 0.85) * (0.9 + rnd() * 0.2);
        const spitze = y - hoehe * 0.26;
        // Etage: breite, leicht hängende Unterkante, Spitze oben
        return (
          <Path
            key={e}
            d={`M${x - w} ${y} C${x - w * 0.6} ${y - hoehe * 0.04} ${x - w * 0.3} ${spitze + hoehe * 0.08} ${x} ${spitze} C${x + w * 0.3} ${spitze + hoehe * 0.08} ${x + w * 0.6} ${y - hoehe * 0.04} ${x + w} ${y} C${x + w * 0.5} ${y - hoehe * 0.02} ${x - w * 0.5} ${y - hoehe * 0.02} ${x - w} ${y} Z`}
            fill={farbe}
          />
        );
      })}
    </G>
  );
}

/** Laubbaum: Stamm und eine Krone aus mehreren Kreisen */
function laubbaum(
  x: number,
  boden: number,
  hoehe: number,
  breite: number,
  rnd: () => number,
  farbe: string,
  k: number,
) {
  const kronenMitte = boden - hoehe * 0.62;
  const kreise = Array.from({ length: 7 }, (_, i) => {
    const w = (i / 7) * Math.PI * 2 + rnd();
    return {
      cx: x + Math.cos(w) * breite * 0.3,
      cy: kronenMitte + Math.sin(w) * hoehe * 0.15,
      r: breite * (0.24 + rnd() * 0.1),
    };
  });
  return (
    <G key={k}>
      <Rect x={x - breite * 0.05} y={kronenMitte} width={breite * 0.1} height={boden - kronenMitte} fill={farbe} />
      <Circle cx={x} cy={kronenMitte} r={breite * 0.34} fill={farbe} />
      {kreise.map((c, i) => (
        <Circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={farbe} />
      ))}
    </G>
  );
}

/** Baut alle Schichten einmal für die Bildschirmgröße (feste Zufallsfolge → immer gleich) */
function zeichneSchichten(b: number, h: number) {
  const rnd = zufall(2024);
  const hoch = h * 1.7; // Schichten sind höher als der Bildschirm, damit beim Wandern nichts fehlt

  // Sterne und Mond
  const sterne = Array.from({ length: 90 }, () => ({
    x: rnd() * b,
    y: rnd() * h * 0.55,
    r: 0.4 + rnd() * 1.1,
    o: 0.25 + rnd() * 0.6,
  }));
  const himmel = (
    <Svg width={b} height={hoch}>
      <Defs>
        <RadialGradient id="mondhof" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.moon} stopOpacity={0.35} />
          <Stop offset="0.4" stopColor={colors.moon} stopOpacity={0.08} />
          <Stop offset="1" stopColor={colors.moon} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {sterne.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={colors.moon} opacity={s.o} />
      ))}
      <Ellipse cx={b * 0.78} cy={h * 0.13} rx={b * 0.32} ry={b * 0.32} fill="url(#mondhof)" />
      <Circle cx={b * 0.78} cy={h * 0.13} r={b * 0.055} fill={colors.moon} opacity={0.92} />
      {/* Mondflecken */}
      <Circle cx={b * 0.765} cy={h * 0.123} r={b * 0.012} fill={colors.fog} opacity={0.5} />
      <Circle cx={b * 0.795} cy={h * 0.138} r={b * 0.008} fill={colors.fog} opacity={0.45} />
    </Svg>
  );

  // Ferner Höhenzug mit feiner Baumkante
  const fernFarbe = farbMix(colors.forest, colors.fog, 0.18);
  const kammY = (x: number) => h * 0.42 + Math.sin((x / b) * 5.2) * h * 0.035 + Math.sin((x / b) * 13) * h * 0.012;
  let kamm = `M0 ${hoch} L0 ${kammY(0)}`;
  for (let x = 0; x <= b; x += 4) kamm += ` L${x} ${kammY(x) - (rnd() < 0.5 ? 0 : 3 + rnd() * 8)}`;
  kamm += ` L${b} ${hoch} Z`;
  const ferne = (
    <Svg width={b} height={hoch}>
      <Path d={kamm} fill={fernFarbe} opacity={0.75} />
    </Svg>
  );

  // Waldsaum: Reihe aus Nadel- und Laubbäumen
  const saumFarbe = farbMix(colors.night, colors.forest, 0.55);
  const saumBoden = h * 0.62;
  const saum = (
    <Svg width={b} height={hoch}>
      {/* hintere, hellere Reihe und vordere, dunklere Reihe */}
      {Array.from({ length: Math.ceil(b / 26) + 2 }, (_, i) => {
        const x = i * 26 - 6 + rnd() * 12;
        const hoehe = h * (0.1 + rnd() * 0.06);
        const farbe = farbMix(saumFarbe, colors.fog, 0.12);
        return rnd() < 0.5
          ? nadelbaum(x, saumBoden - h * 0.02, hoehe, hoehe * 0.26, rnd, farbe, 1000 + i)
          : laubbaum(x, saumBoden - h * 0.02, hoehe * 0.85, hoehe * 0.6, rnd, farbe, 1000 + i);
      })}
      <Rect x={0} y={saumBoden - h * 0.025} width={b} height={hoch} fill={saumFarbe} />
      {Array.from({ length: Math.ceil(b / 34) + 2 }, (_, i) => {
        const x = i * 34 - 10 + rnd() * 14;
        const hoehe = h * (0.13 + rnd() * 0.09);
        return rnd() < 0.55
          ? nadelbaum(x, saumBoden, hoehe, hoehe * 0.28, rnd, saumFarbe, i)
          : laubbaum(x, saumBoden, hoehe * 0.85, hoehe * 0.6, rnd, saumFarbe, i);
      })}
      {/* Nebelband vor dem Waldsaum */}
      <Defs>
        <RadialGradient id="nebelband" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.fog} stopOpacity={0.14} />
          <Stop offset="1" stopColor={colors.fog} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={b * 0.4} cy={saumBoden} rx={b * 0.9} ry={h * 0.06} fill="url(#nebelband)" />
      <Ellipse cx={b * 0.9} cy={saumBoden + h * 0.05} rx={b * 0.6} ry={h * 0.05} fill="url(#nebelband)" />
    </Svg>
  );

  // Nah: große Stämme am Rand, Farn am Boden, Glühwürmchen
  const nahFarbe = colors.night;
  const stamm = (x: number, breite: number, neigung: number) =>
    `M${x - breite / 2} ${hoch} C${x - breite / 2 + neigung} ${h * 0.6} ${x - breite * 0.35 + neigung} ${h * 0.2} ${x - breite * 0.3 + neigung * 1.4} -10 L${x + breite * 0.3 + neigung * 1.4} -10 C${x + breite * 0.35 + neigung} ${h * 0.2} ${x + breite / 2 + neigung} ${h * 0.6} ${x + breite / 2} ${hoch} Z`;
  const gluehen = Array.from({ length: 26 }, () => ({ x: rnd() * b, y: h * (0.5 + rnd() * 1.1), r: 1 + rnd() * 1.6 }));
  const nah = (
    <Svg width={b} height={hoch}>
      <Defs>
        <RadialGradient id="gluehen" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.amber} stopOpacity={0.9} />
          <Stop offset="1" stopColor={colors.amber} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Path d={stamm(-4, b * 0.2, 8)} fill={nahFarbe} />
      <Path
        d={`M0 ${h * 0.34} C${b * 0.08} ${h * 0.33} ${b * 0.14} ${h * 0.3} ${b * 0.2} ${h * 0.26}`}
        stroke={nahFarbe}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path d={stamm(b + 8, b * 0.24, -10)} fill={nahFarbe} />
      <Path
        d={`M${b} ${h * 0.52} C${b * 0.92} ${h * 0.5} ${b * 0.86} ${h * 0.47} ${b * 0.8} ${h * 0.42}`}
        stroke={nahFarbe}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Moos auf den Stämmen */}
      <Path
        d={`M${b * 0.02} ${h * 0.95} C${b * 0.05} ${h * 0.9} ${b * 0.05} ${h * 0.8} ${b * 0.03} ${h * 0.72}`}
        stroke={colors.moss}
        strokeWidth={3}
        opacity={0.5}
        strokeLinecap="round"
      />
      <Path
        d={`M${b * 0.95} ${h * 1.1} C${b * 0.92} ${h * 1.0} ${b * 0.92} ${h * 0.9} ${b * 0.94} ${h * 0.8}`}
        stroke={colors.moss}
        strokeWidth={3}
        opacity={0.5}
        strokeLinecap="round"
      />
      {gluehen.map((g, i) => (
        <G key={i}>
          <Circle cx={g.x} cy={g.y} r={g.r * 5} fill="url(#gluehen)" opacity={0.35} />
          <Circle cx={g.x} cy={g.y} r={g.r * 0.7} fill={colors.amber} opacity={0.9} />
        </G>
      ))}
    </Svg>
  );

  return { himmel, ferne, saum, nah };
}

const stile = StyleSheet.create({
  flaeche: { flex: 1, backgroundColor: colors.night },
  schicht: { position: 'absolute', top: 0, left: 0, right: 0 },
});
