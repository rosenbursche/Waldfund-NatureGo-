import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { ArtMiniatur } from '@/components/ArtMiniatur';
import { Schrift } from '@/components/Schrift';
import type { Ort, TierSeite } from '@/data/tierSeiten';
import { MONATE } from '@/logic/jahreszeit';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { cmZuPunkten, nahrungIm } from '@/logic/tierJahr';
import { SELTENHEIT } from '@/data/spiel';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { RehFigur } from './RehFigur';
import { SymbolSchalter, TierTafel } from './TierTafel';
import { SpurBild, TierSymbol, type SpurFarben, type SymbolName } from './TierSymbol';
import { Chip } from './ZeitTafeln';

// ---------- Lebensraum ----------

const ZONEN: { ort: Ort; von: number; bis: number; symbol: SymbolName }[] = [
  { ort: 'wald', von: 0, bis: 100, symbol: 'baum' },
  { ort: 'rand', von: 100, bis: 190, symbol: 'gebuesch' },
  { ort: 'wiese', von: 190, bis: 300, symbol: 'wiese' },
];
const REH_IN: Record<Ort, number> = { wald: 52, rand: 146, wiese: 246 };

/** Landschaft im Querschnitt: Wald – Waldrand mit Hecke – Wiese (300 × 170, Boden bei y = 140) */
function Landschaft({ nacht }: { nacht: boolean }) {
  const himmelOben = nacht ? colors.night : colors.forest;
  const himmelUnten = nacht ? colors.forest : colors.moss;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Defs>
        <LinearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={himmelOben} />
          <Stop offset="1" stopColor={himmelUnten} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={300} height={170} fill="url(#himmel)" />
      {nacht ? (
        <G>
          <Ellipse cx={262} cy={30} rx={11} ry={11} fill={colors.moon} opacity={0.9} />
          {[
            [40, 20],
            [120, 14],
            [180, 34],
            [215, 12],
            [90, 40],
          ].map(([x, y]) => (
            <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={1} ry={1} fill={colors.moon} />
          ))}
        </G>
      ) : (
        <Ellipse cx={262} cy={30} rx={13} ry={13} fill={colors.amber} opacity={0.85} />
      )}
      {/* Wald: Fichten und Laubbäume als Schattenriss */}
      {[10, 34, 58, 82].map((x, i) => (
        <Path
          key={x}
          d={
            i % 2 === 0
              ? `M${x} 140 L${x} 120 L${x - 14} 120 L${x} 60 L${x + 14} 120 L${x} 120 Z`
              : `M${x} 140 L${x} 108 C${x - 22} 108 ${x - 20} 68 ${x} 66 C${x + 20} 68 ${x + 22} 108 ${x} 108 Z`
          }
          fill={colors.night}
          opacity={0.95}
        />
      ))}
      {/* Hecke am Waldrand */}
      <Path
        d="M100 140 C96 124 108 114 118 120 C120 106 138 104 142 116 C150 108 166 112 166 124 C176 120 188 128 186 140 Z"
        fill={colors.night}
        opacity={0.75}
      />
      {/* Wiese */}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {Array.from({ length: 34 }, (_, i) => {
        const x = 192 + i * 3.2;
        return (
          <Line
            key={i}
            x1={x}
            y1={141}
            x2={x + ((i % 3) - 1) * 1.5}
            y2={133 - (i % 4) * 2}
            stroke={colors.moss}
            strokeWidth={1}
          />
        );
      })}
      <Line x1={0} y1={140} x2={300} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

export function LebensraumBild({ tier }: { tier: TierSeite }) {
  const [nacht, setNacht] = useState(false);
  const [wahl, setWahl] = useState<Ort | null>(null);
  const ort = nacht ? tier.lebensraum.nacht : tier.lebensraum.tag;
  const zone = ZONEN.find((z) => z.ort === (wahl ?? ort))!;

  return (
    <TierTafel symbol="baum" titel="Zuhause" geste="tippen">
      <SymbolSchalter
        wahl={nacht ? 'nacht' : 'tag'}
        optionen={[
          { wert: 'tag', symbol: 'sonne', name: 'Tag' },
          { wert: 'nacht', symbol: 'mond', name: 'Dämmerung' },
        ]}
        onWahl={(w) => setNacht(w === 'nacht')}
      />
      <View style={stile.landschaft}>
        <Landschaft nacht={nacht} />
        {/* gewählte Zone leicht hervorheben */}
        <View
          pointerEvents="none"
          style={[
            stile.zoneLicht,
            { left: `${(zone.von / 300) * 100}%`, width: `${((zone.bis - zone.von) / 300) * 100}%` },
          ]}
        />
        <View pointerEvents="none" style={[stile.reh, { left: `${((REH_IN[ort] - 34) / 300) * 100}%` }]}>
          <RehFigur farben={tier.farben} pose={ort === 'wiese' ? 'aest' : 'steht'} licht={nacht} />
        </View>
        {ZONEN.map((z) => (
          <Pressable
            key={z.ort}
            onPress={() => setWahl(z.ort)}
            accessibilityRole="button"
            accessibilityLabel={tier.lebensraum.orte[z.ort]}
            style={[stile.zone, { left: `${(z.von / 300) * 100}%`, width: `${((z.bis - z.von) / 300) * 100}%` }]}
          />
        ))}
      </View>
      <View style={stile.reihe}>
        {ZONEN.map((z) => (
          <Chip
            key={z.ort}
            symbol={z.symbol}
            text={tier.lebensraum.orte[z.ort]}
            farbe={z.ort === zone.ort ? colors.amber : z.ort === ort ? colors.moon : colors.fog}
          />
        ))}
      </View>
    </TierTafel>
  );
}

// ---------- Speiseplan ----------

export function Speiseplan({
  tier,
  monat,
  setMonat,
  children,
}: {
  tier: TierSeite;
  monat: number;
  setMonat: (m: number) => void;
  children?: ReactNode;
}) {
  const jetzt = nahrungIm(tier, monat).map((n) => n.icon);
  return (
    <TierTafel symbol="kraut" titel="Speiseplan" geste="tippen">
      <View style={stile.monate}>
        {MONATE.map((m, i) => {
          const an = i + 1 === monat;
          return (
            <Pressable
              key={m}
              onPress={() => setMonat(i + 1)}
              accessibilityRole="button"
              accessibilityLabel={m}
              hitSlop={4}
              style={[stile.monat, an && stile.monatAn]}
            >
              <Schrift style={[stile.monatText, an && { color: colors.night }]}>{m[0]}</Schrift>
            </Pressable>
          );
        })}
      </View>
      <View style={stile.teller}>
        {tier.nahrung.map((n) => {
          const da = jetzt.includes(n.icon);
          return (
            <View key={n.icon} style={[stile.tellerEintrag, !da && { opacity: 0.28 }]}>
              <View style={[stile.tellerKreis, da && { borderColor: colors.amber }]}>
                <TierSymbol name={n.icon} groesse={30} farbe={da ? colors.amber : colors.fog} />
              </View>
              <Schrift style={stile.tellerText}>{n.kurz}</Schrift>
            </View>
          );
        })}
      </View>
      {children}
    </TierTafel>
  );
}

// ---------- Spuren ----------

export function SpurenKarten({ tier }: { tier: TierSeite }) {
  const [offen, setOffen] = useState<string | null>(null);
  const [echt, setEcht] = useState(false);
  const tritt = tier.spuren.find((s) => s.icon === 'tritt');

  return (
    <TierTafel symbol="tritt" titel="Spuren lesen" geste="tippen">
      <View style={stile.karten}>
        {tier.spuren.map((s) => {
          const auf = offen === s.icon;
          return (
            <Pressable
              key={s.icon}
              onPress={() => setOffen(auf ? null : s.icon)}
              accessibilityRole="button"
              accessibilityLabel={s.kurz}
              style={[stile.karte, auf && { borderColor: colors.amber }]}
            >
              <View style={auf ? stile.spurKlein : stile.spurGross}>
                <SpurBild name={s.icon} farben={spurFarben(tier)} />
              </View>
              {auf && <Schrift style={stile.karteText}>{s.kurz}</Schrift>}
              {auf && s.cm && <Schrift style={stile.karteZahl}>{`${s.cm[0]}–${s.cm[1]} cm`}</Schrift>}
            </Pressable>
          );
        })}
      </View>
      {tritt?.cm && (
        <Pressable
          onPress={() => setEcht(!echt)}
          accessibilityRole="button"
          accessibilityLabel="Trittsiegel in Originalgröße"
          style={[stile.echtKnopf, echt && { backgroundColor: colors.amber }]}
        >
          <TierSymbol name="lineal" groesse={18} farbe={echt ? colors.night : colors.amber} />
          <Schrift style={[stile.echtText, echt && { color: colors.night }]}>1 : 1</Schrift>
        </Pressable>
      )}
      {echt && tritt?.cm && <Originalgroesse cm={(tritt.cm[0] + tritt.cm[1]) / 2} />}
    </TierTafel>
  );
}

/** Trittsiegel in (ungefähr) echter Größe mit Zentimeter-Lineal – zum Vergleichen im Wald */
function Originalgroesse({ cm }: { cm: number }) {
  const hoehe = cmZuPunkten(cm);
  // Das Symbol füllt im 24er-Raster die Höhe 3 … 20 (17 Einheiten)
  const groesse = (hoehe * 24) / 17;
  const lineal = cmZuPunkten(6);
  return (
    <View style={stile.echt}>
      <View style={{ width: groesse, height: hoehe, overflow: 'visible', alignItems: 'center' }}>
        <View style={{ marginTop: (-3 / 24) * groesse }}>
          <TierSymbol name="tritt" groesse={groesse} farbe={colors.moon} dicke={1} />
        </View>
      </View>
      <Svg width={34} height={lineal + 4}>
        <Line x1={4} y1={2} x2={4} y2={lineal + 2} stroke={colors.fog} strokeWidth={1.5} />
        {Array.from({ length: 7 }, (_, i) => (
          <G key={i}>
            <Line
              x1={4}
              y1={2 + cmZuPunkten(i)}
              x2={14}
              y2={2 + cmZuPunkten(i)}
              stroke={colors.fog}
              strokeWidth={1.2}
            />
            <SvgText x={18} y={6 + cmZuPunkten(i)} fontSize={9} fill={colors.fog} fontFamily={fonts.type}>
              {i}
            </SvgText>
          </G>
        ))}
      </Svg>
      <Schrift art="klein" style={{ flex: 1 }}>
        ≈ echte Größe
      </Schrift>
    </View>
  );
}

/** Farben der Spuren-Zeichnungen: Boden und Holz aus dem Theme, Losung/Knospen aus den Fellfarben */
function spurFarben(t: TierSeite): SpurFarben {
  return {
    boden: colors.moss,
    tief: t.farben.dunkel,
    kante: colors.moss,
    glanz: colors.moon,
    holz: t.farben.winter,
    hell: t.farben.hell,
    knospe: t.farben.sommer,
    markierung: colors.amber,
  };
}

// ---------- Gefahren ----------

export function Gefahren({ tier, sammlung }: { tier: TierSeite; sammlung: Record<string, unknown> }) {
  const reihen = [
    { kitz: false, liste: tier.gefahren.filter((g) => !g.nurKitz) },
    { kitz: true, liste: tier.gefahren.filter((g) => g.nurKitz) },
  ];
  return (
    <TierTafel symbol="wolf" titel="Gefahren" geste="tippen">
      {reihen.map((r) => (
        <View key={String(r.kitz)} style={stile.gefahrReihe}>
          <View style={stile.gefahrQuellen}>
            {r.liste.map((g) => (
              <Gefahr key={g.kurz} gefahr={g} sammlung={sammlung} />
            ))}
          </View>
          <Svg width={34} height={20}>
            <Path
              d="M2 10 L28 10 M22 4 L29 10 L22 16"
              stroke={colors.warn}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <View style={stile.gefahrZiel}>
            <RehFigur farben={tier.farben} flecken={r.kitz} />
          </View>
        </View>
      ))}
    </TierTafel>
  );
}

function Gefahr({ gefahr, sammlung }: { gefahr: TierSeite['gefahren'][number]; sammlung: Record<string, unknown> }) {
  const e = gefahr.artId ? katalogEintrag(gefahr.artId) : undefined;
  const inhalt = (
    <>
      <View style={stile.gefahrKreis}>
        {e ? (
          <ArtMiniatur
            modell={e.modell}
            baumModell={e.baumModell}
            stil={gefahr.artId! in sammlung ? 'farbe' : istVerborgen(gefahr.artId!, sammlung) ? 'verborgen' : 'umriss'}
            akzent={SELTENHEIT[e.seltenheit].farbe}
            groesse={40}
          />
        ) : (
          <TierSymbol name={gefahr.icon ?? 'wolf'} groesse={32} farbe={colors.fog} />
        )}
      </View>
      <Schrift style={stile.gefahrText}>{gefahr.kurz}</Schrift>
    </>
  );
  if (!e)
    return (
      <View style={stile.gefahr} accessible accessibilityLabel={gefahr.kurz}>
        {inhalt}
      </View>
    );
  return (
    <Pressable
      style={stile.gefahr}
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: gefahr.artId! } })}
      accessibilityRole="button"
      accessibilityLabel={gefahr.kurz}
    >
      {inhalt}
    </Pressable>
  );
}

