import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { ArtMiniatur } from '@/components/ArtMiniatur';
import { Schrift } from '@/components/Schrift';
import type { Ort, TierSeite } from '@/data/tierSeiten';
import { MONATE } from '@/logic/jahreszeit';
import { istVerborgen, katalogEintrag } from '@/logic/katalog';
import { cmZuPunkten, farbMix, nahrungIm } from '@/logic/tierJahr';
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
  const fern = farbMix(colors.forest, colors.fog, nacht ? 0.08 : 0.25);
  const hinten = farbMix(colors.night, colors.forest, 0.5);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 170">
      <Defs>
        <LinearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={himmelOben} />
          <Stop offset="1" stopColor={himmelUnten} />
        </LinearGradient>
        <RadialGradient id="dunst" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.fog} stopOpacity={nacht ? 0.16 : 0.22} />
          <Stop offset="1" stopColor={colors.fog} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="schein" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={nacht ? colors.moon : colors.amber} stopOpacity={0.35} />
          <Stop offset="1" stopColor={nacht ? colors.moon : colors.amber} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={300} height={170} fill="url(#himmel)" />
      <Ellipse cx={262} cy={30} rx={34} ry={34} fill="url(#schein)" />
      {nacht ? (
        <G>
          <Ellipse cx={262} cy={30} rx={10} ry={10} fill={colors.moon} opacity={0.95} />
          {STERNE.map(([x, y], k) => (
            <Ellipse key={k} cx={x} cy={y} rx={k % 3 ? 0.7 : 1.1} ry={k % 3 ? 0.7 : 1.1} fill={colors.moon} />
          ))}
        </G>
      ) : (
        <G>
          <Ellipse cx={262} cy={30} rx={12} ry={12} fill={colors.amber} opacity={0.9} />
          {/* Wolken */}
          <Path
            d="M40 34 C40 26 52 24 56 30 C60 22 76 24 76 33 C84 32 86 40 78 41 L44 41 C36 41 34 35 40 34 Z"
            fill={colors.fog}
            opacity={0.18}
          />
          <Path
            d="M170 22 C170 16 180 14 183 19 C186 13 198 15 198 22 C204 22 205 28 199 28 L173 28 C167 28 166 23 170 22 Z"
            fill={colors.fog}
            opacity={0.14}
          />
        </G>
      )}
      {/* ferne Hügel */}
      <Path d="M0 112 C40 96 80 104 120 98 C170 90 220 100 300 92 L300 140 L0 140 Z" fill={fern} opacity={0.6} />
      {/* hintere Baumreihe */}
      {Array.from({ length: 16 }, (_, k) => {
        const x = k * 8 - 2;
        const h = 34 + ((k * 7) % 11);
        return k % 3 === 1 ? (
          <Path
            key={k}
            d={`M${x} 140 L${x} 126 C${x - 9} 126 ${x - 8} ${140 - h} ${x} ${140 - h} C${x + 8} ${140 - h} ${x + 9} 126 ${x} 126 Z`}
            fill={hinten}
          />
        ) : (
          <Path
            key={k}
            d={`M${x} 140 L${x - 6} 132 L${x - 2} 132 L${x - 5} 124 L${x - 1} 124 L${x} ${140 - h} L${x + 1} 124 L${x + 5} 124 L${x + 2} 132 L${x + 6} 132 Z`}
            fill={hinten}
          />
        );
      })}
      {/* vordere Waldbäume mit Stamm und Krone */}
      {[
        [14, 70, 'n'],
        [38, 58, 'l'],
        [64, 66, 'n'],
        [88, 60, 'l'],
      ].map(([x, top, art]) => {
        const xx = x as number;
        const t = top as number;
        return art === 'n' ? (
          <G key={xx}>
            <Path d={`M${xx - 1.5} 140 L${xx - 1.5} 124 L${xx + 1.5} 124 L${xx + 1.5} 140 Z`} fill={colors.night} />
            {[0, 1, 2, 3, 4].map((k) => {
              const y = 126 - k * ((126 - t) / 5);
              const w = 15 - k * 2.6;
              return (
                <Path
                  key={k}
                  d={`M${xx - w} ${y} L${xx} ${y - 22 + k * 1.5} L${xx + w} ${y} Z`}
                  fill={colors.night}
                  opacity={0.96}
                />
              );
            })}
          </G>
        ) : (
          <G key={xx}>
            <Path
              d={`M${xx - 2} 140 L${xx - 1.2} ${t + 26} L${xx + 1.2} ${t + 26} L${xx + 2} 140 Z M${xx} ${t + 40} L${xx - 9} ${t + 24} M${xx} ${t + 34} L${xx + 8} ${t + 22}`}
              fill={colors.night}
              stroke={colors.night}
              strokeWidth={1.4}
            />
            {[
              [0, 14, 13],
              [-10, 22, 10],
              [10, 21, 10],
              [-5, 6, 9],
              [6, 8, 9],
              [0, 28, 9],
            ].map(([dx, dy, r], k) => (
              <Ellipse key={k} cx={xx + dx} cy={t + dy} rx={r} ry={r * 0.9} fill={colors.night} />
            ))}
          </G>
        );
      })}
      {/* Nebel am Waldfuß */}
      <Ellipse cx={90} cy={136} rx={120} ry={10} fill="url(#dunst)" />
      {/* Hecke am Waldrand mit Beeren */}
      <Path
        d="M100 140 C96 124 108 114 118 120 C120 106 138 104 142 116 C150 108 166 112 166 124 C176 120 188 128 186 140 Z"
        fill={colors.night}
        opacity={0.85}
      />
      {HECKEN_BLAETTER.map(([x, y], k) => (
        <Ellipse
          key={k}
          cx={x}
          cy={y}
          rx={2.6}
          ry={1.5}
          fill={colors.moss}
          opacity={0.55}
          transform={`rotate(${(k * 47) % 180} ${x} ${y})`}
        />
      ))}
      {[
        [118, 126],
        [146, 120],
        [162, 128],
        [132, 132],
      ].map(([x, y]) => (
        <Ellipse key={x} cx={x} cy={y} rx={1.4} ry={1.4} fill={colors.blut} />
      ))}
      {/* Wiese mit Gräsern und Blumen */}
      <Rect x={0} y={140} width={300} height={30} fill={colors.night} />
      {Array.from({ length: 48 }, (_, k) => {
        const x = 188 + k * 2.4;
        return (
          <Line
            key={k}
            x1={x}
            y1={141}
            x2={x + ((k % 3) - 1) * 1.6}
            y2={132 - (k % 5) * 1.6}
            stroke={colors.moss}
            strokeWidth={0.9}
          />
        );
      })}
      {BLUMEN.map(([x, y, f], k) => (
        <G key={k}>
          <Line x1={x} y1={141} x2={x} y2={y} stroke={colors.moss} strokeWidth={0.7} />
          <Ellipse
            cx={x}
            cy={y}
            rx={1.5}
            ry={1.5}
            fill={[colors.amber, colors.moon, colors.rare][f]}
            opacity={nacht ? 0.5 : 0.9}
          />
        </G>
      ))}
      {nacht &&
        GLUEHWUERMCHEN.map(([x, y], k) => (
          <G key={k}>
            <Ellipse cx={x} cy={y} rx={4} ry={4} fill="url(#schein)" />
            <Ellipse cx={x} cy={y} rx={0.9} ry={0.9} fill={colors.amber} />
          </G>
        ))}
      <Line x1={0} y1={140} x2={300} y2={140} stroke={colors.moss} strokeWidth={1.5} />
    </Svg>
  );
}

