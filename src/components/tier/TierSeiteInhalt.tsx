import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { Art, Seltenheit } from '@/data/artTypen';
import { SELTENHEIT } from '@/data/spiel';
import type { TierSeite } from '@/data/tierSeiten';
import { berechneWildWert } from '@/logic/wildwert';
import { colors, fonts, spacing } from '@/theme/theme';

import { GroessenVergleich, KoerperErkunden } from './KoerperTafeln';
import { TierSymbol } from './TierSymbol';
import { Gefahren, Hinweis, LebensraumBild, SpurenKarten, Speiseplan } from './UmweltTafeln';
import { Jahresrad, TagesUhr } from './ZeitTafeln';
import { Bildnachweis } from './TierFoto';
import type { FotoId } from '@/data/fotos';

/**
 * Grafische Tierseite (Reh, Fuchs …): Jeder Abschnitt ist ein Bild zum Antippen oder Ziehen –
 * Größe, Körper, Jahr, Tag, Zuhause, Futter, Spuren, Gefahren. Text nur als kurze Beschriftung.
 *
 * `futterArten`: Verweise auf Futterpflanzen in der App (wird unter dem Speiseplan gezeigt).
 */
export function TierSeiteInhalt({
  id,
  tier,
  art,
  sammlung,
  ruhig,
  futterArten,
}: {
  id: string;
  tier: TierSeite;
  art?: Art;
  sammlung: Record<string, unknown>;
  ruhig: boolean;
  futterArten?: ReactNode;
}) {
  // Gemeinsamer Monat für Jahresrad und Speiseplan (Start: jetzt)
  const [monat, setMonat] = useState(() => new Date().getMonth() + 1);
  return (
    <View style={stile.inhalt}>
      <WildWertBogen id={id} art={art} />
      <GroessenVergleich tier={tier} />
      <KoerperErkunden tier={tier} ruhig={ruhig} />
      <Jahresrad tier={tier} monat={monat} setMonat={setMonat} />
      <TagesUhr tier={tier} />
      <LebensraumBild tier={tier} />
      <Speiseplan tier={tier} monat={monat} setMonat={setMonat}>
        {futterArten}
      </Speiseplan>
      <SpurenKarten tier={tier} />
      <Gefahren tier={tier} sammlung={sammlung} />
      <Hinweis
        tier={tier}
        text={
          tier.hinweis.text === 'eigen'
            ? tier.hinweis.eigenerText
            : tier.hinweis.text === 'gefahr'
              ? art?.gefahr
              : art?.wusstestDu
        }
      />
      <Bildnachweis ids={alleFotos(tier)} />
    </View>
  );
}

/** Alle Fotos einer Tierseite (für den Bildnachweis); `mitLandschaft`: auch Panorama und Nahfotos (lebendige Seite) */
export function alleFotos(tier: TierSeite, mitLandschaft = false): FotoId[] {
  const f = tier.fotos;
  const p = tier.lebensraum.panorama;
  const landschaft = p && mitLandschaft ? [p.foto, ...(p.orte ?? [])] : [];
  if (!f) return landschaft.filter((x): x is FotoId => !!x);
  const liste: (FotoId | undefined)[] = [
    f.hero,
    f.erkunden?.maennlich?.foto,
    f.erkunden?.weiblich?.foto,
    f.erkunden?.alle?.foto,
    f.sommer,
    f.winter,
    f.jung,
    f.aktiv,
    f.ruhe,
    f.hinweis,
    ...Object.values(f.spuren ?? {}),
    ...landschaft,
  ];
  return liste.filter((x): x is FotoId => !!x);
}

// ---------- Wild-Wert als Zeiger ----------

const STUFEN = [
  { bis: 30, farbe: colors.fog },
  { bis: 55, farbe: colors.rune },
  { bis: 80, farbe: colors.rare },
  { bis: 100, farbe: colors.legend },
];

/** Halbkreis-Anzeige 0–100 (Zeichenfläche 200 × 120, Mitte 100/100, Radius 80) */
function WildWertBogen({ id, art }: { id: string; art?: Art }) {
  const w = berechneWildWert(id);
  const p = (wert: number, r: number) => {
    const a = Math.PI * (1 - wert / 100); // 0 → links, 100 → rechts
    return [100 + r * Math.cos(a), 100 - r * Math.sin(a)];
  };
  const farbe = STUFEN.find((s) => w.wert <= s.bis)!.farbe;
  const [zx, zy] = p(w.wert, 66);
  const seltenheit: Seltenheit = art?.seltenheit ?? 1;

  return (
    <View
      style={stile.wild}
      accessible
      accessibilityLabel={`Wild-Wert ${w.wert} von 100. ${w.bedroht ?? (w.vorwarnung ? 'Auf der Vorwarnliste' : 'Nicht bedroht')}`}
    >
      <View style={stile.bogen}>
        <Svg width="100%" height="100%" viewBox="0 0 200 116">
          {STUFEN.map((s, i) => {
            const [x0, y0] = p((i === 0 ? 0 : STUFEN[i - 1].bis) + 1, 80);
            const [x1, y1] = p(s.bis - 1, 80);
            const d = `M${x0} ${y0} A80 80 0 0 1 ${x1} ${y1}`;
            return <Path key={s.bis} d={d} stroke={s.farbe} strokeWidth={12} fill="none" opacity={0.85} />;
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const [a1, b1] = p(i * 10, 90);
            const [a2, b2] = p(i * 10, 95);
            return <Line key={i} x1={a1} y1={b1} x2={a2} y2={b2} stroke={colors.fog} strokeWidth={1} />;
          })}
          <Line x1={100} y1={100} x2={zx} y2={zy} stroke={colors.moon} strokeWidth={3} strokeLinecap="round" />
          <Circle cx={100} cy={100} r={6} fill={colors.moon} />
          <SvgText x={100} y={84} fontSize={30} fontFamily={fonts.titel} fill={farbe} textAnchor="middle">
            {w.wert}
          </SvgText>
        </Svg>
      </View>
      <View style={stile.wildRechts}>
        <Schrift art="etikett">Wild-Wert</Schrift>
        {/* Seltenheit als Edelsteine: 1 = häufig … 4 = legendär */}
        <View style={stile.steine} accessibilityLabel={SELTENHEIT[seltenheit].name}>
          {[1, 2, 3, 4].map((i) => (
            <Svg key={i} width={18} height={18} viewBox="0 0 24 24">
              <G>
                <Path
                  d="M12 2 L20 9 L12 22 L4 9 Z"
                  stroke={SELTENHEIT[seltenheit].farbe}
                  strokeWidth={1.6}
                  fill={i <= seltenheit ? SELTENHEIT[seltenheit].farbe : 'none'}
                />
              </G>
            </Svg>
          ))}
        </View>
        <View style={stile.zeile}>
          <TierSymbol name="schild" groesse={18} farbe={w.bedroht ? colors.warn : colors.rune} />
          <Schrift style={[stile.zustand, { color: w.bedroht ? colors.warn : colors.rune }]}>
            {w.bedroht ?? (w.vorwarnung ? 'Vorwarnliste' : 'Nicht bedroht')}
          </Schrift>
        </View>
      </View>
    </View>
  );
}

const stile = StyleSheet.create({
  inhalt: { gap: spacing.m },
  wild: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  bogen: { width: '48%', aspectRatio: 200 / 116 },
  wildRechts: { flex: 1, gap: 6 },
  steine: { flexDirection: 'row', gap: 4 },
  zeile: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  zustand: { fontFamily: fonts.notiz, fontSize: 17, lineHeight: 22 },
});
