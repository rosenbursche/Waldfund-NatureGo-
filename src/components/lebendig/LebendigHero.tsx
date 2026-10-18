import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { FOTOS, fotoNachweis, type FotoId } from '@/data/fotos';
import { colors, fonts, spacing } from '@/theme/theme';

import { Partikel } from './Partikel';

/**
 * Hero der lebendigen Tierseite:
 * - Foto über die ganze Höhe, beim Scrollen langsamer als die Seite (Tiefe) und leicht vergrößert
 * - zwei Nebelschwaden ziehen VOR dem Tier vorbei, Glühwürmchen steigen auf
 * - der Name erscheint Buchstabe für Buchstabe, darunter Etikett, lateinischer Name, Seltenheit
 * - unten ein pulsierender Pfeil: weiter nach unten
 * Bei „Bewegung reduzieren“ ist alles sofort sichtbar und steht still.
 */
export function LebendigHero({
  foto,
  x,
  name,
  latein,
  etikett,
  wappen,
  scroll,
  ruhig,
}: {
  foto: FotoId;
  x?: number;
  name: string;
  latein: string;
  etikett: string;
  /** Wappen-Reihe (Wild-Wert, Seltenheit …) unter dem Namen */
  wappen?: ReactNode;
  scroll: Animated.Value;
  ruhig: boolean;
}) {
  const { width: b, height: fenster } = useWindowDimensions();
  const hoehe = Math.round(fenster * 0.82);
  const [auftritt] = useState(() => new Animated.Value(ruhig ? 1 : 0));

  useEffect(() => {
    if (ruhig) return;
    Animated.timing(auftritt, {
      toValue: 1,
      duration: 2600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [ruhig, auftritt]);

  const buchstaben = name.split('');
  const f = FOTOS[foto];

  return (
    <View style={[stile.hero, { height: hoehe }]}>
      {/* Foto: Parallaxe beim Scrollen, langsames Heranzoomen beim Öffnen */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          !ruhig && {
            transform: [
              {
                translateY: scroll.interpolate({ inputRange: [-200, 0, hoehe], outputRange: [-100, 0, hoehe * 0.45] }),
              },
              {
                scale: Animated.multiply(
                  auftritt.interpolate({ inputRange: [0, 1], outputRange: [1.15, 1.02] }),
                  scroll.interpolate({ inputRange: [-200, 0], outputRange: [1.3, 1], extrapolateRight: 'clamp' }),
                ),
              },
            ],
          },
        ]}
      >
        <Image
          source={f.quelle}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition={x !== undefined ? { left: `${x}%`, top: '50%' } : undefined}
          accessibilityLabel={name}
        />
      </Animated.View>

      {/* Nebel vor dem Tier */}
      <Schwade b={b} y={hoehe * 0.62} dauer={26000} ruhig={ruhig} deckkraft={0.32} versatz={0} />
      <Schwade b={b} y={hoehe * 0.8} dauer={34000} ruhig={ruhig} deckkraft={0.42} versatz={0.5} />
      <Partikel art="gluehen" ruhig={ruhig} hoehe={hoehe} />

      <LinearGradient
        pointerEvents="none"
        colors={['transparent', `${colors.night}80`, colors.night]}
        locations={[0.55, 0.82, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient pointerEvents="none" colors={[`${colors.night}88`, 'transparent']} style={[stile.oben]} />

      <View style={stile.nachweis} pointerEvents="none">
        <Schrift style={stile.nachweisText} numberOfLines={1}>
          {fotoNachweis(f)}
        </Schrift>
      </View>

      <View style={stile.unten} pointerEvents="none">
        <Animated.View
          style={{ opacity: auftritt.interpolate({ inputRange: [0, 0.3], outputRange: [0, 1], extrapolate: 'clamp' }) }}
        >
          <View style={stile.etikettZeile}>
            <View style={stile.strich} />
            <Schrift art="etikett" style={{ color: colors.moon }}>
              {etikett}
            </Schrift>
            <View style={stile.strich} />
          </View>
        </Animated.View>
        {/* Name: jeder Buchstabe taucht nacheinander aus dem Nebel auf */}
        <View style={stile.name} accessible accessibilityRole="header" accessibilityLabel={name}>
          {buchstaben.map((z, i) => {
            const a = 0.15 + (i / Math.max(1, buchstaben.length)) * 0.45;
            return (
              <Animated.Text
                key={`${z}-${i}`}
                style={[
                  stile.buchstabe,
                  {
                    opacity: auftritt.interpolate({
                      inputRange: [a, a + 0.25],
                      outputRange: [0, 1],
                      extrapolate: 'clamp',
                    }),
                    transform: [
                      {
                        translateY: auftritt.interpolate({
                          inputRange: [a, a + 0.3],
                          outputRange: [14, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                {z}
              </Animated.Text>
            );
          })}
        </View>
        <Animated.View
          style={[
            stile.zeile,
            { opacity: auftritt.interpolate({ inputRange: [0.6, 0.9], outputRange: [0, 1], extrapolate: 'clamp' }) },
          ]}
        >
          <Schrift style={stile.latein}>{latein}</Schrift>
        </Animated.View>
        {wappen && (
          <Animated.View
            style={[
              stile.wappen,
              {
                opacity: auftritt.interpolate({ inputRange: [0.7, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
                transform: [
                  {
                    scale: auftritt.interpolate({ inputRange: [0.7, 1], outputRange: [0.85, 1], extrapolate: 'clamp' }),
                  },
                ],
              },
            ]}
          >
            {wappen}
          </Animated.View>
        )}
        <Pfeil ruhig={ruhig} />
      </View>
    </View>
  );
}

/** Breite, weiche Nebelschwade, die langsam quer durchs Bild zieht */
function Schwade({
  b,
  y,
  dauer,
  ruhig,
  deckkraft,
  versatz,
}: {
  b: number;
  y: number;
  dauer: number;
  ruhig: boolean;
  deckkraft: number;
  versatz: number;
}) {
  const [t] = useState(() => new Animated.Value(versatz));
  useEffect(() => {
    if (ruhig) return;
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: dauer * (1 - versatz),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, { toValue: 0, duration: dauer, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(t, {
          toValue: versatz,
          duration: dauer * versatz,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    s.start();
    return () => s.stop();
  }, [ruhig, t, dauer, versatz]);
  const breite = b * 2;
  const hoehe = 180;
  const id = `schwade-${Math.round(y)}`;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: -b * 0.5,
        top: y - hoehe / 2,
        transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [-b * 0.35, b * 0.35] }) }],
      }}
    >
      <Svg width={breite} height={hoehe}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={colors.nebel} stopOpacity={deckkraft} />
            <Stop offset="1" stopColor={colors.nebel} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={breite / 2} cy={hoehe / 2} rx={breite / 2} ry={hoehe / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Pfeil nach unten, der sanft wippt */
function Pfeil({ ruhig }: { ruhig: boolean }) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (ruhig) return;
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    s.start();
    return () => s.stop();
  }, [ruhig, t]);
  return (
    <Animated.View
      style={[
        stile.pfeil,
        {
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] }),
          transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) }],
        },
      ]}
    >
      <View style={stile.pfeilSpitze} />
    </Animated.View>
  );
}

const stile = StyleSheet.create({
  hero: { overflow: 'hidden', backgroundColor: colors.night },
  oben: { position: 'absolute', left: 0, right: 0, top: 0, height: 120 },
  nachweis: { position: 'absolute', right: spacing.s, top: 64, maxWidth: '70%' },
  nachweisText: { fontFamily: fonts.body, fontSize: 9.5, color: colors.moon, opacity: 0.7 },
  unten: { position: 'absolute', left: spacing.m, right: spacing.m, bottom: spacing.l, alignItems: 'center', gap: 6 },
  etikettZeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  strich: { width: 22, height: 1, backgroundColor: colors.amber },
  name: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  buchstabe: {
    fontFamily: fonts.titel,
    fontSize: 54,
    lineHeight: 64,
    letterSpacing: 4,
    color: colors.moon,
    textShadowColor: colors.night,
    textShadowRadius: 20,
  },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  latein: { fontFamily: fonts.notiz, fontSize: 17, color: colors.fog },
  wappen: { marginTop: spacing.s },
  pfeil: { marginTop: spacing.s, height: 16, alignItems: 'center' },
  pfeilSpitze: {
    width: 12,
    height: 12,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.amber,
    transform: [{ rotate: '45deg' }],
  },
});
