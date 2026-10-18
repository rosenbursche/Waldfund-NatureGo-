import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { G } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { SpurBild } from '@/components/tier/TierSymbol';
import { TierFoto } from '@/components/tier/TierFoto';
import { TrittsiegelForm } from '@/components/tier/Trittsiegel';
import { spurFarben } from '@/components/tier/UmweltTafeln';
import { Schalter } from '@/components/ui/Schalter';
import type { TierSeite } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Spurensuche:
 * 1. Eine Fährte läuft über den Bildschirm: Abdruck für Abdruck erscheint, als wäre das Tier
 *    gerade vorbeigegangen – danach verblasst sie und beginnt von vorn. Untergrund, Gangart und
 *    Alter lassen sich umschalten.
 * 2. Darunter liegen Fundkarten wie Fotos auf dem Forschertisch (leicht schräg).
 *    Antippen hebt eine Karte an und zeigt, was man sieht. Echte Fotos, wo es sie gibt.
 */
export function Spurensuche({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const [wahl, setWahl] = useState<string>(tier.spuren[0]?.icon ?? '');
  const gewaehlt = tier.spuren.find((s) => s.icon === wahl);
  return (
    <View style={{ gap: spacing.l }}>
      <SpurenSpiel tier={tier} ruhig={ruhig} />
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

/** Untergrund der Fährte: Farbe des Bodens, des Abdrucks und eines feinen Randes (nasser Glanz, Sandkörner) */
type Untergrund = 'schnee' | 'matsch' | 'sand';
const BODEN: Record<Untergrund, { boden: string; abdruck: string; rand: string; name: string }> = {
  schnee: { boden: colors.nebel, abdruck: colors.forest, rand: colors.moon, name: 'Schnee' },
  matsch: { boden: colors.rinde, abdruck: colors.rindeDunkel, rand: colors.fog, name: 'Matsch' },
  sand: { boden: colors.myzelStielMitte, abdruck: colors.myzelStielDunkel, rand: colors.myzelStiel, name: 'Sand' },
};

/**
 * Laufende Fährte mit drei Schaltern:
 * - Untergrund: Schnee, Matsch, Sand
 * - Gangart: ruhiges Ziehen (Schritt für Schritt) oder Flucht (Sprünge in Vierergruppen, weite Abstände).
 *   Bei Huftieren spreizen sich auf der Flucht die Schalen und die Afterklauen drücken sich ab.
 *   TODO fachlich prüfen: Darstellung der Fluchtfährte vereinfacht
 * - Alter: erwachsenes Tier oder Jungtier (kleinere Abdrücke, kürzere Schritte – ohne Zahlenangabe)
 */
function SpurenSpiel({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const [boden, setBoden] = useState<Untergrund>('schnee');
  const [flucht, setFlucht] = useState(false);
  const [jung, setJung] = useState(false);
  return (
    <View style={{ gap: spacing.m }}>
      <Schalter
        wahl={boden}
        onWahl={setBoden}
        optionen={[
          { wert: 'schnee', symbol: 'schnee', name: 'Schnee' },
          { wert: 'matsch', symbol: 'mulde', name: 'Matsch' },
          { wert: 'sand', symbol: 'sonne', name: 'Sand' },
        ]}
      />
      {/* key: bei jeder Änderung läuft die Fährte von vorn */}
      <LaufendeFaehrte
        key={`${boden}-${flucht}-${jung}`}
        tier={tier}
        ruhig={ruhig}
        boden={boden}
        flucht={flucht}
        jung={jung}
      />
      <View style={stile.schalterReihe}>
        <Schalter
          wahl={flucht ? 'flucht' : 'ziehen'}
          onWahl={(w) => setFlucht(w === 'flucht')}
          optionen={[
            { wert: 'ziehen', symbol: 'tritt', name: 'Gehen' },
            { wert: 'flucht', symbol: 'bein', name: 'Flucht' },
          ]}
        />
        <Schalter
          wahl={jung ? 'jung' : 'alt'}
          onWahl={(w) => setJung(w === 'jung')}
          optionen={[
            { wert: 'alt', symbol: 'waage', name: 'Alt' },
            { wert: 'jung', symbol: 'keim', name: tier.jungName },
          ]}
        />
      </View>
    </View>
  );
}

/** Abdrücke erscheinen nacheinander von links nach rechts und verblassen am Ende gemeinsam */
function LaufendeFaehrte({
  tier,
  ruhig,
  boden,
  flucht,
  jung,
}: {
  tier: TierSeite;
  ruhig: boolean;
  boden: Untergrund;
  flucht: boolean;
  jung: boolean;
}) {
  const [t] = useState(() => new Animated.Value(ruhig ? 0.85 : 0));
  useEffect(() => {
    if (ruhig) return;
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(t, {
          toValue: 1,
          duration: flucht ? 4200 : 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ]),
    );
    s.start();
    return () => s.stop();
  }, [ruhig, t, flucht]);

  const b = BODEN[boden];
  const groesse = jung ? 0.65 : 0.9;
  // Huftiere auf der Flucht: gespreizte Schalen mit Afterklauen
  const form = flucht && tier.tritt === 'huf' ? 'huf_af' : tier.tritt;
  const tritte: { x: number; y: number }[] = [];
  if (flucht) {
    // Vierergruppen mit weiten Sprüngen dazwischen
    const gruppen = jung ? 4 : 3;
    for (let g = 0; g < gruppen; g++) {
      const x0 = 6 + g * (88 / gruppen);
      const d = jung ? 4 : 5.5;
      tritte.push({ x: x0, y: 42 }, { x: x0 + d, y: 58 }, { x: x0 + d * 2.4, y: 40 }, { x: x0 + d * 3.2, y: 60 });
    }
  } else {
    const anzahl = jung ? 12 : 9;
    for (let k = 0; k < anzahl; k++) {
      tritte.push({
        x: 4 + k * (92 / (anzahl - 1)),
        // versetzt: links/rechts im Wechsel, geschnürt: auf einer Linie
        y:
          50 + (tier.faehrte === 'geschnuert' ? 0 : k % 2 === 0 ? -12 : 12) * (jung ? 0.75 : 1) + Math.sin(k * 1.3) * 3,
      });
    }
  }

  return (
    <View
      style={stile.boden}
      accessibilityLabel={`Fährte im ${b.name}, ${flucht ? 'Flucht' : 'Gehen'}, ${jung ? tier.jungName : 'erwachsenes Tier'}`}
    >
      {/* Boden: ein Streifen Untergrund, der zu den Rändern ins Dunkel ausläuft */}
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', `${b.boden}B3`, `${b.boden}B3`, 'transparent']}
        locations={[0, 0.28, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      {tritte.map((p, k) => {
        const a = (k / tritte.length) * 0.75;
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
              {/* heller Rand leicht versetzt: aufgeworfener Schnee, nasser Glanz bzw. Sandkörner */}
              <G transform={`translate(-0.8 -0.8) rotate(90) scale(${groesse * 1.08})`} opacity={0.55}>
                <TrittsiegelForm form={form} farbe={b.rand} />
              </G>
              <G transform={`rotate(90) scale(${groesse})`}>
                <TrittsiegelForm form={form} farbe={b.abdruck} />
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
  schalterReihe: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.s },
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
