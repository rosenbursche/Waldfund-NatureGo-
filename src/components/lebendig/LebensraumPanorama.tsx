import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { ZONEN_SYMBOL } from '@/components/tier/UmweltTafeln';
import { Schalter } from '@/components/ui/Schalter';
import { FOTOS, fotoNachweis } from '@/data/fotos';
import type { TierSeite, Zone } from '@/data/tierSeiten';
import { colors, fonts, spacing } from '@/theme/theme';

/**
 * Lebensraum als echtes Landschafts-Panorama zum Verschieben mit dem Finger.
 * - Die drei Orte (z. B. Deckung, Lieblingsplatz, Futter) sind als Marken in das Foto gesetzt.
 * - Das Tier ist ein rundes Foto-Porträt. Beim Wechsel Tag ↔ Dämmerung wandert es zu seinem Ort
 *   und hinterlässt eine Spur aus Punkten; das Panorama fährt mit.
 * - In der Dämmerung wird die Landschaft dunkel und bläulich, das Porträt leuchtet.
 */
const HOEHE = 300;
const PORTRAET = 54;

export function LebensraumPanorama({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const lr = tier.fotos?.lebensraum;
  const l = tier.lebensraum;
  const [nacht, setNacht] = useState(false);
  const [wahl, setWahl] = useState<Zone | null>(null);
  const [fenster, setFenster] = useState(0);
  const blick = useRef<ScrollView>(null);
  const [weg] = useState(() => new Animated.Value(0)); // 0 = am Tagesort, 1 = am Dämmerungsort
  const [dunkel] = useState(() => new Animated.Value(0));

  const f = lr ? FOTOS[lr.foto] : undefined;
  const breite = f ? Math.round(HOEHE * (f.breite / f.hoehe)) : 0;
  const ort = nacht ? l.nacht : l.tag;
  const punkt = (z: Zone) =>
    lr ? { x: (lr.zonen[z][0] / 100) * breite, y: (lr.zonen[z][1] / 100) * HOEHE } : { x: 0, y: 0 };
  const von = punkt(l.tag);
  const nach = punkt(l.nacht);

  useEffect(() => {
    const ziel = nacht ? 1 : 0;
    if (ruhig) {
      weg.setValue(ziel);
      dunkel.setValue(ziel);
    } else {
      Animated.timing(weg, {
        toValue: ziel,
        duration: 1800,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
      Animated.timing(dunkel, { toValue: ziel, duration: 1200, useNativeDriver: true }).start();
    }
    // Panorama so verschieben, dass das Tier in der Mitte steht
    if (fenster > 0) {
      const x = nacht ? nach.x : von.x;
      blick.current?.scrollTo({ x: Math.max(0, Math.min(breite - fenster, x - fenster / 2)), animated: !ruhig });
    }
  }, [nacht, ruhig, weg, dunkel, fenster, breite, von.x, nach.x]);

  if (!lr || !f) return null;
  const symbole = ZONEN_SYMBOL[l.landschaft];
  // Spur zwischen beiden Orten: 9 Punkte auf einem leichten Bogen
  const spur = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10;
    return { x: von.x + (nach.x - von.x) * t, y: von.y + (nach.y - von.y) * t - Math.sin(t * Math.PI) * 18 };
  });

  return (
    <View style={{ gap: spacing.m }}>
      <Schalter
        wahl={nacht ? 'nacht' : 'tag'}
        optionen={[
          { wert: 'tag', symbol: 'sonne', name: 'Tag' },
          { wert: 'nacht', symbol: 'mond', name: 'Dämmerung' },
        ]}
        onWahl={(w) => setNacht(w === 'nacht')}
      />
      <View onLayout={(e) => setFenster(e.nativeEvent.layout.width)}>
        <ScrollView ref={blick} horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View style={{ width: breite, height: HOEHE }}>
            <Image
              source={f.quelle}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessibilityIgnoresInvertColors
            />
            {/* Dämmerung: dunkelblauer Schleier über der Landschaft */}
            <Animated.View pointerEvents="none" style={[stile.daemmerung, { opacity: dunkel }]} />
            <LinearGradient
              pointerEvents="none"
              colors={[colors.night, 'transparent', 'transparent', colors.night]}
              locations={[0, 0.18, 0.75, 1]}
              style={StyleSheet.absoluteFill}
            />
            {/* Spur zwischen Tag- und Dämmerungsort */}
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { opacity: dunkel.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) },
              ]}
            >
              <Svg width={breite} height={HOEHE}>
                {spur.map((p, i) => (
                  <Circle key={i} cx={p.x} cy={p.y} r={2.2} fill={colors.amber} opacity={0.85} />
                ))}
              </Svg>
            </Animated.View>
            {/* Orte als Marken */}
            {[0, 1, 2].map((i) => {
              const z = i as Zone;
              const p = punkt(z);
              const aktiv = z === (wahl ?? ort);
              return (
                <Pressable
                  key={z}
                  onPress={() => setWahl(wahl === z ? null : z)}
                  accessibilityRole="button"
                  accessibilityLabel={l.orte[z]}
                  style={[stile.marke, { left: p.x - 60, top: p.y + PORTRAET / 2 + 6 }]}
                >
                  <View style={[stile.markeInnen, aktiv && stile.markeAktiv]}>
                    <TierSymbol name={symbole[z]} groesse={15} farbe={aktiv ? colors.night : colors.moon} />
                    <Schrift style={[stile.markeText, aktiv && { color: colors.night }]} numberOfLines={1}>
                      {l.orte[z]}
                    </Schrift>
                  </View>
                </Pressable>
              );
            })}
            {/* das Tier als Foto-Porträt, wandert zwischen den Orten */}
            <Animated.View
              pointerEvents="none"
              style={[
                stile.portraet,
                {
                  transform: [
                    {
                      translateX: weg.interpolate({
                        inputRange: [0, 1],
                        outputRange: [von.x - PORTRAET / 2, nach.x - PORTRAET / 2],
                      }),
                    },
                    {
                      translateY: weg.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [
                          von.y - PORTRAET / 2,
                          (von.y + nach.y) / 2 - PORTRAET / 2 - 18,
                          nach.y - PORTRAET / 2,
                        ],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View style={[stile.leuchten, { opacity: dunkel }]} />
              <View style={stile.portraetBild}>
                <Image
                  source={FOTOS[tier.fotos!.hero].quelle}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  contentPosition={{ left: `${tier.fotos!.heroX ?? 50}%`, top: '40%' }}
                />
              </View>
            </Animated.View>
          </View>
        </ScrollView>
        <Schrift style={stile.nachweis} numberOfLines={1}>
          {fotoNachweis(f)}
        </Schrift>
      </View>
      {/* Zusammenfassung: wo am Tag, wo in der Dämmerung */}
      <View style={stile.legende}>
        <Zeile symbol="sonne" etikett="Tag" text={l.orte[l.tag]} an={!nacht} />
        <Zeile symbol="mond" etikett="Dämmerung" text={l.orte[l.nacht]} an={nacht} />
      </View>
    </View>
  );
}

function Zeile({
  symbol,
  etikett,
  text,
  an,
}: {
  symbol: 'sonne' | 'mond';
  etikett: string;
  text: string;
  an: boolean;
}) {
  return (
    <View style={[stile.zeile, !an && { opacity: 0.45 }]}>
      <TierSymbol name={symbol} groesse={20} farbe={an ? colors.amber : colors.fog} />
      <Schrift art="etikett" style={{ width: 112 }}>
        {etikett}
      </Schrift>
      <Schrift style={stile.zeileText}>{text}</Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  daemmerung: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.kartenTief,
    opacity: 0.7,
  },
  marke: { position: 'absolute', width: 120, alignItems: 'center' },
  markeInnen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${colors.moon}55`,
    backgroundColor: `${colors.night}B3`,
  },
  markeAktiv: { backgroundColor: colors.amber, borderColor: colors.amber },
  markeText: { fontFamily: fonts.notiz, fontSize: 14, lineHeight: 18, color: colors.moon },
  portraet: { position: 'absolute', left: 0, top: 0, width: PORTRAET, height: PORTRAET },
  leuchten: {
    position: 'absolute',
    left: -10,
    top: -10,
    width: PORTRAET + 20,
    height: PORTRAET + 20,
    borderRadius: PORTRAET,
    backgroundColor: colors.amber,
    opacity: 0.3,
    shadowColor: colors.amber,
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  portraetBild: {
    width: PORTRAET,
    height: PORTRAET,
    borderRadius: PORTRAET / 2,
    borderWidth: 2.5,
    borderColor: colors.amber,
    overflow: 'hidden',
    backgroundColor: colors.night,
  },
  nachweis: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.moon,
    opacity: 0.8,
  },
  legende: { gap: 6, paddingHorizontal: spacing.m },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  zeileText: { fontFamily: fonts.notiz, fontSize: 19, lineHeight: 24, color: colors.moon, flex: 1 },
});
