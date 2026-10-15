import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { SELTENHEIT } from '@/data/spiel';
import { baumForm, seedAus, sternPfad, type Punkt } from '@/logic/baumForm';
import type { KatalogEintrag, Lebensbaum as LebensbaumDaten } from '@/logic/katalog';
import { colors, fonts } from '@/theme/theme';

import { Schrift } from '../Schrift';

/**
 * Der Lebensbaum einer Kategorie – mystisch wie ein alter Wappenbaum:
 * - Hauptäste = Gruppen. An der Astspitze sitzt ein Knopf mit dem Fortschritt; antippen öffnet den Ast.
 * - Sterne über der Krone = die seltensten Arten. Matt mit "?", bis man sie findet – dann leuchten sie.
 * - Schattenwurzeln unter der Erde = "Gefährlich & tödlich".
 * - Runenring: leuchtet anteilig mit dem Fortschritt der ganzen Kategorie.
 * Beim Öffnen zoomt der Baum sanft auf den gewählten Ast.
 */

/** Kennung für die Schattenwurzeln (statt eines Astnamens) */
export const WURZELN = '__wurzeln__';

type Props = {
  kategorie: string;
  baum: LebensbaumDaten;
  gefunden: Record<string, unknown>;
  /** Name des offenen Asts, WURZELN oder null */
  offen: string | null;
  onWaehle: (ziel: string | null) => void;
};

const AnimierteEllipse = Animated.createAnimatedComponent(Ellipse);
const KNOPF = 36;

