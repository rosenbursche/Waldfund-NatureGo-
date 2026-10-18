import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';

import { SELTENHEIT } from '@/data/spiel';
import type { KatalogEintrag } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { ArtMiniatur } from './ArtMiniatur';
import { Schrift } from './Schrift';

/**
 * Sektion "Gefährlich & tödlich" – dunkel, geheimnisvoll, mit gruseliger Animation:
 * Dornenranken wachsen, das Licht flackert kurz, Augen öffnen sich im Dunkeln,
 * die Überschrift zittert, das Handy pocht wie ein Herzschlag.
 * Ausgelöst beim Hineinscrollen (`ausloeser` zählt hoch) und beim Antippen der Überschrift.
 *
 * Sicherheit: höchstens zwei sanfte Flacker-Blitze (unter 3 pro Sekunde, wenig Kontrast).
 * Bei "Bewegung reduzieren" bleibt alles still.
 */
type Props = {
  eintraege: KatalogEintrag[];
  gefunden: Record<string, unknown>;
  verborgen: (id: string) => boolean;
  /** jede Erhöhung startet die Animation */
  ausloeser: number;
  /** Text, falls es in dieser Kategorie keine gefährlichen Arten gibt */
  leerText?: string;
};

const AnimierterPfad = Animated.createAnimatedComponent(Path);
const RANKEN_LAENGE = 900;

