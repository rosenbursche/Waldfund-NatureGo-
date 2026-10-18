import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { Art, RoteListe, Schutz, Seltenheit } from '@/data/artTypen';
import { ROTE_LISTE_NAME, SCHUTZ_NAME, SELTENHEIT } from '@/data/spiel';
import { berechneWildWert } from '@/logic/wildwert';
import { colors, fonts } from '@/theme/theme';

import { SCHUTZ_FARBE } from './Abzeichen';

/**
 * Wappen: gezeichnete Abzeichen als Medaillons (fester Baustein, siehe docs/DESIGNSYSTEM.md).
 * Jede Art von Wappen hat eine eigene FORM, nicht nur eine eigene Farbe – so erkennt man sie auch ohne Farbsehen:
 * - Wild-Wert: runde Skala mit Zahl
 * - Seltenheit: häufig = Kreis mit Blatt, selten = Sechseck, sehr selten = Schild mit Stern,
 *   legendär = achtzackiger Stern mit Krone und Strahlen
 * - geschützt: Schild mit Haken · gefährdet (Rote Liste): Schild mit Ausrufezeichen · giftig: Raute mit Tropfen
 * Gezeichnet im Raster 100 × 100.
 */

type Props = { groesse?: number };

function Rahmen({
  groesse = 64,
  farbe,
  name,
  beschriftung,
  label,
  children,
}: {
  groesse?: number;
  farbe: string;
  name: string;
  beschriftung: string;
  /** Vorlesetext, falls er mehr sagt als die Beschriftung (z. B. mit Zahl) */
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[stile.wappen, { width: groesse + 14 }]} accessible accessibilityLabel={label ?? beschriftung}>
      <Svg width={groesse} height={groesse} viewBox="0 0 100 100">
        <Defs>
          {/* Schein hinter dem Medaillon in der Farbe des Wappens */}
          <RadialGradient id={`schein-${name}`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0.55" stopColor={farbe} stopOpacity={0.32} />
            <Stop offset="1" stopColor={farbe} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`grund-${name}`} cx="50%" cy="35%" rx="65%" ry="65%">
            <Stop offset="0" stopColor={colors.forest} />
            <Stop offset="1" stopColor={colors.night} />
          </RadialGradient>
        </Defs>
        <Circle cx={50} cy={50} r={50} fill={`url(#schein-${name})`} />
        {children}
      </Svg>
      <Schrift style={[stile.text, { color: farbe }]} numberOfLines={2}>
        {beschriftung}
      </Schrift>
    </View>
  );
}

