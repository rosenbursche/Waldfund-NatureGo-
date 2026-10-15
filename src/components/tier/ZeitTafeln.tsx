import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { TierSeite } from '@/data/tierSeiten';
import { MONATE, MONATE_LANG } from '@/logic/jahreszeit';
import { aktivitaetUm, jahresZustand, monatAmKreis, stundeAmKreis } from '@/logic/tierJahr';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { RehFigur } from './RehFigur';
import { Fingerflaeche, SymbolSchalter, TierTafel } from './TierTafel';
import { TierSymbol, type SymbolName } from './TierSymbol';

// ---------- Kreis-Hilfen (Zeichenfläche 300 × 300, Mitte 150/150, 0 = oben, im Uhrzeigersinn) ----------
const M = 150;
const punkt = (r: number, a: number) => [M + r * Math.sin(a * Math.PI * 2), M - r * Math.cos(a * Math.PI * 2)];

/** Ringstück zwischen Radius innen/außen und Anteil a0 … a1 */
function ringstueck(ri: number, ra: number, a0: number, a1: number) {
  const gross = a1 - a0 > 0.5 ? 1 : 0;
  const [x0, y0] = punkt(ra, a0);
  const [x1, y1] = punkt(ra, a1);
  const [x2, y2] = punkt(ri, a1);
  const [x3, y3] = punkt(ri, a0);
  return `M${x0} ${y0} A${ra} ${ra} 0 ${gross} 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 ${gross} 0 ${x3} ${y3} Z`;
}

