import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { TierFoto } from '@/components/tier/TierFoto';
import { TierSymbol, type SymbolName } from '@/components/tier/TierSymbol';
import type { FotoId } from '@/data/fotos';
import type { TierSeite } from '@/data/tierSeiten';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Partikel, type PartikelArt } from './Partikel';

/**
 * Ein Jahr zum Durchwischen: vier Jahreszeiten als große Fotos über die volle Breite.
 * Über jedem Bild fällt, was zur Jahreszeit gehört (Pollen, Glühwürmchen, Laub, Schnee),
 * darauf stehen das Fell und die Ereignisse dieser Monate (aus den Tierdaten).
 */
type Zeit = { name: string; monate: number[]; partikel: PartikelArt; foto?: FotoId };

const MONAT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const HOEHE = 440;

function jahreszeiten(t: TierSeite): Zeit[] {
  const f = t.fotos;
  const j = f?.jahreszeiten;
  // Bevorzugt: ein echtes Foto genau dieser Jahreszeit (Pipeline). Sonst die bisherigen Fotos als Ersatz.
  return [
    { name: 'Frühling', monate: [3, 4, 5], partikel: 'pollen', foto: j?.fruehling ?? f?.jung ?? f?.sommer ?? f?.hero },
    { name: 'Sommer', monate: [6, 7, 8], partikel: 'gluehen', foto: j?.sommer ?? f?.sommer ?? f?.hero },
    { name: 'Herbst', monate: [9, 10, 11], partikel: 'laub', foto: j?.herbst ?? f?.hero },
    {
      name: 'Winter',
      monate: [12, 1, 2],
      partikel: 'schnee',
      foto: j?.winter ?? (t.ruhe ? f?.ruhe : f?.winter) ?? f?.hero,
    },
  ];
}

/** Fell in diesen Monaten: Mittelwert aus den Monatsdaten (0 = Winterfell, 1 = Sommerfell) */
function fellText(t: TierSeite, monate: number[]) {
  const w = monate.reduce((s, m) => s + t.fell[m - 1], 0) / monate.length;
  return w > 0.75 ? 'Sommerfell' : w < 0.25 ? 'Winterfell' : 'Fellwechsel';
}

export function Jahreszeiten({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const { width: b } = useWindowDimensions();
  const zeiten = jahreszeiten(tier);
  const [seite, setSeite] = useState(() => {
    const jetzt = new Date().getMonth() + 1;
    return Math.max(
      0,
      zeiten.findIndex((z) => z.monate.includes(jetzt)),
    );
  });

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: seite * b, y: 0 }}
        onMomentumScrollEnd={(e) => setSeite(Math.round(e.nativeEvent.contentOffset.x / b))}
      >
        {zeiten.map((z, i) => {
          const ereignisse = tier.jahr.filter((j) => j.monate.some((m) => z.monate.includes(m)));
          const ruht = tier.ruhe && tier.ruhe.monate.some((m) => z.monate.includes(m));
          return (
            <View key={z.name} style={{ width: b, height: HOEHE }}>
              {z.foto && <TierFoto id={z.foto} style={StyleSheet.absoluteFill} />}
              {/* nur die sichtbare Jahreszeit bewegt sich – spart Leistung */}
              {i === seite && <Partikel art={z.partikel} ruhig={ruhig} hoehe={HOEHE} />}
              <LinearGradient
                pointerEvents="none"
                colors={[colors.night, 'transparent', 'transparent', colors.night]}
                locations={[0, 0.22, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={stile.oben}>
                <Schrift style={stile.zeit}>{z.name}</Schrift>
                <Schrift style={stile.monate}>
                  {MONAT[z.monate[0] - 1]} – {MONAT[z.monate[z.monate.length - 1] - 1]}
                </Schrift>
              </View>
              <View style={stile.unten}>
                <Marke
                  symbol={fellText(tier, z.monate) === 'Winterfell' ? 'schnee' : 'sonne'}
                  text={fellText(tier, z.monate)}
                />
                {ruht && tier.ruhe && <Marke symbol="mond" text={tier.ruhe.kurz} />}
                {ereignisse.map((j) => (
                  <Marke key={j.id} symbol={j.symbol as SymbolName} text={j.kurz} farbe={colors[j.farbe]} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={stile.punkte} accessibilityLabel={`Jahreszeit ${seite + 1} von ${zeiten.length}`}>
        {zeiten.map((z, i) => (
          <View key={z.name} style={[stile.punkt, i === seite && stile.punktAn]} />
        ))}
      </View>
    </View>
  );
}

function Marke({ symbol, text, farbe = colors.moon }: { symbol: SymbolName; text: string; farbe?: string }) {
  return (
    <View style={[stile.marke, { borderColor: `${farbe}88` }]}>
      <TierSymbol name={symbol} groesse={16} farbe={farbe} />
      <Schrift style={[stile.markeText, { color: farbe }]}>{text}</Schrift>
    </View>
  );
}

const stile = StyleSheet.create({
  oben: { position: 'absolute', top: spacing.m, left: 0, right: 0, alignItems: 'center' },
  zeit: {
    fontFamily: fonts.titel,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 3,
    color: colors.moon,
    textShadowColor: colors.night,
    textShadowRadius: 14,
  },
  monate: { fontFamily: fonts.etikett, fontSize: 12, letterSpacing: 2, color: colors.amber },
  unten: {
    position: 'absolute',
    left: spacing.m,
    right: spacing.m,
    bottom: spacing.l,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.s,
  },
  marke: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.s,
    borderWidth: 1,
    backgroundColor: `${colors.night}B3`,
  },
  markeText: { fontFamily: fonts.notiz, fontSize: 16, lineHeight: 20 },
  punkte: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: spacing.s },
  punkt: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.moss },
  punktAn: { width: 20, backgroundColor: colors.amber },
});
