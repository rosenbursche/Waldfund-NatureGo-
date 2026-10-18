import { LinearGradient } from 'expo-linear-gradient';
import { createContext, useContext, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Schrift } from '@/components/Schrift';
import { TierSymbol, type SymbolName } from '@/components/tier/TierSymbol';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { Info } from './Info';
import { Zierlinie } from './Zierlinie';

/**
 * Sektion: der feste Rahmen für jeden Abschnitt einer Seite (Vorlage: Reh-Seite).
 * - Siegel mit Symbol, Titel in Cinzel (1–2 Wörter), rechts optional ein Gesten-Hinweis
 *   (Hand tippt / zieht) oder eigenes Element (z. B. ein Abzeichen)
 * - Zierlinie unter dem Kopf
 * - oben ein schwacher Lichtschein, unten rechts das Symbol groß als Wasserzeichen
 * - art "warnung": rötlicher Rahmen für Gefahren
 */
/**
 * Ohne Rahmen: Innerhalb von <OhneRahmen> zeigt eine Sektion nur ihren Inhalt (kein Kasten, kein Kopf).
 * So lassen sich fertige Sektionen (z. B. Jahresrad, Tagesuhr) in die Kapitel der lebendigen Tierseite setzen.
 */
const RahmenKontext = createContext(true);
export function OhneRahmen({ children }: { children: ReactNode }) {
  return <RahmenKontext.Provider value={false}>{children}</RahmenKontext.Provider>;
}

export function Sektion({
  symbol,
  titel,
  geste,
  rechts,
  info,
  art = 'standard',
  children,
}: {
  symbol: SymbolName;
  titel: string;
  geste?: 'tippen' | 'ziehen';
  rechts?: ReactNode;
  /** Erklärung hinter einem „i“ neben dem Titel (statt Erklärtext in der Sektion) */
  info?: string;
  art?: 'standard' | 'warnung';
  children: ReactNode;
}) {
  const mitRahmen = useContext(RahmenKontext);
  const akzent = art === 'warnung' ? colors.warn : colors.amber;
  if (!mitRahmen) return <View style={stile.ohne}>{children}</View>;
  return (
    <View style={[stile.sektion, art === 'warnung' && { borderColor: `${colors.warn}66` }]}>
      {/* Licht fällt von oben ein – wie am Ende eines Hohlwegs */}
      <LinearGradient
        pointerEvents="none"
        colors={[`${art === 'warnung' ? colors.warn : colors.rune}1A`, 'transparent']}
        style={stile.licht}
      />
      <View style={stile.wasserzeichen} pointerEvents="none">
        <TierSymbol name={symbol} groesse={170} farbe={colors.moon} dicke={0.8} />
      </View>
      <View style={stile.kopf} accessibilityRole="header">
        <View style={[stile.siegel, { borderColor: akzent }]}>
          <View style={[stile.siegelInnen, { borderColor: `${akzent}55` }]}>
            <TierSymbol name={symbol} groesse={18} farbe={akzent} />
          </View>
        </View>
        <Schrift style={stile.titel} numberOfLines={1} adjustsFontSizeToFit>
          {titel}
        </Schrift>
        {info && <Info titel={titel} text={info} />}
        {rechts}
        {geste && (
          <View accessibilityLabel={geste === 'tippen' ? 'Antippen' : 'Ziehen'}>
            <TierSymbol name={geste} groesse={22} farbe={colors.fog} dicke={1.3} />
          </View>
        )}
      </View>
      <Zierlinie farbe={akzent} style={stile.zier} />
      {children}
    </View>
  );
}

const stile = StyleSheet.create({
  sektion: {
    // leicht durchscheinend: Wald und Nebel dahinter schimmern durch
    backgroundColor: colors.sektion,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: `${colors.moss}AA`,
    padding: spacing.m,
    gap: spacing.m,
    overflow: 'hidden',
  },
  licht: { position: 'absolute', left: 0, right: 0, top: 0, height: 120 },
  wasserzeichen: { position: 'absolute', right: -30, bottom: -30, opacity: 0.04 },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.s + 2 },
  siegel: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  // zweiter, feiner Ring: wirkt wie ein eingeprägtes Siegel
  siegelInnen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titel: { flex: 1, fontFamily: fonts.titel, fontSize: 19, lineHeight: 26, letterSpacing: 1.4, color: colors.moon },
  zier: { marginTop: -spacing.s + 2 },
  ohne: { gap: spacing.m },
});