// ---------- Kitz-Regel ----------

export function KitzRegel({ tier, text }: { tier: TierSeite; text?: string }) {
  return (
    <TierTafel symbol="stopp" titel="Kitz gefunden?">
      <View style={stile.kitzBild}>
        <Svg width="100%" height="100%" viewBox="0 0 300 120" style={StyleSheet.absoluteFill}>
          {Array.from({ length: 60 }, (_, i) => {
            const x = 4 + i * 5;
            const h = 22 + ((i * 37) % 23);
            return (
              <Line
                key={i}
                x1={x}
                y1={118}
                x2={x + ((i % 5) - 2) * 2}
                y2={118 - h}
                stroke={colors.moss}
                strokeWidth={1.4}
              />
            );
          })}
        </Svg>
        <View style={stile.kitzFigur}>
          <RehFigur farben={tier.farben} pose="liegt" flecken />
        </View>
        {/* ein paar Halme vor dem Kitz: es liegt gut versteckt */}
        <Svg width="100%" height="100%" viewBox="0 0 300 120" style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 22 }, (_, i) => {
            const x = 60 + i * 6.5;
            return (
              <Line
                key={i}
                x1={x}
                y1={120}
                x2={x + ((i % 3) - 1) * 3}
                y2={96 - ((i * 13) % 14)}
                stroke={colors.moss}
                strokeWidth={1.6}
              />
            );
          })}
        </Svg>
        <View style={stile.kitzStopp}>
          <TierSymbol name="stopp" groesse={64} farbe={colors.warn} dicke={1.8} />
        </View>
      </View>
      {text ? <Schrift style={stile.kitzText}>{text}</Schrift> : null}
    </TierTafel>
  );
}

