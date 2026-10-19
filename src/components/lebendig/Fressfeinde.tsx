import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { TierFigur } from '@/components/tier/TierFigur';
import { TierFoto } from '@/components/tier/TierFoto';
import { TierSymbol } from '@/components/tier/TierSymbol';
import { artById } from '@/data/arten';
import { tierSeite, type TierSeite } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

/**
 * Fressfeinde „im Schatten“: Jede Gefahr wartet als dunkle Gestalt mit leuchtenden Augen.
 * Antippen holt sie ins Licht – dann sieht man das echte Foto (oder die Zeichnung), den Namen
 * und kann zur Artenseite springen. Getrennt nach Gefahr für erwachsene Tiere und nur für Jungtiere.
 * Mähwiesen und andere menschliche Gefahren erscheinen als Symbol.
 */
export function Fressfeinde({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const gruppen = [
    { jung: false, liste: tier.gefahren.filter((g) => !g.nurJung) },
    { jung: true, liste: tier.gefahren.filter((g) => g.nurJung) },
  ].filter((g) => g.liste.length > 0);
  return (
    <View style={stile.flaeche}>
      {gruppen.map((g) => {
        const foto = g.jung ? tier.fotos?.jung : tier.fotos?.hero;
        return (
          <View key={String(g.jung)} style={{ gap: spacing.s }}>
            <View style={stile.gruppenKopf}>
              {foto && (
                <View style={stile.beute}>
                  <TierFoto id={foto} style={StyleSheet.absoluteFill} position={{ left: '50%', top: '40%' }} />
                </View>
              )}
              <Schrift art="etikett" style={{ color: colors.moon }}>
                {g.jung ? `Nur für Jungtiere (${tier.jungName})` : 'Gefahr für alle'}
              </Schrift>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stile.reihe}>
              {g.liste.map((gefahr, i) => (
                <Schatten key={gefahr.kurz} gefahr={gefahr} ruhig={ruhig} verzoegerung={i * 900} />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

function Schatten({
  gefahr,
  ruhig,
  verzoegerung,
}: {
  gefahr: TierSeite['gefahren'][number];
  ruhig: boolean;
  verzoegerung: number;
}) {
  const [hell, setHell] = useState(false);
  const [licht] = useState(() => new Animated.Value(0));
  const [blinzeln] = useState(() => new Animated.Value(1));
  const feind = gefahr.artId ? tierSeite(gefahr.artId) : undefined;
  const art = gefahr.artId ? artById[gefahr.artId] : undefined;
  const foto = feind?.fotos?.hero;

  useEffect(() => {
    const ziel = hell ? 1 : 0;
    if (ruhig) {
      licht.setValue(ziel);
      return;
    }
    Animated.timing(licht, {
      toValue: ziel,
      duration: 700,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [hell, ruhig, licht]);

  // Augen blinzeln ab und zu (versetzt, damit nicht alle gleichzeitig)
  useEffect(() => {
    if (ruhig) return;
    const s = Animated.loop(
      Animated.sequence([
        Animated.delay(2600 + verzoegerung),
        Animated.timing(blinzeln, { toValue: 0, duration: 90, useNativeDriver: true }),
        Animated.timing(blinzeln, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]),
    );
    s.start();
    return () => s.stop();
  }, [ruhig, blinzeln, verzoegerung]);

  return (
    <Pressable
      onPress={() => setHell(!hell)}
      accessibilityRole="button"
      accessibilityLabel={hell ? gefahr.kurz : `Unbekannte Gefahr: ${gefahr.kurz}. Antippen zeigt sie.`}
      style={stile.karte}
    >
      {/* im Licht: echtes Foto, sonst Zeichnung bzw. Symbol */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: licht }]}>
        {foto ? (
          <TierFoto id={foto} style={StyleSheet.absoluteFill} />
        ) : feind ? (
          <View style={stile.zeichnung}>
            <TierFigur tier={feind} />
          </View>
        ) : (
          <View style={stile.zeichnung}>
            <TierSymbol name={gefahr.icon ?? 'wolf'} groesse={130} farbe={colors.moon} dicke={1.2} />
          </View>
        )}
      </Animated.View>
      {/* im Schatten: dunkle Gestalt mit leuchtenden Augen */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: licht.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}
      >
        <View style={stile.schatten}>
          {feind ? (
            <TierFigur tier={feind} umriss={colors.moss} />
          ) : (
            <TierSymbol name={gefahr.icon ?? 'wolf'} groesse={130} farbe={colors.moss} dicke={2.4} />
          )}
        </View>
        {/* Augen nur bei Tieren – nicht bei Mähwiese, Straße oder Wetter */}
        {gefahr.icon !== 'maehen' && gefahr.icon !== 'auto' && gefahr.icon !== 'schnee' && (
          <Animated.View style={[stile.augen, { transform: [{ scaleY: blinzeln }] }]}>
            <View style={stile.auge} />
            <View style={stile.auge} />
          </Animated.View>
        )}
        <Schrift style={stile.frage}>?</Schrift>
      </Animated.View>
      {/* Name unten, nur im Licht */}
      <Animated.View style={[stile.fuss, { opacity: licht }]}>
        <Schrift style={stile.name} numberOfLines={1}>
          {art?.name ?? gefahr.kurz}
        </Schrift>
        {gefahr.artId && hell && (
          <Pressable
            onPress={() => router.push({ pathname: '/art/[id]', params: { id: gefahr.artId! } })}
            accessibilityRole="link"
            accessibilityLabel={`Zur Seite ${art?.name ?? gefahr.kurz}`}
            hitSlop={6}
          >
            <Schrift style={stile.link}>Zur Art ›</Schrift>
          </Pressable>
        )}
      </Animated.View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  // dunkler als der Rest der Seite: hier lauert etwas
  flaeche: {
    marginHorizontal: -spacing.m,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.m,
    gap: spacing.l,
    backgroundColor: colors.abgrund,
  },
  gruppenKopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  beute: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.warn },
  reihe: { gap: spacing.m, paddingRight: spacing.m },
  karte: {
    width: 230,
    height: 310,
    borderRadius: radius.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.warn}55`,
    backgroundColor: colors.night,
  },
  zeichnung: {
    flex: 1,
    padding: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forest,
  },
  schatten: { flex: 1, padding: spacing.s, alignItems: 'center', justifyContent: 'center', opacity: 0.45 },
  augen: { position: 'absolute', top: '38%', alignSelf: 'center', flexDirection: 'row', gap: 18 },
  auge: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
    shadowColor: colors.amber,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  frage: {
    position: 'absolute',
    bottom: spacing.s,
    alignSelf: 'center',
    fontFamily: fonts.titel,
    fontSize: 20,
    color: colors.warn,
    opacity: 0.8,
  },
  fuss: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.s,
    paddingVertical: 6,
    backgroundColor: `${colors.night}CC`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontFamily: fonts.titel, fontSize: 16, letterSpacing: 1, color: colors.moon, flexShrink: 1 },
  link: { fontFamily: fonts.notiz, fontSize: 16, color: colors.amber },
});
