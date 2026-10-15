import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { SELTENHEIT } from '@/data/spiel';
import type { KategorieId } from '@/data/artTypen';
import { astPanelForm } from '@/logic/baum/stil';
import type { KatalogEintrag, KatalogGruppe } from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { ArtMiniatur } from '../ArtMiniatur';
import { Schrift } from '../Schrift';
import { BAUM_STILE } from './baumStile';

/**
 * Ein geöffneter Ast: wächst von oben nach unten aus dem Baum heraus.
 * Links und rechts zweigen Zweige ab, an jedem hängt eine Art.
 * Häufige Arten sitzen nah am Ast, seltene außen an der Zweigspitze.
 */
type Props = {
  kategorie: KategorieId;
  ast: KatalogGruppe;
  gefunden: Record<string, unknown>;
  onSchliessen: () => void;
};

const REIHE = 112;
const OBEN = 24;
const KNOTEN = 62;

type Platz = { e: KatalogEintrag; x: number; y: number; seite: 1 | -1 };

export function AstPanel({ kategorie, ast, gefunden, onSchliessen }: Props) {
  const ruhig = useReducedMotion();
  const [breite, setBreite] = useState(0);
  const W = breite || 340;
  const n = ast.eintraege.length;
  const hoehe = OBEN + n * REIHE + 24;
  const anzahl = ast.eintraege.filter((e) => e.id in gefunden).length;

  const { plaetze, ebenen } = useMemo(() => {
    const m = W / 2;
    const plaetze: Platz[] = ast.eintraege.map((e, i) => {
      const seite: 1 | -1 = i % 2 ? 1 : -1;
      const reichweite = Math.min(W * (e.seltenheit === 1 ? 0.25 : 0.34), m - 50);
      return { e, x: m + seite * reichweite, y: OBEN + i * REIHE + 40, seite };
    });
    return { plaetze, ebenen: astPanelForm(kategorie, W, hoehe, plaetze, KNOTEN / 2) };
  }, [ast.eintraege, W, hoehe, kategorie]);
  const stil = BAUM_STILE[kategorie];
  const farbe = (rolle: string) =>
    rolle === 'holz' ? 'url(#astHolz)' : stil.farben[rolle as keyof typeof stil.farben];

  // Ast wächst nach unten
  const wachsen = useSharedValue(ruhig ? 1 : 0);
  useEffect(() => {
    if (ruhig) return;
    wachsen.value = withTiming(1, { duration: 450 + n * 120, easing: Easing.out(Easing.cubic) });
  }, [ruhig, n, wachsen]);
  const wachsStil = useAnimatedStyle(() => ({ height: hoehe * wachsen.value }));

  return (
    <View style={stile.rahmen}>
      <View style={stile.kopf}>
        <View style={{ flex: 1 }}>
          <Schrift art="ueberschrift">{ast.name}</Schrift>
          <Schrift art="etikett">
            {anzahl} von {n} gefunden
          </Schrift>
        </View>
        <Pressable
          onPress={onSchliessen}
          accessibilityRole="button"
          accessibilityLabel={`Ast ${ast.name} schließen`}
          hitSlop={8}
          style={({ pressed }) => [stile.schliessen, pressed && { opacity: 0.6 }]}
        >
          <Schrift style={stile.schliessenText}>✕ schließen</Schrift>
        </Pressable>
      </View>
      <Schrift art="klein" style={{ textAlign: 'center' }}>
        Nah am Ast: häufig (+{SELTENHEIT[1].punkte} AP) · an der Zweigspitze: selten (+{SELTENHEIT[2].punkte} AP)
      </Schrift>

      <Animated.View
        style={[{ overflow: 'hidden' }, wachsStil]}
        onLayout={(e) => e.nativeEvent.layout.width && setBreite(e.nativeEvent.layout.width)}
      >
        <View style={{ height: hoehe }}>
          <Svg width={W} height={hoehe} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <LinearGradient id="astHolz" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={hoehe}>
                <Stop offset={0} stopColor={stil.holz[2]} />
                <Stop offset={0.6} stopColor={stil.holz[1]} />
                <Stop offset={1} stopColor={stil.holz[0]} />
              </LinearGradient>
            </Defs>
            {ebenen.map((e, i) =>
              e.strich === undefined ? (
                <Path key={i} d={e.d} fill={farbe(e.rolle)} opacity={e.deckkraft} />
              ) : (
                <Path
                  key={i}
                  d={e.d}
                  fill="none"
                  stroke={farbe(e.rolle)}
                  strokeWidth={e.strich}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={e.deckkraft}
                />
              ),
            )}
          </Svg>
          {plaetze.map((p, i) => (
            <Knoten key={p.e.id} p={p} ok={p.e.id in gefunden} index={i} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function Knoten({ p, ok, index }: { p: Platz; ok: boolean; index: number }) {
  const s = SELTENHEIT[p.e.seltenheit];
  const zeilen = p.e.namensZeilen ?? umbrechen(p.e.name);
  return (
    <Animated.View
      entering={FadeIn.delay(250 + index * 110).duration(450)}
      style={[stile.knoten, { left: p.x - 50, top: p.y - KNOTEN / 2 }]}
    >
      <Pressable
        onPress={() => router.push({ pathname: '/art/[id]', params: { id: p.e.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${p.e.name}, ${s.name}, ${s.punkte} Punkte, ${ok ? 'gesammelt' : 'noch offen'}`}
        style={({ pressed }) => [{ alignItems: 'center' }, pressed && { opacity: 0.6 }]}
      >
        <View
          style={[
            stile.kreis,
            ok
              ? { borderColor: s.farbe, backgroundColor: colors.forest, shadowColor: s.farbe, shadowOpacity: 0.8 }
              : { borderColor: s.farbe, borderStyle: 'dashed' },
          ]}
        >
          <ArtMiniatur
            modell={p.e.modell}
            baumModell={p.e.baumModell}
            stil={ok ? 'farbe' : 'umriss'}
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

/** Lange Namen auf zwei Zeilen verteilen */
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
  rahmen: { gap: spacing.s },
  kopf: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  schliessen: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.forest,
  },
  schliessenText: { fontFamily: fonts.type, fontSize: 12, color: colors.fog },
  knoten: { position: 'absolute', width: 100 },
  kreis: {
    width: KNOTEN,
    height: KNOTEN,
    borderRadius: KNOTEN / 2,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  name: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4,
    textShadowColor: colors.night,
    textShadowRadius: 6,
  },
  punkte: { fontFamily: fonts.type, fontSize: 10.5, marginTop: 1 },
});
