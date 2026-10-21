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
import {
  istVerborgen,
  zweigFortschritt,
  type KatalogEintrag,
  type KatalogZweig,
  type LebensAst,
} from '@/logic/katalog';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { ArtTaler } from '../taler/ArtTaler';
import { Schrift } from '../Schrift';
import { Info } from '../ui/Info';
import { BAUM_STILE } from './baumStile';

/**
 * Ein geöffneter Ast: wächst von oben nach unten aus dem Baum heraus.
 * Er trägt seine Zweige – jeder Zweig ist ein kleines Sammelset mit Fortschritt und einem Schatz.
 * Innerhalb eines Zweigs sitzen häufige Arten vorn, seltene an der Zweigspitze (hinten).
 */
type Props = {
  kategorie: KategorieId;
  ast: LebensAst;
  gefunden: Record<string, unknown>;
  /** Filter: Arten, die nicht passen, werden abgedunkelt (nicht ausgeblendet) */
  passt?: (e: KatalogEintrag) => boolean;
  onSchliessen: () => void;
};

const KOPF = 78; // Kopfzeile eines Zweigs
const REIHE = 108;
const OBEN = 8;
const KNOTEN = 54;

type Platz = { e: KatalogEintrag; x: number; y: number; schatz: boolean };
type ZweigPlatz = { z: KatalogZweig; y: number };

