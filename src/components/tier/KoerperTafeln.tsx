import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { TierSeite } from '@/data/tierSeiten';
import { colors, fonts, spacing } from '@/theme/theme';

import { RehFigur } from './RehFigur';
import { Leuchtpunkt, SymbolSchalter, TierTafel } from './TierTafel';
import { TierSymbol } from './TierSymbol';

// ---------- Größe: Reh neben dir ----------

/** Zeichenfläche 300 × 200, Boden bei y = 185, 0,85 Einheiten pro Zentimeter */
const BODEN = 185;
const PRO_CM = 0.85;
// Reh-Zeichnung: Schulter bei y = 60, Boden bei y = 150 → 90 Einheiten ≙ mittlere Schulterhöhe
const REH_X = 150;

/** Mensch als schlichte Silhouette, Höhe 1 (Füße bei 0, Scheitel bei −1), Breite ca. 0,3 */
const MENSCH =
  'M0 -1 C0.06 -1 0.075 -0.95 0.075 -0.92 C0.075 -0.88 0.05 -0.86 0.035 -0.855 L0.035 -0.84 C0.1 -0.83 0.13 -0.8 0.135 -0.74 L0.15 -0.5 L0.115 -0.5 L0.1 -0.7 L0.095 -0.48 L0.085 0 L0.025 0 L0.01 -0.42 L-0.01 -0.42 L-0.025 0 L-0.085 0 L-0.095 -0.48 L-0.1 -0.7 L-0.115 -0.5 L-0.15 -0.5 L-0.135 -0.74 C-0.13 -0.8 -0.1 -0.83 -0.035 -0.84 L-0.035 -0.855 C-0.05 -0.86 -0.075 -0.88 -0.075 -0.92 C-0.075 -0.95 -0.06 -1 0 -1 Z';