/** Bogen (nur Linie) auf Radius r */
function bogen(r: number, a0: number, a1: number) {
  const [x0, y0] = punkt(r, a0);
  const [x1, y1] = punkt(r, a1);
  return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1}`;
}

const EREIGNIS_FARBE = { amber: colors.amber, rune: colors.rune, fog: colors.fog, rare: colors.rare };
const EREIGNIS_SYMBOL: Record<string, SymbolName> = {
  setzzeit: 'mulde',
  brunft: 'herz',
  keimruhe: 'keim',
  abwurf: 'geweih',
};

// ---------- Jahresrad ----------

export function Jahresrad({
  tier,
  monat,
  setMonat,
}: {
  tier: TierSeite;
  monat: number;
  setMonat: (m: number) => void;
}) {
  const [bock, setBock] = useState(false);
  const z = jahresZustand(tier, monat);
  const fellName = z.fell >= 1 ? 'Sommerfell' : z.fell <= 0 ? 'Winterfell' : 'Fellwechsel';

  return (
    <TierTafel symbol="rad" titel="Ein Jahr" geste="ziehen">
      <SymbolSchalter
        wahl={bock ? 'bock' : 'ricke'}
        optionen={[
          { wert: 'ricke', symbol: 'herz', name: 'Ricke & Kitz' },
          { wert: 'bock', symbol: 'geweih', name: 'Bock' },
        ]}
        onWahl={(w) => setBock(w === 'bock')}
      />
      <View style={stile.rad}>
        <Svg width="100%" height="100%" viewBox="0 0 300 300">
          {/* Monatsring */}
          {MONATE.map((name, i) => {
            const an = i + 1 === monat;
            const [tx, ty] = punkt(131, (i + 0.5) / 12);
            return (
              <G key={name}>
                <Path
                  d={ringstueck(120, 143, i / 12 + 0.003, (i + 1) / 12 - 0.003)}
                  fill={an ? colors.amber : colors.night}
                  stroke={colors.moss}
                  strokeWidth={1}
                />
                <SvgText
                  x={tx}
                  y={ty + 4}
                  fontSize={11}
                  fontFamily={fonts.type}
                  fill={an ? colors.night : colors.fog}
                  textAnchor="middle"
                >
                  {name.slice(0, 3)}
                </SvgText>
              </G>
            );
          })}
          {/* Ereignis-Spuren innen am Ring */}
          {tier.jahr.map((e, k) =>
            e.monate.map((m) => (
              <Path
                key={`${e.id}-${m}`}
                d={bogen(111 - k * 8, (m - 1) / 12 + 0.006, m / 12 - 0.006)}
                stroke={EREIGNIS_FARBE[e.farbe]}
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
                opacity={m === monat ? 1 : 0.45}
              />
            )),
          )}
          {/* Zeiger */}
          {(() => {
            const [x, y] = punkt(150, (monat - 0.5) / 12);
            return <Circle cx={x} cy={y} r={6} fill={colors.amber} stroke={colors.night} strokeWidth={2} />;
          })()}
          <SvgText x={M} y={98} fontSize={22} fontFamily={fonts.handBold} fill={colors.moon} textAnchor="middle">
            {MONATE_LANG[monat - 1]}
          </SvgText>
        </Svg>
        {/* Reh in der Mitte – ändert sich mit dem Monat */}
        <View style={stile.radMitte} pointerEvents="none">
          <RehFigur
            farben={tier.farben}
            fell={z.fell}
            geweih={bock ? z.geweih : undefined}
            pose={!bock && z.ereignisse.includes('setzzeit') && !z.kitz ? 'liegt' : 'steht'}
          />
          {!bock && z.kitz && (
            <View style={stile.kitz}>
              <RehFigur farben={tier.farben} fell={z.fell} flecken={z.flecken} />
            </View>
          )}
        </View>
        <Fingerflaeche
          label={`Jahresrad, ${MONATE_LANG[monat - 1]}`}
          onPunkt={(x, y, b, h) => setMonat(monatAmKreis(x, y, b / 2, h / 2))}
          style={stile.ringFinger}
        />
      </View>
      <View style={stile.chips}>
        <Chip symbol={z.fell >= 0.5 ? 'sonne' : 'mond'} text={fellName} farbe={colors.moon} />
        {tier.jahr
          .filter((e) => z.ereignisse.includes(e.id))
          .map((e) => (
            <Chip key={e.id} symbol={EREIGNIS_SYMBOL[e.id] ?? 'rad'} text={e.kurz} farbe={EREIGNIS_FARBE[e.farbe]} />
          ))}
        {bock && <Chip symbol="geweih" text={geweihText(z.geweih.art)} farbe={colors.fog} />}
      </View>
    </TierTafel>
  );
}

function geweihText(art: 'keins' | 'bast' | 'blank') {
  return art === 'keins' ? 'Ohne Geweih' : art === 'bast' ? 'Geweih im Bast' : 'Geweih blank';
}

function Chip({ symbol, text, farbe }: { symbol: SymbolName; text: string; farbe: string }) {
  return (
    <View style={[stile.chip, { borderColor: farbe }]}>
      <TierSymbol name={symbol} groesse={16} farbe={farbe} />
      <Schrift style={[stile.chipText, { color: farbe }]}>{text}</Schrift>
    </View>
  );
}

// ---------- Tagesuhr ----------

export function TagesUhr({ tier }: { tier: TierSeite }) {
  const [stunde, setStunde] = useState(() => new Date().getHours());
  const a = aktivitaetUm(tier, stunde);
  const zeit = `${String(Math.floor(stunde)).padStart(2, '0')}:${String(Math.round((stunde % 1) * 60)).padStart(2, '0')}`;
  const [zx, zy] = punkt(132, stunde / 24);

  return (
    <TierTafel symbol="uhr" titel="Ein Tag" geste="ziehen">
      <View style={stile.rad}>
        <Svg width="100%" height="100%" viewBox="0 0 300 300">
          {/* Nacht oben (Mitternacht), Tag unten (Mittag) */}
          <Path d={ringstueck(120, 143, -0.25, 0.25)} fill={colors.night} />
          <Path d={ringstueck(120, 143, 0.25, 0.75)} fill={colors.moss} opacity={0.5} />
          {Array.from({ length: 24 }, (_, h) => {
            const [x0, y0] = punkt(120, h / 24);
            const [x1, y1] = punkt(h % 6 === 0 ? 131 : 125, h / 24);
            return <Line key={h} x1={x0} y1={y0} x2={x1} y2={y1} stroke={colors.fog} strokeWidth={1} opacity={0.6} />;
          })}
          {[0, 6, 12, 18].map((h) => {
            const [x, y] = punkt(137, h / 24);
            return (
              <SvgText
                key={h}
                x={x}
                y={y + 3}
                fontSize={9}
                fontFamily={fonts.type}
                fill={colors.fog}
                textAnchor="middle"
              >
                {h}
              </SvgText>
            );
          })}
          {/* aktive Zeiten */}
          {tier.aktivitaet.map((p) => (
            <Path
              key={p.von}
              d={bogen(p.staerke === 2 ? 108 : 110, p.von / 24, p.bis / 24)}
              stroke={p.staerke === 2 ? colors.amber : colors.rune}
              strokeWidth={p.staerke === 2 ? 10 : 5}
              strokeLinecap="round"
              fill="none"
            />
          ))}
          {/* Zeiger */}
          <Line x1={M} y1={M} x2={zx} y2={zy} stroke={colors.moon} strokeWidth={1.5} opacity={0.35} />
          <Circle cx={zx} cy={zy} r={8} fill={colors.moon} stroke={colors.night} strokeWidth={2} />
          <SvgText x={M} y={92} fontSize={22} fontFamily={fonts.type} fill={colors.moon} textAnchor="middle">
            {zeit}
          </SvgText>
        </Svg>
        <View style={[stile.symbolOben]} pointerEvents="none">
          <TierSymbol name="mond" groesse={18} farbe={colors.moon} />
        </View>
        <View style={[stile.symbolUnten]} pointerEvents="none">
          <TierSymbol name="sonne" groesse={18} farbe={colors.amber} />
        </View>
        <View style={stile.radMitte} pointerEvents="none">
          <RehFigur farben={tier.farben} pose={a > 0 ? 'aest' : 'liegt'} />
        </View>
        <Fingerflaeche
          label={`Tagesuhr, ${zeit} Uhr`}
          onPunkt={(x, y, b, h) => setStunde(stundeAmKreis(x, y, b / 2, h / 2))}
          style={stile.ringFinger}
        />
      </View>
      <View style={stile.chips}>
        <Chip
          symbol={a > 0 ? 'kraut' : 'mulde'}
          text={a === 2 ? 'Viel unterwegs, frisst' : a === 1 ? 'Kurz fressen' : 'Ruht und kaut wieder'}
          farbe={a === 2 ? colors.amber : a === 1 ? colors.rune : colors.fog}
        />
      </View>
    </TierTafel>
  );
}

const stile = StyleSheet.create({
  rad: { width: '100%', aspectRatio: 1 },
  radMitte: { position: 'absolute', left: '27%', top: '34%', width: '46%', height: '42%' },
  kitz: { position: 'absolute', left: '-14%', bottom: '-2%', width: '55%', height: '55%' },
  ringFinger: { borderRadius: 1000 },
  symbolOben: { position: 'absolute', top: '1%', left: '50%', marginLeft: -9 },
  symbolUnten: { position: 'absolute', bottom: '1%', left: '50%', marginLeft: -9 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.l,
    borderWidth: 1,
    backgroundColor: colors.night,
  },
  chipText: { fontFamily: fonts.hand, fontSize: 16, lineHeight: 20 },
});

export { Chip };