export function Lebensbaum({ kategorie, baum, gefunden, offen, onWaehle }: Props) {
  const ruhig = useReducedMotion();
  const [breite, setBreite] = useState(0);
  const W = breite || 360;
  const form = useMemo(
    () => baumForm(W, baum.aeste.length, baum.sterne.length, seedAus(kategorie)),
    [W, baum.aeste.length, baum.sterne.length, kategorie],
  );
  const H = form.hoehe;

  const alle = [...baum.aeste.flatMap((a) => a.eintraege), ...baum.sterne, ...baum.wurzeln];
  const anzahlGefunden = alle.filter((e) => e.id in gefunden).length;
  const runenAn = alle.length ? Math.round((form.runen.length * anzahlGefunden) / alle.length) : 0;

  // --- Zoom auf den offenen Ast ---
  const astIndex = baum.aeste.findIndex((a) => a.name === offen);
  const fokus: Punkt | null = offen === WURZELN ? form.wurzelPlatz : astIndex >= 0 ? form.astSpitzen[astIndex] : null;
  const zoom = useSharedValue(0);
  const fx = useSharedValue(W / 2);
  const fy = useSharedValue(H / 2);
  useEffect(() => {
    const dauer = ruhig ? 0 : 650;
    const weich = { duration: dauer, easing: Easing.inOut(Easing.cubic) };
    if (fokus) {
      fx.value = zoom.value === 0 ? fokus.x : withTiming(fokus.x, weich);
      fy.value = zoom.value === 0 ? fokus.y : withTiming(fokus.y, weich);
      zoom.value = withTiming(1, weich);
    } else {
      zoom.value = withTiming(0, weich);
    }
  }, [fokus, ruhig, zoom, fx, fy]);
  const zoomStil = useAnimatedStyle(() => {
    const z = zoom.value;
    const s = 1 + 0.32 * z;
    const px = fx.value - W / 2;
    const py = fy.value - H / 2;
    // der Fokuspunkt wandert nach unten in die Mitte – dort wächst gleich der geöffnete Ast weiter
    return {
      transform: [
        { translateX: (1 - z) * px - s * px },
        { translateY: z * H * 0.3 + (1 - z) * py - s * py },
        { scale: s },
      ],
    };
  });

  // --- Augen im Astloch: öffnen sich ab und zu ---
  const augen = useSharedValue(ruhig ? 0.35 : 0);
  useEffect(() => {
    if (ruhig) return;
    augen.value = withRepeat(
      withSequence(
        withDelay(5200, withTiming(1, { duration: 500 })),
        withDelay(1600, withTiming(0.15, { duration: 90 })),
        withTiming(1, { duration: 110 }),
        withDelay(900, withTiming(0, { duration: 600 })),
      ),
      -1,
    );
  }, [ruhig, augen]);
  const augenProps = useAnimatedProps(() => ({ ry: W * 0.0045 * augen.value }));

  return (
    <View
      style={{ height: H, overflow: 'hidden' }}
      onLayout={(e) => setBreite(e.nativeEvent.layout.width)}
      accessibilityLabel={`Lebensbaum: ${anzahlGefunden} von ${alle.length} Arten gefunden`}
    >
      <Animated.View style={[{ width: W, height: H }, zoomStil]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient
              id="holz"
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={form.boden + 10}
              x2={0}
              y2={form.mitte.y - form.ringRadius * 0.6}
            >
              <Stop offset={0} stopColor={colors.moss} />
              <Stop offset={0.3} stopColor={colors.fog} />
              <Stop offset={1} stopColor={colors.moon} />
            </LinearGradient>
            <RadialGradient
              id="schein"
              gradientUnits="userSpaceOnUse"
              cx={form.mitte.x}
              cy={form.mitte.y - W * 0.08}
              r={form.ringRadius}
            >
              <Stop offset={0} stopColor={colors.moon} stopOpacity={0.16} />
              <Stop offset={1} stopColor={colors.moon} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="astSchein">
              <Stop offset={0} stopColor={colors.rune} stopOpacity={0.55} />
              <Stop offset={1} stopColor={colors.rune} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="glut">
              <Stop offset={0} stopColor={colors.blut} stopOpacity={0.6} />
              <Stop offset={1} stopColor={colors.blut} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Mondschein hinter dem Baum */}
          <Circle cx={form.mitte.x} cy={form.mitte.y - W * 0.08} r={form.ringRadius} fill="url(#schein)" />

          {/* Runenring */}
          {form.runen.map((r, i) => (
            <Path
              key={i}
              d={r.d}
              transform={`translate(${r.x} ${r.y}) rotate(${r.winkel})`}
              stroke={i < runenAn ? colors.rune : colors.fog}
              strokeWidth={1.4}
              strokeLinecap="round"
              fill="none"
              opacity={i < runenAn ? 0.95 : 0.3}
            />
          ))}

          {/* Erdboden als Nebelband, darunter die Schattenwurzeln */}
          <Ellipse cx={W / 2} cy={form.boden + 4} rx={W * 0.32} ry={7} fill={colors.fog} opacity={0.07} />
          <Circle cx={form.wurzelPlatz.x} cy={form.wurzelPlatz.y} r={W * 0.16} fill="url(#glut)" />
          <Path d={form.schatten} fill={colors.blut} opacity={0.5} />

          {/* Leuchten hinter dem offenen Ast */}
          {fokus && offen !== WURZELN && <Circle cx={fokus.x} cy={fokus.y} r={W * 0.13} fill="url(#astSchein)" />}

          {/* Holz, Rinde, Ranken, Moos */}
          <Path d={form.holz} fill="url(#holz)" />
          <Path d={form.rinde} stroke={colors.night} strokeWidth={1} fill="none" opacity={0.35} />
          <Path
            d={form.ranken}
            stroke={colors.moon}
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />
          <Path d={form.bart} fill={colors.moss} opacity={0.8} />
          {form.moos.map((m, i) => (
            <Ellipse key={i} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill={colors.moss} opacity={0.7} />
          ))}

          {/* Astloch mit Augen */}
          <G>
            <Ellipse
              cx={form.augen.x}
              cy={form.augen.y}
              rx={W * 0.02}
              ry={W * 0.008}
              fill={colors.night}
              opacity={0.3}
            />
            {[-1, 1].map((s) => (
              <AnimierteEllipse
                key={s}
                cx={form.augen.x + s * W * 0.009}
                cy={form.augen.y}
                rx={W * 0.0045}
                fill={colors.amber}
                animatedProps={augenProps}
              />
            ))}
          </G>
        </Svg>

        {/* Sterne */}
        {baum.sterne.map((e, i) => (
          <SternKnopf key={e.id} e={e} punkt={form.sternPlaetze[i]} ok={e.id in gefunden} index={i} />
        ))}

        {/* Astspitzen */}
        {baum.aeste.map((a, i) => {
          const n = a.eintraege.filter((e) => e.id in gefunden).length;
          return (
            <AstKnopf
              key={a.name}
              name={a.name}
              gefunden={n}
              gesamt={a.eintraege.length}
              punkt={form.astSpitzen[i]}
              aktiv={offen === a.name}
              gedimmt={offen !== null && offen !== a.name}
              onPress={() => onWaehle(offen === a.name ? null : a.name)}
            />
          );
        })}

        {/* Schattenwurzeln */}
        <AstKnopf
          name="Schattenwurzeln"
          gefunden={baum.wurzeln.filter((e) => e.id in gefunden).length}
          gesamt={baum.wurzeln.length}
          punkt={form.wurzelPlatz}
          aktiv={offen === WURZELN}
          gedimmt={offen !== null && offen !== WURZELN}
          gefahr
          onPress={() => onWaehle(offen === WURZELN ? null : WURZELN)}
        />
      </Animated.View>
    </View>
  );
}

