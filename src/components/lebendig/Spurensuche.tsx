import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { G } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { SpurBild } from '@/components/tier/TierSymbol';
import { TierFoto } from '@/components/tier/TierFoto';
import { TrittsiegelForm } from '@/components/tier/Trittsiegel';
import { spurFarben } from '@/components/tier/UmweltTafeln';
import type { TierSeite } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Spurensuche:
 * 1. Eine Fährte läuft über den Bildschirm: Abdruck für Abdruck erscheint, als wäre das Tier
 *    gerade vorbeigegangen – danach verblasst sie und beginnt von vorn.
 * 2. Darunter liegen Fundkarten wie Fotos auf dem Forschertisch (leicht schräg).
 *    Antippen hebt eine Karte an und zeigt, was man sieht. Echte Fotos, wo es sie gibt.
 */
export function Spurensuche({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const [wahl, setWahl] = useState<string>(tier.spuren[0]?.icon ?? '');
  const gewaehlt = tier.spuren.find((s) => s.icon === wahl);
  return (
    <View style={{ gap: spacing.l }}>
      <LaufendeFaehrte tier={tier} ruhig={ruhig} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stile.karten}>
        {tier.spuren.map((s, i) => (
          <Fundkarte
            key={s.icon}
            tier={tier}
            spur={s}
            schraeg={i % 2 === 0 ? -4 : 3}
            an={s.icon === wahl}
            onPress={() => setWahl(s.icon)}
            ruhig={ruhig}
          />
        ))}
      </ScrollView>
      {gewaehlt && (
        <View style={stile.unterschrift}>
          <Schrift style={stile.unterschriftText}>{gewaehlt.kurz}</Schrift>
          {gewaehlt.cm && (
            <Schrift style={stile.mass}>
              {gewaehlt.cm[0]}–{gewaehlt.cm[1]} cm
            </Schrift>
          )}
        </View>
      )}
    </View>
  );
}

/** Abdrücke erscheinen nacheinander von links nach rechts und verblassen am Ende gemeinsam */
function LaufendeFaehrte({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const [t] = useState(() => new Animated.Value(ruhig ? 0.85 : 0));
  useEffect(() => {
    if (ruhig) return;
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(t, { toValue: 1, duration: 7000, easing: Easing.linear, useNativeDriver: true }),
        Animated.delay(600),
      ]),
    );
    s.start();
    return () => s.stop();
  }, [ruhig, t]);

  const anzahl = 9;
  const tritte = Array.from({ length: anzahl }, (_, k) => ({
    x: 4 + k * (92 / (anzahl - 1)),
    // versetzt: links/rechts im Wechsel, geschnürt: auf einer Linie
    y: 50 + (tier.faehrte === 'geschnuert' ? 0 : k % 2 === 0 ? -14 : 14) + Math.sin(k * 1.3) * 4,
  }));

  return (
    <View style={stile.boden} accessibilityLabel="Fährte, Laufrichtung nach rechts">
      {/* Boden: ein heller Schneestreifen, der zu den Rändern ins Dunkel ausläuft */}
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', `${colors.nebel}8C`, `${colors.nebel}8C`, 'transparent']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      {tritte.map((p, k) => {
        const a = (k / anzahl) * 0.75;
        return (
          <Animated.View
            key={k}
            style={[
              stile.tritt,
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: t.interpolate({
                  inputRange: [a, a + 0.04, 0.88, 1],
                  outputRange: [0, 1, 1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [
                  { scale: t.interpolate({ inputRange: [a, a + 0.06], outputRange: [1.5, 1], extrapolate: 'clamp' }) },
                ],
              },
            ]}
          >
            <Svg width={34} height={34} viewBox="-17 -17 34 34">
              <G transform="rotate(90) scale(0.9)">
                <TrittsiegelForm form={tier.tritt} farbe={colors.night} />
              </G>
            </Svg>
          </Animated.View>
        );
      })}
    </View>
  );
}

function Fundkarte({
  tier,
  spur,
  schraeg,
  an,
  onPress,
  ruhig,
}: {
  tier: TierSeite;
  spur: TierSeite['spuren'][number];
  schraeg: number;
  an: boolean;
  onPress: () => void;
  ruhig: boolean;
}) {
  const [heben] = useState(() => new Animated.Value(an ? 1 : 0));
  useEffect(() => {
    const ziel = an ? 1 : 0;
    if (ruhig) {
      heben.setValue(ziel);
      return;
    }
    Animated.spring(heben, { toValue: ziel, friction: 7, tension: 80, useNativeDriver: true }).start();
  }, [an, ruhig, heben]);
  const foto = tier.fotos?.spuren?.[spur.icon];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spur.kurz}
      accessibilityState={{ selected: an }}
    >
      <Animated.View
        style={[
          stile.karte,
          an && stile.karteAn,
          {
            transform: [
              { rotate: heben.interpolate({ inputRange: [0, 1], outputRange: [`${schraeg}deg`, '0deg'] }) },
              { translateY: heben.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
              { scale: heben.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] }) },
            ],
          },
        ]}
      >
        <View style={stile.bild}>
          {foto ? (
            <TierFoto id={foto} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={stile.zeichnung}>
              <SpurBild name={spur.icon} farben={spurFarben(tier)} form={tier.tritt} />
            </View>
          )}
        </View>
        <Schrift style={stile.kartenText} numberOfLines={1}>
          {spur.kurz.split(':')[0]}
        </Schrift>
      </Animated.View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  boden: { height: 150, marginHorizontal: -spacing.m, overflow: 'hidden' },
  tritt: { position: 'absolute', marginLeft: -17, marginTop: -17 },
  karten: { gap: spacing.m, paddingHorizontal: spacing.s, paddingVertical: spacing.m },
  // wie ein Abzug auf dem Forschertisch: heller Rand, unten breiter für die Beschriftung
  karte: {
    width: 150,
    padding: 7,
    paddingBottom: 4,
    backgroundColor: colors.paper,
    borderRadius: radius.s,
    shadowColor: colors.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  karteAn: { shadowColor: colors.amber, shadowOpacity: 0.45, shadowRadius: 16 },
  bild: { width: '100%', aspectRatio: 1, backgroundColor: colors.night, overflow: 'hidden', borderRadius: 2 },
  zeichnung: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s },
  kartenText: { fontFamily: fonts.notiz, fontSize: 16, lineHeight: 26, color: colors.ink, textAlign: 'center' },
  unterschrift: { alignItems: 'center', gap: 2 },
  unterschriftText: { fontFamily: fonts.notiz, fontSize: 20, lineHeight: 26, color: colors.moon, textAlign: 'center' },
  mass: { fontFamily: fonts.etikett, fontSize: 13, letterSpacing: 1.5, color: colors.amber },
});
