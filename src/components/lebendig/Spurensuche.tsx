import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import { SpurBild, TierSymbol } from '@/components/tier/TierSymbol';
import { TierFoto } from '@/components/tier/TierFoto';
import { TrittsiegelForm } from '@/components/tier/Trittsiegel';
import { spurFarben } from '@/components/tier/UmweltTafeln';
import { Schalter } from '@/components/ui/Schalter';
import type { TierSeite, TrittForm } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Spurensuche:
 * 1. Eine Fährte läuft über den Bildschirm: Abdruck für Abdruck erscheint, als wäre das Tier
 *    gerade vorbeigegangen – danach verblasst sie und beginnt von vorn. Untergrund, Gangart und
 *    Alter lassen sich umschalten.
 * 2. Darunter große Fundkarten zum Durchwischen (echte Fotos, wo es sie gibt).
 *    Antippen dreht eine Karte um: hinten Zeichnung, Erklärung und Maß.
 */
export function Spurensuche({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const { width } = useWindowDimensions();
  const kartenBreite = Math.round(Math.min(340, width * 0.78));
  const [seite, setSeite] = useState(0);
  return (
    <View style={{ gap: spacing.l }}>
      <SpurenSpiel tier={tier} ruhig={ruhig} />
      {/* Große Fundkarten zum Durchwischen – Antippen dreht die Karte um */}
      <View style={stile.randlos}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={kartenBreite + spacing.m}
          decelerationRate="fast"
          contentContainerStyle={[stile.karten, { paddingHorizontal: (width - kartenBreite) / 2 }]}
          onMomentumScrollEnd={(e) => setSeite(Math.round(e.nativeEvent.contentOffset.x / (kartenBreite + spacing.m)))}
        >
          {tier.spuren.map((s) => (
            <Fundkarte key={s.icon} tier={tier} spur={s} breite={kartenBreite} ruhig={ruhig} />
          ))}
        </ScrollView>
      </View>
      <View style={stile.punkte}>
        {tier.spuren.map((s, i) => (
          <View key={s.icon} style={[stile.punkt, i === seite && stile.punktAn]} />
        ))}
      </View>
    </View>
  );
}

/**
 * Untergrund der Fährte: Farbe des Bodens, des Abdrucks, des aufgeworfenen Randes und der Tiefe.
 * Schnee: weiche, bläulich-graue Mulden mit hellem Rand. Matsch: dunkle, nasse Abdrücke mit Glanz.
 */
type Untergrund = 'schnee' | 'matsch';
const BODEN: Record<Untergrund, { boden: string; abdruck: string; rand: string; tiefe: string; name: string }> = {
  schnee: { boden: colors.nebel, abdruck: colors.fog, rand: colors.moon, tiefe: colors.wasser, name: 'Schnee' },
  matsch: {
    boden: colors.rinde,
    abdruck: colors.rindeDunkel,
    rand: colors.rindeHell,
    tiefe: colors.shadow,
    name: 'Matsch',
  },
};

/**
 * Laufende Fährte mit drei Schaltern:
 * - Untergrund: Schnee oder Matsch
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
            <Abdruck
              form={form}
              // echte, nachgezeichnete Form (Pipeline): beim Gehen abwechselnd Vorder- und Hinterfuß
              pfad={
                flucht
                  ? (tier.trittPfad?.flucht ?? tier.trittPfad?.vorne)
                  : k % 2 === 1
                    ? (tier.trittPfad?.hinten ?? tier.trittPfad?.vorne)
                    : tier.trittPfad?.vorne
              }
              boden={b}
              groesse={groesse}
              nass={boden === 'matsch'}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

/**
 * Ein Abdruck in Schichten, damit er wie in den Boden gedrückt wirkt:
 * aufgeworfener Rand (weich, hell) → Rand im Licht (oben links) → Abdruck → tiefste Stelle (unten rechts dunkler)
 * → bei Matsch ein nasser Glanz. `pfad`: echte Form aus der Pipeline, sonst die vereinfachte `form`.
 */
function Abdruck({
  form,
  pfad,
  boden,
  groesse,
  nass,
}: {
  form: TrittForm;
  pfad?: string;
  boden: (typeof BODEN)[Untergrund];
  groesse: number;
  nass: boolean;
}) {
  const flaeche = (farbe: string) =>
    pfad ? <Path d={pfad} fill={farbe} fillRule="evenodd" /> : <TrittsiegelForm form={form} farbe={farbe} />;
  return (
    <Svg width={34} height={34} viewBox="-17 -17 34 34">
      <G transform={`rotate(90) scale(${groesse * 1.22})`} opacity={0.22}>
        {flaeche(boden.rand)}
      </G>
      <G transform={`translate(-0.9 -0.9) rotate(90) scale(${groesse * 1.07})`} opacity={0.6}>
        {flaeche(boden.rand)}
      </G>
      <G transform={`rotate(90) scale(${groesse})`}>{flaeche(boden.abdruck)}</G>
      <G transform={`translate(0.7 0.7) rotate(90) scale(${groesse * 0.72})`} opacity={0.45}>
        {flaeche(boden.tiefe)}
      </G>
      {nass && (
        <G transform={`translate(-1.2 -1) rotate(90) scale(${groesse * 0.4})`} opacity={0.18}>
          {flaeche(colors.moon)}
        </G>
      )}
    </Svg>
  );
}

/**
 * Große Fundkarte wie ein Abzug auf dem Forschertisch. Vorne: das echte Foto (oder die Zeichnung).
 * Antippen dreht die Karte um: hinten Zeichnung, Erklärung und Maß.
 */
function Fundkarte({
  tier,
  spur,
  breite,
  ruhig,
}: {
  tier: TierSeite;
  spur: TierSeite['spuren'][number];
  breite: number;
  ruhig: boolean;
}) {
  const [hinten, setHinten] = useState(false);
  const [drehen] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const ziel = hinten ? 1 : 0;
    if (ruhig) {
      drehen.setValue(ziel);
      return;
    }
    Animated.spring(drehen, { toValue: ziel, friction: 8, tension: 60, useNativeDriver: true }).start();
  }, [hinten, ruhig, drehen]);
  const foto = tier.fotos?.spuren?.[spur.icon];
  const [titel, ...rest] = spur.kurz.split(':');
  const seite = (vorne: boolean) => ({
    transform: [
      { perspective: 900 },
      {
        rotateY: drehen.interpolate({
          inputRange: [0, 1],
          outputRange: vorne ? ['0deg', '180deg'] : ['180deg', '360deg'],
        }),
      },
    ],
  });
  return (
    <Pressable
      onPress={() => setHinten(!hinten)}
      accessibilityRole="button"
      accessibilityLabel={`${spur.kurz}${spur.cm ? `, ${spur.cm[0]} bis ${spur.cm[1]} Zentimeter` : ''}. Antippen dreht die Karte um.`}
      style={{ width: breite }}
    >
      {/* Vorderseite */}
      <Animated.View style={[stile.karte, seite(true), ruhig && hinten && { opacity: 0 }]}>
        <View style={stile.bild}>
          {foto ? (
            <TierFoto id={foto} style={StyleSheet.absoluteFill} nachweis />
          ) : (
            <View style={stile.zeichnung}>
              <SpurBild name={spur.icon} farben={spurFarben(tier)} form={tier.tritt} />
            </View>
          )}
        </View>
        <View style={stile.kartenFuss}>
          <Schrift style={stile.kartenTitel} numberOfLines={1}>
            {titel}
          </Schrift>
          <TierSymbol name="tippen" groesse={20} farbe={colors.inkFaded} dicke={1.3} />
        </View>
      </Animated.View>
      {/* Rückseite */}
      <Animated.View style={[stile.karte, stile.rueckseite, seite(false), ruhig && !hinten && { opacity: 0 }]}>
        <View style={stile.rueckZeichnung}>
          <SpurBild name={spur.icon} farben={spurFarben(tier)} form={tier.tritt} />
        </View>
        <Schrift style={stile.rueckTitel}>{titel}</Schrift>
        {rest.length > 0 && <Schrift style={stile.rueckText}>{rest.join(':').trim()}</Schrift>}
        {spur.cm && (
          <Schrift style={stile.rueckMass}>
            {spur.cm[0]}–{spur.cm[1]} cm
          </Schrift>
        )}
      </Animated.View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  boden: { height: 150, marginHorizontal: -spacing.m, overflow: 'hidden' },
  tritt: { position: 'absolute', marginLeft: -17, marginTop: -17 },
  schalterReihe: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.s },
  randlos: { marginHorizontal: -spacing.m },
  karten: { gap: spacing.m, paddingVertical: spacing.m },
  // wie ein großer Abzug auf dem Forschertisch: heller Rand, unten breiter für die Beschriftung
  karte: {
    padding: 10,
    paddingBottom: 6,
    backgroundColor: colors.paper,
    borderRadius: radius.s,
    backfaceVisibility: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  rueckseite: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.m,
    gap: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bild: { width: '100%', aspectRatio: 1, backgroundColor: colors.night, overflow: 'hidden', borderRadius: 2 },
  zeichnung: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.l,
    backgroundColor: colors.paperDark,
  },
  kartenFuss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  kartenTitel: { flex: 1, fontFamily: fonts.notiz, fontSize: 22, lineHeight: 30, color: colors.ink },
  rueckZeichnung: { width: '70%', aspectRatio: 1.25 },
  rueckTitel: { fontFamily: fonts.titel, fontSize: 20, letterSpacing: 1.2, color: colors.ink, textAlign: 'center' },
  rueckText: { fontFamily: fonts.notiz, fontSize: 18, lineHeight: 24, color: colors.inkFaded, textAlign: 'center' },
  rueckMass: { fontFamily: fonts.etikett, fontSize: 15, letterSpacing: 1.5, color: colors.ink },
  punkte: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: -spacing.s },
  punkt: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.moss },
  punktAn: { width: 20, backgroundColor: colors.amber },
});