const STERNE: [number, number][] = [
  [40, 20],
  [120, 14],
  [180, 34],
  [215, 12],
  [90, 40],
  [24, 48],
  [150, 22],
  [236, 52],
  [70, 12],
  [200, 46],
];
const HECKEN_BLAETTER: [number, number][] = Array.from({ length: 30 }, (_, k) => [
  104 + ((k * 29) % 80),
  116 + ((k * 13) % 22),
]);
const BLUMEN: [number, number, number][] = Array.from({ length: 14 }, (_, k) => [
  194 + ((k * 37) % 100),
  130 - ((k * 7) % 8),
  k % 3,
]);
const GLUEHWUERMCHEN: [number, number][] = [
  [196, 112],
  [222, 120],
  [250, 104],
  [176, 98],
  [276, 116],
  [120, 96],
];

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
              {/* in welchen Monaten es das gibt */}
              <View style={stile.balken}>
                {MONATE.map((m, k) => (
                  <View
                    key={m}
                    style={[
                      stile.strich,
                      n.monate.includes(k + 1) && { backgroundColor: colors.amber },
                      k + 1 === monat && stile.strichJetzt,
                    ]}
                  />
                ))}
              </View>
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
      {offen === 'tritt' && <Faehrte />}
    </TierTafel>
  );
}

/** Fährte: mehrere Trittsiegel hintereinander, leicht versetzt (so sieht eine Spur im Schnee oder Matsch aus) */
function Faehrte() {
  return (
    <View style={stile.faehrte} accessibilityLabel="Fährte">
      <Svg width="100%" height="100%" viewBox="0 0 300 60">
        <Path
          d="M0 46 C60 40 120 50 180 42 C230 36 270 44 300 40"
          stroke={colors.moss}
          strokeWidth={22}
          opacity={0.35}
          fill="none"
        />
        {Array.from({ length: 9 }, (_, k) => {
          const x = 18 + k * 33;
          const y = 42 + (k % 2 === 0 ? -7 : 7) + Math.sin(k) * 1.5;
          return (
            <G key={k} transform={`translate(${x} ${y}) rotate(90) scale(0.55)`}>
              <Path d="M-2 -14 C-8 -10 -9 4 -6 12 C-3 13 -1 10 -1 6 Z" fill={colors.night} />
              <Path d="M2 -14 C8 -10 9 4 6 12 C3 13 1 10 1 6 Z" fill={colors.night} />
            </G>
          );
        })}
        <Path
          d="M262 16 L290 16 M282 10 L290 16 L282 22"
          stroke={colors.fog}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
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
          <View style={[stile.gefahrZiel, r.kitz && stile.gefahrKitz]}>
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
  balken: { flexDirection: 'row', gap: 1, marginTop: 2 },
  strich: { width: 3, height: 5, borderRadius: 1, backgroundColor: colors.moss },
  strichJetzt: { height: 8, marginTop: -1.5, borderWidth: 0.5, borderColor: colors.moon },
  faehrte: { width: '100%', aspectRatio: 5, borderRadius: radius.m, backgroundColor: colors.night, overflow: 'hidden' },
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
  gefahrKitz: { width: 66, height: 60, marginHorizontal: 15 },
  kitzBild: { width: '100%', aspectRatio: 300 / 120 },
  kitzFigur: { position: 'absolute', left: '18%', top: '8%', width: '48%', height: '100%' },
  kitzStopp: { position: 'absolute', right: '6%', top: '14%' },
  kitzText: { fontFamily: fonts.hand, fontSize: 19, lineHeight: 25, color: colors.amber, textAlign: 'center' },
});
