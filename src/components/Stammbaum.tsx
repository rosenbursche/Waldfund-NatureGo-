import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg from 'react-native-svg';

import type { Seltenheit } from '@/data/artTypen';
import { SELTENHEIT } from '@/data/spiel';
import type { KatalogEintrag, Stufe } from '@/logic/katalog';
import { colors, fonts, radius } from '@/theme/theme';

import { ArtMiniatur } from './ArtMiniatur';
import { Schrift } from './Schrift';
import { skizze, SkizzePfad } from './Skizze';

/**
 * Stammbaum einer Kategorie, nach Seltenheit gebaut:
 *   Krone (legendär) → Äste (sehr selten) → Stamm (selten) → Wurzeln (häufig)
 * Jede Stufe zeigt groß ihre Punkte. Innerhalb einer Stufe stehen die Arten nach Gruppen
 * (z. B. Bäume, Büsche, Frühblüher) – jede mit ihrer eigenen Miniatur.
 *
 * Die Linien sind ein SVG im Hintergrund, die Arten echte Knöpfe darüber (Screenreader).
 */
const STUFEN_NAME: Record<Seltenheit, string> = { 4: 'Krone', 3: 'Äste', 2: 'Stamm', 1: 'Wurzeln' };
const KOPF = 78;
const GRUPPE = 30;
const REIHE = 128;
const PRO_REIHE = 4;
const KNOTEN = 60;

type Props = {
  stufen: Stufe[];
  gefunden: Record<string, unknown>;
  /** Mystery-Arten, die noch nicht gefunden sind (zeigen nur "?") */
  verborgen: (id: string) => boolean;
};

type Platz = { e: KatalogEintrag; x: number; y: number };
type Band = {
  seltenheit: Seltenheit;
  oben: number;
  unten: number;
  kopfY: number;
  gruppen: { name: string; y: number }[];
};

export function Stammbaum({ stufen, gefunden, verborgen }: Props) {
  const [breite, setBreite] = useState(0);
  const mitte = breite / 2;

  const { plaetze, baender, hoehe } = useMemo(() => {
    const plaetze: Platz[] = [];
    const baender: Band[] = [];
    let y = 0;
    for (const st of stufen) {
      const band: Band = { seltenheit: st.seltenheit, oben: y, unten: 0, kopfY: y + 12, gruppen: [] };
      y += KOPF;
      for (const g of st.gruppen) {
        band.gruppen.push({ name: g.name, y });
        y += GRUPPE;
        for (let r = 0; r * PRO_REIHE < g.eintraege.length; r++) {
          const reihe = g.eintraege.slice(r * PRO_REIHE, (r + 1) * PRO_REIHE);
          const rand = 46;
          const schritt = (breite - 2 * rand) / (PRO_REIHE - 1);
          // Reihe mittig ausrichten, auch wenn sie nicht voll ist
          const start = mitte - ((reihe.length - 1) * schritt) / 2;
          reihe.forEach((e, k) => plaetze.push({ e, x: start + k * schritt, y: y + KNOTEN / 2 + 4 }));
          y += REIHE;
        }
      }
      band.unten = y;
      baender.push(band);
      y += 10;
    }
    return { plaetze, baender, hoehe: y };
  }, [stufen, breite, mitte]);

  // Handgezeichnete Baum-Architektur hinter den Arten
  const linien = useMemo(() => {
    if (!breite || baender.length === 0) return [];
    const d: { drawable: ReturnType<typeof skizze.line>; deckkraft: number }[] = [];
    const o = (extra: object = {}) => ({ stroke: colors.moss, strokeWidth: 2, roughness: 1.4, seed: 5, ...extra });
    // Stamm über die ganze Höhe – zwei Linien, unten breiter
    d.push({
      drawable: skizze.curve(
        [
          [mitte - 6, 30],
          [mitte - 9, hoehe * 0.5],
          [mitte - 16, hoehe - 30],
        ],
        o({ strokeWidth: 3 }),
      ),
      deckkraft: 0.8,
    });
    d.push({
      drawable: skizze.curve(
        [
          [mitte + 6, 30],
          [mitte + 9, hoehe * 0.5],
          [mitte + 16, hoehe - 30],
        ],
        o({ strokeWidth: 3, seed: 6 }),
      ),
      deckkraft: 0.8,
    });
    for (const b of baender) {
      const h = b.unten - b.oben;
      if (b.seltenheit === 4) {
        // Krone: leuchtende, schraffierte Laubwolke
        d.push({
          drawable: skizze.ellipse(
            mitte,
            b.oben + h * 0.55,
            breite * 0.96,
            h * 1.05,
            o({
              fill: colors.legend,
              fillStyle: 'hachure',
              hachureGap: 10,
              fillWeight: 0.6,
              stroke: colors.legend,
              seed: 9,
            }),
          ),
          deckkraft: 0.18,
        });
      } else if (b.seltenheit === 3) {
        // Äste: schräg nach oben
        for (const [s, k] of [
          [-1, 0.35],
          [1, 0.45],
          [-1, 0.75],
          [1, 0.85],
        ] as const) {
          const y0 = b.oben + h * k;
          d.push({
            drawable: skizze.curve(
              [
                [mitte, y0],
                [mitte + s * breite * 0.22, y0 - 22],
                [mitte + s * breite * 0.45, y0 - 46],
              ],
              o({ seed: 20 + k * 10 }),
            ),
            deckkraft: 0.6,
          });
        }
      } else if (b.seltenheit === 2) {
        // Stamm: Rindenstriche
        for (let i = 0; i < 6; i++) {
          const y0 = b.oben + 40 + (i * (h - 60)) / 6;
          d.push({
            drawable: skizze.line(mitte - 4, y0, mitte + 3, y0 + 10, o({ strokeWidth: 1, seed: 30 + i })),
            deckkraft: 0.6,
          });
        }
      } else {
        // Wurzeln: geschwungen nach außen und unten
        for (const [s, w] of [
          [-1, 0.42],
          [1, 0.42],
          [-1, 0.26],
          [1, 0.3],
          [-1, 0.12],
          [1, 0.14],
        ] as const) {
          d.push({
            drawable: skizze.curve(
              [
                [mitte, b.oben + 30],
                [mitte + s * breite * w * 0.6, b.oben + h * 0.45],
                [mitte + s * breite * w, b.unten - 10],
              ],
              o({ seed: 40 + w * 100 }),
            ),
            deckkraft: 0.55,
          });
        }
      }
    }
    return d;
  }, [breite, baender, hoehe, mitte]);

  return (
    <View style={{ height: hoehe }} onLayout={(e) => setBreite(e.nativeEvent.layout.width)}>
      {breite > 0 && (
        <Svg width={breite} height={hoehe} style={StyleSheet.absoluteFill}>
          {linien.map((l, i) => (
            <SkizzePfad key={i} drawable={l.drawable} deckkraft={l.deckkraft} />
          ))}
        </Svg>
      )}

      {baender.map((b) => {
        const s = SELTENHEIT[b.seltenheit];
        return (
          <View key={b.seltenheit} style={[stile.kopf, { top: b.kopfY }]} accessibilityRole="header">
            <View style={[stile.kopfSchild, { borderColor: s.farbe, shadowColor: s.farbe }]}>
              <Schrift style={[stile.kopfName, { color: s.farbe }]}>
                {b.seltenheit === 4 ? '★ ' : ''}
                {STUFEN_NAME[b.seltenheit]} · {s.name}
              </Schrift>
              <Schrift style={[stile.kopfPunkte, { color: s.farbe }]}>{s.punkte} AP</Schrift>
            </View>
          </View>
        );
      })}

      {baender.flatMap((b) =>
        b.gruppen.map((g) => (
          <View key={`${b.seltenheit}-${g.name}`} style={[stile.gruppe, { top: g.y + 2 }]}>
            <Schrift art="etikett" style={{ fontSize: 11 }}>
              {g.name}
            </Schrift>
          </View>
        )),
      )}

      {plaetze.map((p, i) => (
        <Knoten key={p.e.id} p={p} ok={p.e.id in gefunden} verborgen={verborgen(p.e.id)} index={i} />
      ))}
    </View>
  );
}

