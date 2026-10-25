import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { TierFigur } from '@/components/tier/TierFigur';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { ZONEN_SYMBOL } from '@/components/tier/UmweltTafeln';
import { Schalter } from '@/components/ui/Schalter';
import { FOTOS, fotoNachweis, type FotoId } from '@/data/fotos';
import type { TierSeite, Zone } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Zuhause: echtes Landschafts-Panorama und darunter große Karten für die drei Orte.
 * - Panorama zum Verschieben; die Orte sind als Marken im Foto, das Tier als rundes Porträt.
 * - Tag ↔ Dämmerung: Das Porträt wandert mit einer Punktespur zum anderen Ort, das Panorama fährt mit.
 *   In der Dämmerung wird das Bild nur abendlich getönt – es bleibt gut sichtbar.
 * - Ort-Karten: Nahfoto des Ortes (oder der Ausschnitt aus dem Panorama), Name und ob das Tier
 *   tagsüber bzw. in der Dämmerung dort ist. Antippen springt im Panorama zu diesem Ort.
 * - Tiere ohne eigenes Foto zeigen im Porträt ihre Zeichnung.
 */
const HOEHE = 250;
const PORTRAET = 54;
const KARTE_B = 230;
const KARTE_FOTO = 170;

export function LebensraumPanorama({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const l = tier.lebensraum;
  const lr = l.panorama;
  const [nacht, setNacht] = useState(false);
  const [wahl, setWahl] = useState<Zone | null>(null);
  const [fenster, setFenster] = useState(0);
  const blick = useRef<ScrollViewInstance>(null);
  const [weg] = useState(() => new Animated.Value(0)); // 0 = am Tagesort, 1 = am Dämmerungsort
  const [abend] = useState(() => new Animated.Value(0));

  const f = lr ? FOTOS[lr.foto] : undefined;
  const breite = f ? Math.round(HOEHE * (f.breite / f.hoehe)) : 0;
  const ort = nacht ? l.nacht : l.tag;
  const punkt = (z: Zone) =>
    lr ? { x: (lr.zonen[z][0] / 100) * breite, y: (lr.zonen[z][1] / 100) * HOEHE } : { x: 0, y: 0 };
  const von = punkt(l.tag);
  const nach = punkt(l.nacht);
  // Ziel der Kamera: gewählter Ort, sonst der Ort des Tieres
  const ziel = punkt(wahl ?? ort);

  useEffect(() => {
    const z = nacht ? 1 : 0;
    if (ruhig) {
      weg.setValue(z);
      abend.setValue(z);
      return;
    }
    Animated.timing(weg, {
      toValue: z,
      duration: 1800,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.timing(abend, { toValue: z, duration: 1200, useNativeDriver: true }).start();
  }, [nacht, ruhig, weg, abend]);

  useEffect(() => {
    if (fenster > 0) {
      blick.current?.scrollTo({ x: Math.max(0, Math.min(breite - fenster, ziel.x - fenster / 2)), animated: !ruhig });
    }
  }, [fenster, breite, ziel.x, ruhig]);

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
        onWahl={(w) => {
          setNacht(w === 'nacht');
          setWahl(null);
        }}
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
            {/* Dämmerung: abendliche Tönung – oben bläulicher Himmel, unten etwas dunkler; das Bild bleibt erkennbar */}
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: abend }]}>
              <LinearGradient
                colors={[`${colors.kartenTief}D9`, `${colors.night}66`, `${colors.night}80`]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            {/* Spur zwischen Tag- und Dämmerungsort */}
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { opacity: abend.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
              ]}
            >
              <Svg width={breite} height={HOEHE}>
                {spur.map((p, i) => (
                  <Circle key={i} cx={p.x} cy={p.y} r={2.4} fill={colors.amber} opacity={0.9} />
                ))}
              </Svg>
            </Animated.View>
            {/* Orte als Marken */}
            {([0, 1, 2] as Zone[]).map((z) => {
              const p = punkt(z);
              const aktiv = z === (wahl ?? ort);
              return (
                <Pressable
                  key={z}
                  onPress={() => setWahl(wahl === z ? null : z)}
                  accessibilityRole="button"
                  accessibilityLabel={l.orte[z]}
                  style={[stile.marke, { left: p.x - 60, top: Math.min(p.y + PORTRAET / 2 + 6, HOEHE - 30) }]}
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
            {/* das Tier als Porträt, wandert zwischen den Orten */}
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
              <Animated.View style={[stile.leuchten, { opacity: abend }]} />
              <View style={stile.portraetBild}>
                {tier.fotos ? (
                  <Image
                    source={FOTOS[tier.fotos.hero].quelle}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    contentPosition={{ left: `${tier.fotos.heroX ?? 50}%`, top: '40%' }}
                  />
                ) : (
                  <View style={stile.portraetFigur}>
                    <TierFigur tier={tier} />
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        </ScrollView>
        <Schrift style={stile.nachweis} numberOfLines={1}>
          {fotoNachweis(f)}
        </Schrift>
      </View>

      {/* Die drei Orte als große Karten */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stile.karten}>
        {([0, 1, 2] as Zone[]).map((z) => (
          <OrtKarte
            key={z}
            name={l.orte[z]}
            symbol={symbole[z]}
            nahfoto={lr.orte?.[z]}
            panorama={lr.foto}
            xProzent={lr.zonen[z][0]}
            tag={l.tag === z}
            daemmerung={l.nacht === z}
            gewaehlt={z === (wahl ?? ort)}
            onPress={() => setWahl(wahl === z ? null : z)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/** Karte eines Ortes: Nahfoto oder Ausschnitt aus dem Panorama, Name, wann das Tier dort ist */
function OrtKarte({
  name,
  symbol,
  nahfoto,
  panorama,
  xProzent,
  tag,
  daemmerung,
  gewaehlt,
  onPress,
}: {
  name: string;
  symbol: Parameters<typeof TierSymbol>[0]['name'];
  nahfoto?: FotoId;
  panorama: FotoId;
  xProzent: number;
  tag: boolean;
  daemmerung: boolean;
  gewaehlt: boolean;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const b = Math.min(KARTE_B, width * 0.62);
  const foto = FOTOS[nahfoto ?? panorama];
  // ohne Nahfoto: Ausschnitt des Panoramas rund um den Ort
  const pb = KARTE_FOTO * (foto.breite / foto.hoehe);
  const links = nahfoto ? 0 : -Math.max(0, Math.min(pb - b, (xProzent / 100) * pb - b / 2));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}${tag ? ', tagsüber hier' : ''}${daemmerung ? ', in der Dämmerung hier' : ''}`}
      accessibilityState={{ selected: gewaehlt }}
      style={({ pressed }) => [stile.ortKarte, { width: b }, gewaehlt && stile.ortKarteAn, pressed && { opacity: 0.8 }]}
    >
      <View style={[stile.ortFoto, { width: b }]}>
        {nahfoto ? (
          <Image source={foto.quelle} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <Image
            source={foto.quelle}
            style={{ position: 'absolute', left: links, top: 0, width: pb, height: KARTE_FOTO }}
          />
        )}
        <LinearGradient
          pointerEvents="none"
          colors={['transparent', `${colors.night}E6`]}
          locations={[0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={stile.ortKopf}>
          <TierSymbol name={symbol} groesse={18} farbe={colors.amber} />
          <Schrift style={stile.ortName} numberOfLines={1}>
            {name}
          </Schrift>
        </View>
        {nahfoto && (
          <Schrift style={stile.ortNachweis} numberOfLines={1}>
            {fotoNachweis(foto)}
          </Schrift>
        )}
      </View>
      <View style={stile.ortZeiten}>
        <Zeit symbol="sonne" text="Tagsüber" an={tag} />
        <Zeit symbol="mond" text="Dämmerung" an={daemmerung} />
      </View>
    </Pressable>
  );
}

function Zeit({ symbol, text, an }: { symbol: 'sonne' | 'mond'; text: string; an: boolean }) {
  return (
    <View style={[stile.zeit, an ? stile.zeitAn : { opacity: 0.35 }]}>
      <TierSymbol name={symbol} groesse={14} farbe={an ? colors.night : colors.fog} />
      <Schrift style={[stile.zeitText, an && { color: colors.night }]}>{text}</Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  marke: { position: 'absolute', width: 120, alignItems: 'center' },
  markeInnen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.s,
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
  // Zeichnung auf hellem Papier, damit sie vor der Landschaft lesbar ist
  portraetFigur: { flex: 1, padding: 3, justifyContent: 'center', backgroundColor: colors.paper },
  nachweis: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.moon,
    opacity: 0.85,
    textShadowColor: colors.night,
    textShadowRadius: 4,
  },
  karten: { gap: spacing.m, paddingHorizontal: spacing.m },
  ortKarte: {
    borderRadius: radius.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    backgroundColor: colors.sektion,
  },
  ortKarteAn: { borderColor: colors.amber, borderWidth: 2 },
  ortFoto: { height: KARTE_FOTO, overflow: 'hidden', backgroundColor: colors.night },
  ortKopf: {
    position: 'absolute',
    left: spacing.s,
    right: spacing.s,
    bottom: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ortName: { flex: 1, fontFamily: fonts.titel, fontSize: 16, letterSpacing: 1, color: colors.moon },
  ortNachweis: {
    position: 'absolute',
    right: 4,
    top: 3,
    fontFamily: fonts.body,
    fontSize: 8.5,
    color: colors.moon,
    opacity: 0.8,
    textShadowColor: colors.night,
    textShadowRadius: 4,
  },
  ortZeiten: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: spacing.s },
  zeit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
  },
  zeitAn: { backgroundColor: colors.amber, borderColor: colors.amber },
  zeitText: {
    fontFamily: fonts.etikett,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.fog,
    textTransform: 'uppercase',
  },
});