export function AstPanel({ kategorie, ast, gefunden, passt, onSchliessen }: Props) {
  const ruhig = useReducedMotion();
  const [breite, setBreite] = useState(0);
  const W = breite || 340;
  const spalten = W >= 330 ? 4 : 3;
  const n = ast.eintraege.length;
  const anzahl = ast.eintraege.filter((e) => e.id in gefunden).length;

  const { plaetze, zweige, hoehe } = useMemo(() => {
    const plaetze: Platz[] = [];
    const zweige: ZweigPlatz[] = [];
    const spalte = W / spalten;
    let y = OBEN;
    for (const z of ast.zweige) {
      zweige.push({ z, y });
      y += KOPF;
      z.eintraege.forEach((e, i) => {
        plaetze.push({
          e,
          x: spalte * ((i % spalten) + 0.5),
          y: y + Math.floor(i / spalten) * REIHE + KNOTEN / 2 + 4,
          schatz: e.id === z.schatz,
        });
      });
      y += Math.ceil(z.eintraege.length / spalten) * REIHE + 6;
    }
    return { plaetze, zweige, hoehe: y + 16 };
  }, [ast.zweige, W, spalten]);
  const ebenen = useMemo(() => astPanelForm(kategorie, W, hoehe, plaetze, KNOTEN / 2), [kategorie, W, hoehe, plaetze]);
  const stil = BAUM_STILE[kategorie];
  const farbe = (rolle: string) =>
    rolle === 'holz' ? 'url(#astHolz)' : stil.farben[rolle as keyof typeof stil.farben];

  // Ast wächst nach unten
  const wachsen = useSharedValue(ruhig ? 1 : 0);
  useEffect(() => {
    if (ruhig) return;
    wachsen.value = withTiming(1, { duration: 450 + Math.min(n, 16) * 90, easing: Easing.out(Easing.cubic) });
  }, [ruhig, n, wachsen]);
  const wachsStil = useAnimatedStyle(() => ({ height: hoehe * wachsen.value }));

  return (
    <View style={stile.rahmen}>
      <View style={stile.kopf}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s }}>
            <Schrift art="ueberschrift">{ast.name}</Schrift>
            <Info
              titel={ast.name}
              text={`Vorn sitzen die häufigen Arten (+${SELTENHEIT[1].punkte} AP), hinten die seltenen. ✦ ist der Schatz des Zweigs.${
                ast.mond
                  ? ' ☾ Meisterast: schwer zu finden – nachts, sehr klein oder sehr scheu. Quartiere und Nester nie stören.'
                  : ''
              }`}
            />
          </View>
          <Schrift art="etikett">
            {anzahl} von {n} gefunden · {ast.zweige.length} {ast.zweige.length === 1 ? 'Zweig' : 'Zweige'}
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
      {ast.mond && (
        <Schrift art="klein" style={stile.mond}>
          ☾ Nur aus der Ferne beobachten
        </Schrift>
      )}

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
          {zweige.map(({ z, y }) => (
            <ZweigKopf key={z.name} z={z} y={y} gefunden={gefunden} farbe={stil.ring} />
          ))}
          {plaetze.map((p, i) => (
            <Knoten
              key={p.e.id}
              p={p}
              ok={p.e.id in gefunden}
              verborgen={istVerborgen(p.e.id, gefunden)}
              gedimmt={!!passt && !passt(p.e)}
              breite={W / spalten}
              index={i}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/** Kopf eines Zweigs: Name, Fortschritt, Schatz – und ein Hinweis, wenn nur noch wenig fehlt */
function ZweigKopf({
  z,
  y,
  gefunden,
  farbe,
}: {
  z: KatalogZweig;
  y: number;
  gefunden: Record<string, unknown>;
  farbe: string;
}) {
  const f = zweigFortschritt(z, gefunden);
  const schatz = z.eintraege.find((e) => e.id === z.schatz);
  const schatzName = schatz && (istVerborgen(schatz.id, gefunden) ? 'ein Rätsel' : schatz.name);
  const hinweis = f.voll
    ? '✿ Zweig vollständig'
    : f.fehlt <= 2 && f.gesamt > 2
      ? `Noch ${f.fehlt} – dann blüht der Zweig`
      : `Schatz: ${schatzName}${f.schatzGefunden ? ' ✓' : ''}`;
  return (
    <View
      style={[stile.zweigKopf, { top: y }, f.voll && { borderColor: colors.legend }]}
      accessible
      accessibilityLabel={`Zweig ${z.name}: ${f.gefunden} von ${f.gesamt} gefunden. ${hinweis}`}
    >
      <View style={stile.zweigZeile}>
        <Schrift style={stile.zweigName} numberOfLines={1}>
          {f.schatzGefunden ? '✦ ' : ''}
          {z.name}
        </Schrift>
        <Schrift style={[stile.zweigZahl, { color: f.voll ? colors.legend : farbe }]}>
          {f.gefunden}/{f.gesamt}
        </Schrift>
      </View>
      <View style={stile.balken}>
        <View
          style={[
            stile.balkenFuellung,
            { width: `${(100 * f.gefunden) / f.gesamt}%`, backgroundColor: f.voll ? colors.legend : farbe },
          ]}
        />
      </View>
      <Schrift
        style={[stile.zweigHinweis, (f.voll || f.fehlt <= 2) && f.gesamt > 2 && { color: colors.amber }]}
        numberOfLines={1}
      >
        {hinweis}
      </Schrift>
    </View>
  );
}

function Knoten({
  p,
  ok,
  verborgen,
  gedimmt,
  breite,
  index,
}: {
  p: Platz;
  ok: boolean;
  verborgen: boolean;
  gedimmt: boolean;
  breite: number;
  index: number;
}) {
  const s = SELTENHEIT[p.e.seltenheit];
  const zeilen = verborgen ? ['???'] : (p.e.namensZeilen ?? umbrechen(p.e.name));
  const b = Math.min(breite - 2, 96);
  return (
    <Animated.View
      entering={FadeIn.delay(200 + Math.min(index, 14) * 70).duration(400)}
      style={[stile.knoten, { width: b, left: p.x - b / 2, top: p.y - KNOTEN / 2 }, gedimmt && { opacity: 0.22 }]}
    >
      <Pressable
        onPress={() => router.push({ pathname: '/art/[id]', params: { id: p.e.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${verborgen ? 'Rätsel' : p.e.name}, ${s.name}, ${s.punkte} Punkte, ${
          ok ? 'gesammelt' : 'noch offen'
        }${p.schatz ? ', Schatz des Zweigs' : ''}${p.e.gefahr ? ', gefährlich' : ''}`}
        style={({ pressed }) => [{ alignItems: 'center' }, pressed && { opacity: 0.6 }]}
      >
        <View style={p.schatz ? stile.schatzTaler : undefined}>
          <ArtTaler
            id={p.e.id}
            seltenheit={p.e.seltenheit}
            zustand={ok ? 'gefunden' : verborgen ? 'verborgen' : 'umriss'}
            groesse={68}
            modell={p.e.modell}
            baumModell={p.e.baumModell}
          />
        </View>
        {p.schatz && (
          <Schrift style={[stile.krone, { opacity: ok ? 1 : 0.55 }]} accessible={false}>
            ✦
          </Schrift>
        )}
        {p.e.gefahr && (
          <Schrift style={stile.dorn} accessible={false}>
            ☠
          </Schrift>
        )}
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
  // Schatz des Zweigs: goldener Schein hinter dem Taler
  schatzTaler: {
    shadowColor: colors.legend,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
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
  schliessenText: { fontFamily: fonts.etikett, fontSize: 12, color: colors.fog },
  mond: { textAlign: 'center', color: colors.rare },
  zweigKopf: {
    position: 'absolute',
    left: spacing.s,
    right: spacing.s,
    minHeight: KOPF - 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.moss,
    backgroundColor: colors.night,
    opacity: 0.94,
    gap: 3,
  },
  zweigZeile: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.s },
  zweigName: { flex: 1, fontFamily: fonts.titel, fontSize: 13.5, color: colors.moon },
  zweigZahl: { fontFamily: fonts.etikett, fontSize: 11 },
  balken: { height: 3, borderRadius: 2, backgroundColor: colors.forest, overflow: 'hidden' },
  balkenFuellung: { height: 3, borderRadius: 2 },
  zweigHinweis: { fontFamily: fonts.etikett, fontSize: 10.5, color: colors.fog },
  knoten: { position: 'absolute' },
  krone: { position: 'absolute', top: -12, fontSize: 15, color: colors.legend },
  dorn: { position: 'absolute', top: -4, right: 6, fontSize: 12, color: colors.warn },
  name: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 15,
    marginTop: 4,
    textShadowColor: colors.night,
    textShadowRadius: 6,
  },
  punkte: { fontFamily: fonts.etikett, fontSize: 10.5, marginTop: 1 },
});