function Knoten({ p, ok, verborgen, index }: { p: Platz; ok: boolean; verborgen: boolean; index: number }) {
  const s = SELTENHEIT[p.e.seltenheit];
  const name = verborgen ? '???' : p.e.name;
  const zeilen = verborgen ? ['???'] : (p.e.namensZeilen ?? umbrechen(p.e.name));
  return (
    <Animated.View
      entering={FadeIn.delay(60 + index * 25).duration(450)}
      style={[stile.knoten, { left: p.x - 48, top: p.y - KNOTEN / 2 }]}
    >
      <Pressable
        onPress={() => router.push({ pathname: '/art/[id]', params: { id: p.e.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${s.name}, ${s.punkte} Punkte, ${ok ? 'gesammelt' : 'noch offen'}`}
        style={({ pressed }) => [{ alignItems: 'center' }, pressed && { opacity: 0.6 }]}
      >
        <View
          style={[
            stile.kreis,
            ok
              ? {
                  borderColor: s.farbe,
                  backgroundColor: colors.forest,
                  shadowColor: s.farbe,
                  shadowOpacity: 0.7,
                  shadowRadius: 12,
                }
              : { borderColor: s.farbe, borderStyle: 'dashed', opacity: 0.9 },
          ]}
        >
          <ArtMiniatur
            modell={p.e.modell}
            baumModell={p.e.baumModell}
            stil={ok ? 'farbe' : verborgen ? 'verborgen' : 'umriss'}
            akzent={s.farbe}
            groesse={44}
          />
        </View>
        {zeilen.map((z) => (
          <Schrift key={z} art="klein" style={[stile.name, ok && { color: colors.moon }]} numberOfLines={1}>
            {z}
          </Schrift>
        ))}
        <Schrift style={[stile.punkte, { color: s.farbe }]}>{ok ? '✓ gesammelt' : `+${s.punkte} AP`}</Schrift>
      </Pressable>
    </Animated.View>
  );
}

/** Lange Namen auf zwei Zeilen verteilen (wie im Prototyp) */
function umbrechen(name: string): string[] {
  if (name.length <= 13) return [name];
  const woerter = name.replace('-', '- ').split(' ');
  let a = '';
  let b = '';
  for (const w of woerter) {
    if (!b && (a + w).length < 13) a += (a && !a.endsWith('-') ? ' ' : '') + w;
    else b += (b && !b.endsWith('-') ? ' ' : '') + w;
  }
  return [a, b].filter(Boolean);
}

const stile = StyleSheet.create({
  kopf: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  kopfSchild: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: radius.l,
    borderWidth: 1.5,
    backgroundColor: colors.night,
    shadowOpacity: 0.55,
    shadowRadius: 14,
  },
  kopfName: { fontFamily: fonts.type, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase' },
  kopfPunkte: { fontFamily: fonts.handBold, fontSize: 24, lineHeight: 30 },
  gruppe: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
  },
  knoten: { position: 'absolute', width: 96 },
  kreis: {
    width: KNOTEN,
    height: KNOTEN,
    borderRadius: KNOTEN / 2,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  name: { textAlign: 'center', fontSize: 12, lineHeight: 15, marginTop: 4 },
  punkte: { fontFamily: fonts.type, fontSize: 10.5, marginTop: 1 },
});