const stile = StyleSheet.create({
  landschaft: { width: '100%', aspectRatio: 300 / 170, borderRadius: radius.m, overflow: 'hidden' },
  zoneLicht: { position: 'absolute', top: 0, bottom: 0, backgroundColor: colors.amber, opacity: 0.08 },
  zone: { position: 'absolute', top: 0, bottom: 0 },
  reh: { position: 'absolute', top: '40%', width: '23%', height: '52%' },
  reihe: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, justifyContent: 'center' },
  monate: { flexDirection: 'row', justifyContent: 'space-between' },
  monat: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.moss,
  },
  monatAn: { backgroundColor: colors.amber, borderColor: colors.amber },
  monatText: { fontFamily: fonts.type, fontSize: 11, color: colors.fog },
  teller: { flexDirection: 'row', justifyContent: 'space-between' },
  tellerEintrag: { alignItems: 'center', gap: 4, width: '19%' },
  tellerKreis: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  tellerText: { fontFamily: fonts.hand, fontSize: 13, lineHeight: 16, color: colors.moon, textAlign: 'center' },
  karten: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  karte: {
    width: '48.5%',
    aspectRatio: 1.15,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: spacing.s,
  },
  spurGross: { width: '100%', height: '80%' },
  spurKlein: { width: '70%', height: '50%' },
  karteText: { fontFamily: fonts.hand, fontSize: 17, lineHeight: 21, color: colors.amber, textAlign: 'center' },
  karteZahl: { fontFamily: fonts.type, fontSize: 13, color: colors.moon },
  echtKnopf: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  echtText: { fontFamily: fonts.type, fontSize: 14, color: colors.amber },
  echt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.l,
    padding: spacing.m,
    borderRadius: radius.m,
    backgroundColor: colors.night,
  },
  gefahrReihe: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  gefahrQuellen: { flex: 1, flexDirection: 'row', gap: spacing.s },
  gefahr: { alignItems: 'center', gap: 4, width: 64 },
  gefahrKreis: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.warn,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  gefahrText: { fontFamily: fonts.hand, fontSize: 14, lineHeight: 17, color: colors.moon, textAlign: 'center' },
  gefahrZiel: { width: 96, height: 86 },
  kitzBild: { width: '100%', aspectRatio: 300 / 120 },
  kitzFigur: { position: 'absolute', left: '18%', top: '8%', width: '48%', height: '100%' },
  kitzStopp: { position: 'absolute', right: '6%', top: '14%' },
  kitzText: { fontFamily: fonts.hand, fontSize: 19, lineHeight: 25, color: colors.amber, textAlign: 'center' },
});