export function GefahrSektion({ eintraege, gefunden, verborgen, ausloeser, leerText }: Props) {
  const ruhig = useReducedMotion();
  const [selbst, setSelbst] = useState(0);
  const ranken = useSharedValue(ruhig ? 1 : 0);
  const flackern = useSharedValue(0);
  const zittern = useSharedValue(0);
  const augen = useSharedValue(0);
  const glut = useSharedValue(0.4);

  const start = ausloeser + selbst;
  useEffect(() => {
    if (start === 0 || ruhig) return;
    // Dornen wachsen
    ranken.value = 0;
    ranken.value = withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) });
    // zwei sanfte Flacker-Blitze
    flackern.value = withSequence(
      withTiming(0.55, { duration: 70 }),
      withTiming(0, { duration: 160 }),
      withDelay(260, withTiming(0.4, { duration: 60 })),
      withTiming(0, { duration: 260 }),
    );
    // Überschrift zittert
    zittern.value = withSequence(...[6, -5, 4, -3, 2, 0].map((x) => withTiming(x, { duration: 55 })));
    // Augen öffnen sich, blinzeln einmal
    augen.value = withSequence(
      withDelay(500, withTiming(1, { duration: 400 })),
      withDelay(900, withTiming(0.1, { duration: 90 })),
      withTiming(1, { duration: 120 }),
      withDelay(1400, withTiming(0, { duration: 900 })),
    );
    // Herzschlag
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    const t = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 180);
    return () => clearTimeout(t);
  }, [start, ruhig, ranken, flackern, zittern, augen]);

  // Rand glüht langsam wie Glut
  useEffect(() => {
    if (ruhig) return;
    glut.value = withRepeat(withTiming(0.85, { duration: 2200, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [ruhig, glut]);

  const rankenProps = useAnimatedProps(() => ({ strokeDashoffset: RANKEN_LAENGE * (1 - ranken.value) }));
  const flackerStil = useAnimatedStyle(() => ({ opacity: flackern.value }));
  const zitterStil = useAnimatedStyle(() => ({ transform: [{ translateX: zittern.value }] }));
  const augenStil = useAnimatedStyle(() => ({ opacity: augen.value, transform: [{ scaleY: augen.value }] }));
  const glutStil = useAnimatedStyle(() => ({ shadowOpacity: glut.value }));

  return (
    <Animated.View style={[stile.rahmen, glutStil]}>
      {/* Dornenranken oben und an den Seiten */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 360 300" preserveAspectRatio="none" pointerEvents="none">
        <AnimierterPfad
          d="M0 40 C40 10 70 50 110 22 S170 40 200 14 S270 46 300 18 S350 30 360 12 M30 30 l-6 -10 M90 32 l4 -12 M160 30 l-5 -11 M230 34 l6 -10 M320 22 l-4 -11 M0 40 C14 90 4 140 18 190 S8 260 20 300 M8 120 l-9 -4 M16 230 l10 -3 M360 12 C346 70 356 130 342 190 S352 260 340 300 M352 100 l9 -5 M346 210 l-10 -4"
          stroke={colors.blut}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={RANKEN_LAENGE}
          animatedProps={rankenProps}
        />
      </Svg>

      {/* Augen im Dunkeln */}
      <Animated.View style={[stile.augenPaar, { top: 70, right: 26 }, augenStil]} pointerEvents="none">
        <View style={stile.auge} />
        <View style={stile.auge} />
      </Animated.View>
      <Animated.View style={[stile.augenPaar, { bottom: 40, left: 22 }, augenStil]} pointerEvents="none">
        <View style={[stile.auge, { backgroundColor: colors.amber, shadowColor: colors.amber }]} />
        <View style={[stile.auge, { backgroundColor: colors.amber, shadowColor: colors.amber }]} />
      </Animated.View>

      <Pressable
        onPress={() => setSelbst((n) => n + 1)}
        accessibilityRole="header"
        accessibilityLabel="Gefährlich und tödlich. Nur ansehen, nie anfassen, nie probieren."
        style={{ alignItems: 'center', gap: 4, paddingTop: spacing.l }}
      >
        <Animated.View style={zitterStil}>
          <Schrift style={stile.titel}>☠ Gefährlich & tödlich ☠</Schrift>
        </Animated.View>
        <Schrift art="klein" style={{ textAlign: 'center', color: colors.fog, paddingHorizontal: spacing.l }}>
          Hier lauert Gefahr. Nur ansehen – nie anfassen, nie probieren.
        </Schrift>
      </Pressable>

      {eintraege.length === 0 ? (
        <Schrift art="klein" style={stile.leer}>
          {leerText}
        </Schrift>
      ) : (
        <View style={stile.raster}>
          {eintraege.map((e) => (
            <GefahrKnoten key={e.id} e={e} ok={e.id in gefunden} versteckt={verborgen(e.id)} />
          ))}
        </View>
      )}

      {/* kurzes Flackern: dunkle Fläche blendet ein und aus */}
      <Animated.View style={[StyleSheet.absoluteFill, stile.flackern, flackerStil]} pointerEvents="none" />
    </Animated.View>
  );
}

function GefahrKnoten({ e, ok, versteckt }: { e: KatalogEintrag; ok: boolean; versteckt: boolean }) {
  const s = SELTENHEIT[e.seltenheit];
  const name = versteckt ? '???' : e.name;
  // Gift-Stufe kurz; bei Tieren "gefährlich"
  const stufe = e.gefahr && e.gefahr.length < 20 ? e.gefahr : 'gefährlich';
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${stufe}, ${s.name}, ${s.punkte} Punkte, ${ok ? 'gesammelt' : 'noch offen'}`}
      style={({ pressed }) => [stile.knoten, pressed && { opacity: 0.6 }]}
    >
      <View style={[stile.kreis, ok ? { borderStyle: 'solid', shadowOpacity: 0.8 } : null]}>
        <ArtMiniatur
          modell={e.modell}
          baumModell={e.baumModell}
          stil={ok ? 'farbe' : versteckt ? 'verborgen' : 'umriss'}
          akzent={colors.blut}
          groesse={44}
        />
        <View style={stile.schaedel}>
          <Schrift style={{ fontSize: 11, lineHeight: 14, color: colors.moon }}>☠</Schrift>
        </View>
      </View>
      <Schrift art="klein" numberOfLines={2} style={[stile.name, ok && { color: colors.moon }]}>
        {name}
      </Schrift>
      <Schrift style={stile.stufe}>{stufe}</Schrift>
      <Schrift style={[stile.punkte, { color: s.farbe }]}>{ok ? '✓ gesammelt' : `+${s.punkte} AP`}</Schrift>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  rahmen: {
    marginTop: spacing.l,
    borderRadius: radius.l,
    borderWidth: 1.5,
    borderColor: colors.blut,
    borderStyle: 'dashed',
    backgroundColor: colors.abgrund,
    paddingBottom: spacing.l,
    overflow: 'hidden',
    shadowColor: colors.blut,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  titel: {
    fontFamily: fonts.titel,
    fontSize: 26,
    lineHeight: 32,
    color: colors.warn,
    textShadowColor: colors.blut,
    textShadowRadius: 14,
  },
  leer: { textAlign: 'center', paddingHorizontal: spacing.l, paddingTop: spacing.m, color: colors.moon },
  raster: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.m, paddingTop: spacing.m },
  knoten: { width: 96, alignItems: 'center' },
  kreis: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.6,
    borderStyle: 'dashed',
    borderColor: colors.blut,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blut,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  schaedel: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blut,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { textAlign: 'center', fontSize: 12, lineHeight: 15, marginTop: 4 },
  stufe: {
    fontFamily: fonts.etikett,
    fontSize: 10,
    color: colors.warn,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  punkte: { fontFamily: fonts.etikett, fontSize: 10.5 },
  augenPaar: { position: 'absolute', flexDirection: 'row', gap: 7 },
  auge: {
    width: 9,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.warn,
    shadowColor: colors.warn,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  flackern: { backgroundColor: colors.night },
});