export function GroessenVergleich({ tier }: { tier: TierSeite }) {
  const [du, setDu] = useState(160);
  const [s1, s2] = tier.groesse.schulterCm;
  const mitte = (s1 + s2) / 2;
  // Reh so skalieren, dass seine mittlere Schulterhöhe stimmt
  const rehMass = (mitte * PRO_CM) / 90; // Einheiten pro Zeichen-Einheit
  const rehBreite = 200 * rehMass;
  const rehHoehe = 180 * rehMass;
  const rehOben = BODEN + 6 * rehMass - rehHoehe;
  const y = (cm: number) => BODEN - cm * PRO_CM;

  return (
    <TierTafel symbol="lineal" titel="So groß" geste="ziehen">
      <View style={stile.flaeche}>
        <Svg width="100%" height="100%" viewBox="0 0 300 200">
          {/* Maßstab links */}
          <Line x1={22} y1={BODEN} x2={22} y2={y(200)} stroke={colors.fog} strokeWidth={1} opacity={0.5} />
          {[0, 50, 100, 150, 200].map((cm) => (
            <G key={cm}>
              <Line x1={16} y1={y(cm)} x2={28} y2={y(cm)} stroke={colors.fog} strokeWidth={1} opacity={0.6} />
              <SvgText x={12} y={y(cm) + 3} fontSize={8} fill={colors.fog} textAnchor="end" fontFamily={fonts.type}>
                {cm}
              </SvgText>
            </G>
          ))}
          {/* Band der Schulterhöhe */}
          <Rect x={22} y={y(s2)} width={260} height={(s2 - s1) * PRO_CM} fill={colors.amber} opacity={0.14} />
          <Line
            x1={22}
            y1={y(mitte)}
            x2={282}
            y2={y(mitte)}
            stroke={colors.amber}
            strokeDasharray="4 4"
            strokeWidth={1}
            opacity={0.7}
          />
          {/* Du */}
          <Path d={MENSCH} fill={colors.moss} transform={`translate(85 ${BODEN}) scale(${du * PRO_CM})`} />
          <Line x1={60} y1={y(du)} x2={110} y2={y(du)} stroke={colors.rune} strokeWidth={1} opacity={0.8} />
          {/* Boden */}
          <Line x1={8} y1={BODEN} x2={292} y2={BODEN} stroke={colors.moss} strokeWidth={1.5} />
        </Svg>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${(REH_X / 300) * 100}%`,
            top: `${(rehOben / 200) * 100}%`,
            width: `${(rehBreite / 300) * 100}%`,
            height: `${(rehHoehe / 200) * 100}%`,
          }}
        >
          <RehFigur farben={tier.farben} geweih={{ art: 'blank', groesse: 1 }} />
        </View>
      </View>
      <View style={stile.zahlen}>
        <Wert symbol="lineal" text={`${s1}–${s2} cm`} farbe={colors.amber} />
        <Wert
          symbol="waage"
          text={`${tier.groesse.gewichtKg[0]}–${tier.groesse.gewichtKg[1]} kg`}
          farbe={colors.amber}
        />
        <Wert symbol="tippen" text={`Du: ${du} cm`} farbe={colors.rune} />
      </View>
      <Slider
        value={du}
        minimumValue={110}
        maximumValue={200}
        step={1}
        onValueChange={setDu}
        minimumTrackTintColor={colors.rune}
        maximumTrackTintColor={colors.moss}
        thumbTintColor={colors.rune}
        accessibilityLabel={`Deine Größe: ${du} Zentimeter`}
      />
    </TierTafel>
  );
}

function Wert({ symbol, text, farbe }: { symbol: 'lineal' | 'waage' | 'tippen'; text: string; farbe: string }) {
  return (
    <View style={stile.wert}>
      <TierSymbol name={symbol} groesse={18} farbe={farbe} />
      <Schrift style={[stile.wertText, { color: farbe }]}>{text}</Schrift>
    </View>
  );
}

// ---------- Körper erkunden ----------

export function KoerperErkunden({ tier, ruhig }: { tier: TierSeite; ruhig: boolean }) {
  const [bock, setBock] = useState(true);
  const [wahl, setWahl] = useState<string | null>(null);
  const punkte = tier.koerper.filter((p) => bock || !p.nurBock);
  const gewaehlt = punkte.find((p) => p.id === wahl);

  return (
    <TierTafel symbol="auge" titel="Erkunden" geste="tippen">
      <SymbolSchalter
        wahl={bock ? 'bock' : 'ricke'}
        optionen={[
          { wert: 'bock', symbol: 'geweih', name: 'Bock' },
          { wert: 'ricke', symbol: 'herz', name: 'Ricke' },
        ]}
        onWahl={(w) => {
          setBock(w === 'bock');
          setWahl(null);
        }}
      />
      <View style={stile.figur}>
        <RehFigur farben={tier.farben} geweih={bock ? { art: 'blank', groesse: 1 } : undefined} />
        {punkte.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setWahl(p.id === wahl ? null : p.id)}
            accessibilityRole="button"
            accessibilityLabel={p.kurz}
            hitSlop={8}
            style={[stile.punktOrt, { left: `${(p.x / 200) * 100}%`, top: `${((p.y + 24) / 180) * 100}%` }]}
          >
            <Leuchtpunkt an={p.id === wahl} ruhig={ruhig} />
          </Pressable>
        ))}
      </View>
      <View style={[stile.hinweis, !gewaehlt && { opacity: 0.4 }]}>
        <View style={stile.hinweisSymbol}>
          <TierSymbol name={gewaehlt ? gewaehlt.icon : 'tippen'} groesse={30} farbe={colors.amber} />
        </View>
        <Schrift style={stile.hinweisText}>{gewaehlt ? gewaehlt.kurz : '…'}</Schrift>
      </View>
    </TierTafel>
  );
}

const stile = StyleSheet.create({
  flaeche: { width: '100%', aspectRatio: 1.5 },
  zahlen: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.s },
  wert: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wertText: { fontFamily: fonts.type, fontSize: 14 },
  figur: { width: '100%', aspectRatio: 200 / 180 },
  punktOrt: { position: 'absolute', marginLeft: -15, marginTop: -15 },
  hinweis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: 56,
    paddingHorizontal: spacing.m,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.amber,
    backgroundColor: colors.night,
  },
  hinweisSymbol: { width: 36, alignItems: 'center' },
  hinweisText: { flex: 1, fontFamily: fonts.hand, fontSize: 20, lineHeight: 26, color: colors.amber },
});