function AstKnopf({
  name,
  gefunden,
  gesamt,
  punkt,
  aktiv,
  gedimmt,
  gefahr,
  onPress,
}: {
  name: string;
  gefunden: number;
  gesamt: number;
  punkt: Punkt;
  aktiv: boolean;
  gedimmt: boolean;
  gefahr?: boolean;
  onPress: () => void;
}) {
  const voll = gesamt > 0 && gefunden === gesamt;
  const farbe = gefahr ? colors.blut : voll ? colors.legend : gefunden > 0 ? colors.rune : colors.fog;
  const zahl = gefahr && gesamt === 0 ? '☠' : `${gefunden}/${gesamt}`;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ expanded: aktiv }}
      accessibilityLabel={
        gefahr
          ? `Schattenwurzeln: Gefährlich und tödlich, ${gefunden} von ${gesamt} gefunden`
          : `Ast ${name}, ${gefunden} von ${gesamt} gefunden`
      }
      style={({ pressed }) => [
        stile.astKnopf,
        { left: punkt.x - 70, top: punkt.y - KNOPF / 2, opacity: gedimmt ? 0.4 : pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          stile.kugel,
          {
            borderColor: farbe,
            shadowColor: farbe,
            shadowOpacity: aktiv || voll ? 0.9 : 0.45,
            backgroundColor: aktiv ? colors.forest : colors.night,
          },
        ]}
      >
        <Schrift style={[stile.zahl, { color: farbe }]}>{zahl}</Schrift>
      </View>
      <Schrift style={[stile.astName, aktiv && { color: colors.moon }]} numberOfLines={2}>
        {name}
      </Schrift>
    </Pressable>
  );
}

function SternKnopf({ e, punkt, ok, index }: { e: KatalogEintrag; punkt: Punkt; ok: boolean; index: number }) {
  const ruhig = useReducedMotion();
  const s = SELTENHEIT[e.seltenheit];
  const funkeln = useSharedValue(1);
  useEffect(() => {
    if (ruhig || !ok) return;
    funkeln.value = withDelay(
      index * 700,
      withRepeat(withTiming(0.55, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [ruhig, ok, index, funkeln]);
  const funkelStil = useAnimatedStyle(() => ({ opacity: funkeln.value }));
  const G2 = 46;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={
        ok
          ? `Stern: ${e.name}, ${s.name}, gesammelt`
          : `Unbekannter Stern, ${s.name}, ${s.punkte} Punkte. Rätsel ansehen`
      }
      style={({ pressed }) => [stile.stern, { left: punkt.x - 45, top: punkt.y - G2 / 2 }, pressed && { opacity: 0.6 }]}
    >
      <Animated.View style={funkelStil}>
        <Svg width={G2} height={G2}>
          <Defs>
            <RadialGradient id={`stern${index}`}>
              <Stop offset={0} stopColor={s.farbe} stopOpacity={ok ? 0.65 : 0.12} />
              <Stop offset={1} stopColor={s.farbe} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={G2 / 2} cy={G2 / 2} r={G2 / 2} fill={`url(#stern${index})`} />
          <Path
            d={sternPfad(G2 / 2, G2 / 2, ok ? 11 : 9, ok ? 4.6 : 3.8)}
            fill={ok ? s.farbe : 'none'}
            stroke={ok ? s.farbe : colors.fog}
            strokeWidth={1.2}
            opacity={ok ? 1 : 0.6}
          />
        </Svg>
      </Animated.View>
      {ok && (
        <Schrift style={[stile.sternName, { color: s.farbe }]} numberOfLines={1}>
          {e.name}
        </Schrift>
      )}
    </Pressable>
  );
}

const stile = StyleSheet.create({
  astKnopf: { position: 'absolute', width: 140, alignItems: 'center' },
  kugel: {
    width: KNOPF,
    height: KNOPF,
    borderRadius: KNOPF / 2,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  zahl: { fontFamily: fonts.type, fontSize: 11 },
  astName: {
    maxWidth: 132,
    fontFamily: fonts.handBold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.fog,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: colors.night,
    textShadowRadius: 6,
  },
  stern: { position: 'absolute', width: 90, alignItems: 'center' },
  sternName: { fontFamily: fonts.type, fontSize: 9.5, marginTop: -6, textAlign: 'center' },
});
