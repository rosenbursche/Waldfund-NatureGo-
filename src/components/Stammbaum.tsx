import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { SELTENHEIT } from '@/data/spiel';
import type { KatalogEintrag, KatalogGruppe } from '@/logic/katalog';
import { colors, fonts } from '@/theme/theme';

import { ArtIcon, type ArtIconName } from './ArtIcon';
import { Schrift } from './Schrift';
import { skizze, SkizzePfad } from './Skizze';

/**
 * Stammbaum einer Kategorie: ein handgezeichneter Stamm, je Gruppe ein Ast,
 * an den Ästen die Arten als runde Knoten.
 * Gesammelte Arten leuchten in ihrer Seltenheitsfarbe, offene sind gestrichelte Umrisse.
 *
 * Die Linien sind ein SVG im Hintergrund, die Knoten echte Knöpfe darüber –
 * so funktionieren sie auch mit Screenreader.
 */
const OBEN = 76; // Platz für die Wurzel-Plakette
const GRUPPE_KOPF = 44;
const REIHE = 122;
const PRO_REIHE = 4;
const KNOTEN = 56;

type Props = { gruppen: KatalogGruppe[]; gefunden: Record<string, unknown>; kategorieIcon: ArtIconName };

type Knoten = { e: KatalogEintrag; x: number; y: number; astX: number; astY: number };

export function Stammbaum({ gruppen, gefunden, kategorieIcon }: Props) {
  const [breite, setBreite] = useState(0);
  const mitte = breite / 2;

  // Positionen ausrechnen
  const { knoten, gruppenKoepfe, hoehe } = useMemo(() => {
    const knoten: Knoten[] = [];
    const gruppenKoepfe: { name: string; y: number; links: boolean }[] = [];
    let y = OBEN;
    gruppen.forEach((g, gi) => {
      gruppenKoepfe.push({ name: g.name, y: y + 10, links: gi % 2 === 0 });
      const astY = y + 14;
      y += GRUPPE_KOPF;
      for (let r = 0; r * PRO_REIHE < g.eintraege.length; r++) {
        const reihe = g.eintraege.slice(r * PRO_REIHE, (r + 1) * PRO_REIHE);
        const rand = 44;
        reihe.forEach((e, k) => {
          const x = reihe.length === 1 ? mitte : rand + (k * (breite - 2 * rand)) / (reihe.length - 1 || 1);
          knoten.push({ e, x, y: y + KNOTEN / 2 + 8, astX: mitte, astY });
        });
        y += REIHE;
      }
      y += 8;
    });
    return { knoten, gruppenKoepfe, hoehe: y + 10 };
  }, [gruppen, breite, mitte]);

  // Handgezeichnete Linien (fester Zufallswert → bei jedem Öffnen gleich)
  const linien = useMemo(() => {
    if (!breite) return null;
    const stamm = skizze.curve(
      [
        [mitte, 40],
        [mitte - 4, hoehe * 0.4],
        [mitte + 4, hoehe * 0.7],
        [mitte, hoehe - 20],
      ],
      { stroke: colors.moss, strokeWidth: 4, roughness: 1.4, seed: 7 },
    );
    const aeste = knoten.map((k, i) => ({
      ok: k.e.id in gefunden,
      d: skizze.curve(
        [
          [k.astX, k.astY],
          [(k.astX + k.x) / 2, k.astY + 16],
          [k.x, k.y - KNOTEN / 2 - 22],
          [k.x, k.y - KNOTEN / 2 - 2],
        ],
        { stroke: k.e.id in gefunden ? colors.rune : colors.moss, strokeWidth: 1.6, roughness: 1.5, seed: 11 + i },
      ),
    }));
    return { stamm, aeste };
  }, [breite, mitte, hoehe, knoten, gefunden]);

  return (
    <View style={{ height: hoehe }} onLayout={(e) => setBreite(e.nativeEvent.layout.width)}>
      {linien && (
        <Svg width={breite} height={hoehe} style={StyleSheet.absoluteFill}>
          <SkizzePfad drawable={linien.stamm} />
          {linien.aeste.map((a, i) => (
            <SkizzePfad key={i} drawable={a.d} deckkraft={a.ok ? 0.9 : 0.55} />
          ))}
          {gruppenKoepfe.map((g) => (
            <Circle key={g.name} cx={mitte} cy={g.y + 4} r={4.5} fill={colors.moss} />
          ))}
        </Svg>
      )}

      {/* Wurzel-Plakette mit Kategoriesymbol */}
      {breite > 0 && (
        <View style={[stile.wurzel, { left: mitte - 26 }]}>
          <ArtIcon name={kategorieIcon} groesse={26} farbe={colors.rune} />
        </View>
      )}

      {gruppenKoepfe.map((g) => (
        <Schrift
          key={g.name}
          art="notiz"
          accessibilityRole="header"
          style={[
            stile.gruppe,
            { top: g.y - 12 },
            g.links ? { right: mitte + 14, textAlign: 'right' } : { left: mitte + 14 },
          ]}
        >
          {g.name}
        </Schrift>
      ))}

      {knoten.map((k, i) => (
        <KnotenKnopf key={k.e.id} k={k} ok={k.e.id in gefunden} index={i} />
      ))}
    </View>
  );
}

function KnotenKnopf({ k, ok, index }: { k: Knoten; ok: boolean; index: number }) {
  const s = SELTENHEIT[k.e.seltenheit];
  const zeilen = k.e.namensZeilen ?? umbrechen(k.e.name);
  return (
    <Animated.View
      entering={FadeIn.delay(80 + index * 35).duration(500)}
      style={[stile.knoten, { left: k.x - 46, top: k.y - KNOTEN / 2 }]}
    >
      <Pressable
        onPress={() => router.push({ pathname: '/art/[id]', params: { id: k.e.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${k.e.name}, ${s.name}, ${ok ? 'gesammelt' : 'noch offen'}`}
        style={({ pressed }) => [{ alignItems: 'center' }, pressed && { opacity: 0.6 }]}
      >
        <View
          style={[
            stile.kreis,
            ok
              ? {
                  backgroundColor: s.farbe,
                  borderColor: s.farbe,
                  shadowColor: s.farbe,
                  shadowOpacity: 0.6,
                  shadowRadius: 10,
                }
              : { borderColor: s.farbe, borderStyle: 'dashed', opacity: 0.85 },
          ]}
        >
          <ArtIcon name={k.e.icon} groesse={26} farbe={ok ? colors.night : s.farbe} strich={ok ? 1.9 : 1.5} />
        </View>
        {k.e.seltenheit > 1 && (
          <View style={[stile.marke, { backgroundColor: s.farbe }]}>
            <Schrift style={stile.markeText}>S</Schrift>
          </View>
        )}
        {zeilen.map((z) => (
          <Schrift key={z} art="klein" style={[stile.name, ok && { color: colors.moon }]} numberOfLines={1}>
            {z}
          </Schrift>
        ))}
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
  wurzel: {
    position: 'absolute',
    top: 12,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.rune,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.rune,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  gruppe: { position: 'absolute', fontSize: 18 },
  knoten: { position: 'absolute', width: 92 },
  kreis: {
    width: KNOTEN,
    height: KNOTEN,
    borderRadius: KNOTEN / 2,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  marke: {
    position: 'absolute',
    top: -2,
    right: 14,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markeText: { fontFamily: fonts.bodySemiBold, fontSize: 9, lineHeight: 12, color: colors.night },
  name: { textAlign: 'center', fontSize: 12, lineHeight: 15, marginTop: 4 },
});