/** Wild-Wert 0–100 als runde Skala: Bogen in der Farbe der Stufe, Zahl in der Mitte */
export function WildWertWappen({ wert, groesse }: Props & { wert: number }) {
  const farbe = wert <= 30 ? colors.fog : wert <= 55 ? colors.rune : wert <= 80 ? colors.rare : colors.legend;
  // Bogen von 135° bis 405° (unten offen), Anteil nach Wert
  const punkt = (w: number, r: number) => {
    const a = ((135 + (w / 100) * 270) * Math.PI) / 180;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  };
  const bogen = (w0: number, w1: number, r: number) => {
    const [x0, y0] = punkt(w0, r);
    const [x1, y1] = punkt(w1, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${(w1 - w0) * 2.7 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  return (
    <Rahmen
      groesse={groesse}
      farbe={farbe}
      name="wildwert"
      beschriftung="Wild-Wert"
      label={`Wild-Wert ${wert} von 100`}
    >
      <Circle cx={50} cy={50} r={40} fill="url(#grund-wildwert)" stroke={farbe} strokeWidth={1.5} />
      <Path d={bogen(0, 100, 33)} stroke={colors.moss} strokeWidth={6} fill="none" strokeLinecap="round" />
      {wert > 0 && (
        <Path d={bogen(0, Math.max(2, wert), 33)} stroke={farbe} strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      <SvgText x={50} y={59} fontSize={26} fontFamily={fonts.titel} fill={colors.moon} textAnchor="middle">
        {wert}
      </SvgText>
    </Rahmen>
  );
}

/** Seltenheit: vier verschiedene Formen, je seltener, desto prächtiger */
export function SeltenheitWappen({ stufe, groesse }: Props & { stufe: Seltenheit }) {
  const s = SELTENHEIT[stufe];
  const f = s.farbe;
  const name = `selten${stufe}`;
  const grund = `url(#grund-${name})`;
  return (
    <Rahmen groesse={groesse} farbe={f} name={name} beschriftung={s.name}>
      {stufe === 1 && (
        <G>
          <Circle cx={50} cy={50} r={36} fill={grund} stroke={f} strokeWidth={2} />
          <Circle cx={50} cy={50} r={31} fill="none" stroke={f} strokeWidth={0.8} opacity={0.6} />
          {/* Blatt */}
          <Path d="M50 30 C64 40 64 58 50 70 C36 58 36 40 50 30 Z" fill="none" stroke={f} strokeWidth={2} />
          <Path d="M50 34 L50 70 M50 48 L57 42 M50 56 L43 50" stroke={f} strokeWidth={1.4} strokeLinecap="round" />
        </G>
      )}
      {stufe === 2 && (
        <G>
          <Path d="M50 12 L83 31 L83 69 L50 88 L17 69 L17 31 Z" fill={grund} stroke={f} strokeWidth={2} />
          <Path
            d="M50 19 L77 35 L77 65 L50 81 L23 65 L23 35 Z"
            fill="none"
            stroke={f}
            strokeWidth={0.8}
            opacity={0.6}
          />
          {/* zwei Edelsteine */}
          <Path d="M39 36 L47 44 L39 64 L31 44 Z" fill={f} />
          <Path d="M61 36 L69 44 L61 64 L53 44 Z" fill={f} />
        </G>
      )}
      {stufe === 3 && (
        <G>
          <Path
            d="M50 10 L84 22 L80 58 C76 74 64 84 50 92 C36 84 24 74 20 58 L16 22 Z"
            fill={grund}
            stroke={f}
            strokeWidth={2}
          />
          <Path
            d="M50 17 L77 27 L74 57 C70 70 61 78 50 85 C39 78 30 70 26 57 L23 27 Z"
            fill="none"
            stroke={f}
            strokeWidth={0.8}
            opacity={0.6}
          />
          {/* Stern */}
          <Path d="M50 30 L55 44 L70 44 L58 53 L62 67 L50 59 L38 67 L42 53 L30 44 L45 44 Z" fill={f} />
        </G>
      )}
      {stufe === 4 && (
        <G>
          {/* Strahlen */}
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r0 = 40;
            const r1 = i % 2 === 0 ? 50 : 46;
            return (
              <Path
                key={i}
                d={`M${50 + r0 * Math.cos(a)} ${50 + r0 * Math.sin(a)} L${50 + r1 * Math.cos(a)} ${50 + r1 * Math.sin(a)}`}
                stroke={f}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.8}
              />
            );
          })}
          {/* achtzackiger Stern als Grundform */}
          <Path
            d={
              Array.from({ length: 16 }, (_, i) => {
                const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 === 0 ? 40 : 31;
                return `${i === 0 ? 'M' : 'L'}${50 + r * Math.cos(a)} ${50 + r * Math.sin(a)}`;
              }).join(' ') + ' Z'
            }
            fill={grund}
            stroke={f}
            strokeWidth={2}
          />
          <Circle cx={50} cy={50} r={22} fill="none" stroke={f} strokeWidth={0.8} opacity={0.7} />
          {/* Krone */}
          <Path d="M36 60 L36 42 L43 50 L50 38 L57 50 L64 42 L64 60 Z" fill={f} />
          <Path d="M35 63 L65 63" stroke={f} strokeWidth={2.4} strokeLinecap="round" />
        </G>
      )}
    </Rahmen>
  );
}

/** Schutzstatus: Schild mit Haken (besonders geschützt einfach, streng geschützt doppelt umrandet) */
export function SchutzWappen({ schutz, groesse }: Props & { schutz: Schutz }) {
  const f = SCHUTZ_FARBE[schutz];
  return (
    <Rahmen groesse={groesse} farbe={f} name={`schutz${schutz}`} beschriftung={SCHUTZ_NAME[schutz]}>
      <Path
        d="M50 14 L80 24 L78 52 C75 70 64 80 50 88 C36 80 25 70 22 52 L20 24 Z"
        fill={`url(#grund-schutz${schutz})`}
        stroke={f}
        strokeWidth={2}
      />
      {schutz === 2 && (
        <Path
          d="M50 21 L73 29 L71 52 C68 66 60 74 50 80 C40 74 32 66 29 52 L27 29 Z"
          fill="none"
          stroke={f}
          strokeWidth={1.2}
        />
      )}
      <Path
        d="M37 50 L47 60 L65 40"
        stroke={f}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Rahmen>
  );
}

/** Rote Liste (gefährdet, Stufen 1–3): Schild mit Ausrufezeichen und Stufe */
export function RoteListeWappen({ stufe, groesse }: Props & { stufe: RoteListe }) {
  const f = '123'.includes(stufe) ? colors.warn : colors.fog;
  return (
    <Rahmen groesse={groesse} farbe={f} name={`rl${stufe}`} beschriftung={ROTE_LISTE_NAME[stufe]}>
      <Path
        d="M50 12 L88 80 L12 80 Z"
        fill={`url(#grund-rl${stufe})`}
        stroke={f}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M50 36 L50 58" stroke={f} strokeWidth={6} strokeLinecap="round" />
      <Circle cx={50} cy={69} r={3.6} fill={f} />
    </Rahmen>
  );
}

/** Giftig: Raute (Warnform) mit Tropfen */
export function GiftWappen({ text, groesse }: Props & { text: string }) {
  const f = colors.warn;
  return (
    <Rahmen groesse={groesse} farbe={f} name="gift" beschriftung={text}>
      <Path
        d="M50 10 L90 50 L50 90 L10 50 Z"
        fill="url(#grund-gift)"
        stroke={f}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M50 17 L83 50 L50 83 L17 50 Z" fill="none" stroke={f} strokeWidth={0.8} opacity={0.6} />
      <Path d="M50 30 C58 42 64 50 64 58 C64 66 58 71 50 71 C42 71 36 66 36 58 C36 50 42 42 50 30 Z" fill={f} />
    </Rahmen>
  );
}

/**
 * Alle Wappen einer Art in einer Reihe: Wild-Wert, Seltenheit, Schutz, Rote Liste (nur gefährdet), Gift.
 * `verborgen`: Rätsel-Art – dann nur Wild-Wert und Seltenheit (verrät nichts über die Art).
 * `ausrichtung`: mittig (Hero) oder linksbündig (Seitenkopf).
 */
export function WappenReihe({
  id,
  seltenheit,
  art,
  verborgen = false,
  groesse = 58,
  ausrichtung = 'mitte',
}: {
  id: string;
  seltenheit: Seltenheit;
  art?: Art;
  verborgen?: boolean;
  groesse?: number;
  ausrichtung?: 'mitte' | 'links';
}) {
  const w = berechneWildWert(id);
  const zeigen = art && !verborgen;
  return (
    <View style={[stile.reihe, ausrichtung === 'links' && { justifyContent: 'flex-start' }]}>
      <WildWertWappen wert={w.wert} groesse={groesse} />
      <SeltenheitWappen stufe={seltenheit} groesse={groesse} />
      {zeigen && art.schutz > 0 && <SchutzWappen schutz={art.schutz} groesse={groesse} />}
      {zeigen && art.roteListe && '123'.includes(art.roteListe) && (
        <RoteListeWappen stufe={art.roteListe} groesse={groesse} />
      )}
      {art?.giftig && <GiftWappen text={art.giftig} groesse={groesse} />}
    </View>
  );
}

const stile = StyleSheet.create({
  reihe: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  wappen: { alignItems: 'center', gap: 2 },
  text: {
    fontFamily: fonts.etikett,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
