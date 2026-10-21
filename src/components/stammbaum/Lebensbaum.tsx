import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import type { KategorieId } from '@/data/artTypen';
import { SELTENHEIT } from '@/data/spiel';
import { ArtTaler } from '@/components/taler/ArtTaler';
import { baumForm, sternPfad, type Punkt } from '@/logic/baum/stil';
import { alleImBaum, type KatalogEintrag, type Lebensbaum as LebensbaumDaten } from '@/logic/katalog';
import { colors, fonts } from '@/theme/theme';

import { Schrift } from '../Schrift';
import { BAUM_STILE } from './baumStile';
import { GruppenIcon, TOTER_AST_NAME } from './GruppenIcon';
import { Partikel } from './Partikel';

/**
 * Der Lebensbaum einer Kategorie – jede Kategorie hat ihren eigenen Baum (siehe `logic/baum/`):
 * Pflanzen = Silberner Blütenbaum, Pilze = Myzelbaum, Vögel = Federbaum im Wind, Säugetiere = Uralter Baumhirte.
 * - Hauptäste = Gruppen. An der Astspitze sitzt ein Knopf mit gruseligem Symbol und Fortschrittsring –
 *   ohne Text, damit nichts überlappt. Die Namen stehen in der Ast-Liste unter dem Baum (`AstListe.tsx`).
 * - Sterne über der Krone = die seltensten Arten. Matt, bis man sie findet – dann leuchten sie.
 * - toter Ast über der Krone (schwarz, dornig, Totenkopf-Knopf) = "Gefährlich & tödlich".
 * - Runenring: leuchtet anteilig mit dem Fortschritt der ganzen Kategorie.
 * Beim Öffnen zoomt der Baum sanft auf den gewählten Ast.
 */

/** Kennung für den toten Ast (statt eines Astnamens) */
export const TOTER_AST = '__toter_ast__';

type Props = {
  kategorie: KategorieId;
  baum: LebensbaumDaten;
  gefunden: Record<string, unknown>;
  /** Name des offenen Asts, TOTER_AST oder null */
  offen: string | null;
  onWaehle: (ziel: string | null) => void;
};

const KNOPF = 46;

export function Lebensbaum({ kategorie, baum, gefunden, offen, onWaehle }: Props) {
  const ruhig = useReducedMotion();
  const [breite, setBreite] = useState(0);
  const W = breite || 360;
  const stil = BAUM_STILE[kategorie];
  const form = useMemo(
    () => baumForm(W, baum.aeste.length, baum.sterne.length, kategorie),
    [W, baum.aeste.length, baum.sterne.length, kategorie],
  );
  const H = form.hoehe;

  // jede Art genau einmal (Sterne und Wurzeln sind nur eine zweite Sicht auf dieselben Arten)
  const alle = alleImBaum(baum);
  const anzahlGefunden = alle.filter((e) => e.id in gefunden).length;
  const runenAn = alle.length ? Math.round((form.runen.length * anzahlGefunden) / alle.length) : 0;

  // --- Zoom auf den offenen Ast ---
  const astIndex = baum.aeste.findIndex((a) => a.name === offen);
  const fokus: Punkt | null = offen === TOTER_AST ? form.todesPlatz : astIndex >= 0 ? form.astSpitzen[astIndex] : null;
  const zoom = useSharedValue(0);
  const fx = useSharedValue(W / 2);
  const fy = useSharedValue(H / 2);
  useEffect(() => {
    const dauer = ruhig ? 0 : 650;
    const weich = { duration: dauer, easing: Easing.inOut(Easing.cubic) };
    if (fokus) {
      fx.value = zoom.value === 0 ? fokus.x : withTiming(fokus.x, weich);
      fy.value = zoom.value === 0 ? fokus.y : withTiming(fokus.y, weich);
      zoom.value = withTiming(1, weich);
    } else {
      zoom.value = withTiming(0, weich);
    }
  }, [fokus, ruhig, zoom, fx, fy]);
  const zoomStil = useAnimatedStyle(() => {
    const z = zoom.value;
    const s = 1 + 0.32 * z;
    const px = fx.value - W / 2;
    const py = fy.value - H / 2;
    // der Fokuspunkt wandert nach unten in die Mitte – dort wächst gleich der geöffnete Ast weiter
    return {
      transform: [
        { translateX: (1 - z) * px - s * px },
        { translateY: z * H * 0.3 + (1 - z) * py - s * py },
        { scale: s },
      ],
    };
  });

  // --- Augen im Stamm (Baumhirte): öffnen sich ab und zu ---
  const augen = useSharedValue(ruhig ? 0.5 : 0.15);
  useEffect(() => {
    if (ruhig || !form.augen) return;
    augen.value = withRepeat(
      withSequence(
        withDelay(3500, withTiming(1, { duration: 700 })),
        withDelay(1800, withTiming(0.1, { duration: 90 })),
        withTiming(1, { duration: 120 }),
        withDelay(1400, withTiming(0.15, { duration: 900 })),
      ),
      -1,
    );
  }, [ruhig, augen, form.augen]);
  // als normale Views statt animierter SVG-Ellipse: animierte SVG-Formen lassen die App auf dem Handy abstürzen
  const augenStil = useAnimatedStyle(() => ({ transform: [{ scaleY: augen.value }] }));

  const farbe = (rolle: string) => (rolle === 'holz' ? 'url(#holz)' : stil.farben[rolle as keyof typeof stil.farben]);

  return (
    <View
      style={{ height: H, overflow: 'hidden' }}
      onLayout={(e) => setBreite(e.nativeEvent.layout.width)}
      accessibilityLabel={`${stil.name}: ${anzahlGefunden} von ${alle.length} Arten gefunden`}
    >
      <Animated.View style={[{ width: W, height: H }, zoomStil]}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient
              id="holz"
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={form.boden + 10}
              x2={0}
              y2={form.mitte.y - form.ringRadius * 0.6}
            >
              <Stop offset={0} stopColor={stil.holz[0]} />
              <Stop offset={0.35} stopColor={stil.holz[1]} />
              <Stop offset={1} stopColor={stil.holz[2]} />
            </LinearGradient>
            <RadialGradient
              id="schein"
              gradientUnits="userSpaceOnUse"
              cx={form.mitte.x}
              cy={form.mitte.y - W * 0.08}
              r={form.ringRadius}
            >
              <Stop offset={0} stopColor={stil.schein} stopOpacity={0.17} />
              <Stop offset={1} stopColor={stil.schein} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="astSchein">
              <Stop offset={0} stopColor={stil.ring} stopOpacity={0.55} />
              <Stop offset={1} stopColor={stil.ring} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="glut">
              <Stop offset={0} stopColor={colors.blut} stopOpacity={0.6} />
              <Stop offset={1} stopColor={colors.blut} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="augenGlut">
              <Stop offset={0} stopColor={colors.amber} stopOpacity={0.7} />
              <Stop offset={1} stopColor={colors.amber} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Lichtschein hinter dem Baum */}
          <Circle cx={form.mitte.x} cy={form.mitte.y - W * 0.08} r={form.ringRadius} fill="url(#schein)" />

          {/* Runenring */}
          {form.runen.map((r, i) => (
            <Path
              key={i}
              d={r.d}
              transform={`translate(${r.x} ${r.y}) rotate(${r.winkel})`}
              stroke={i < runenAn ? stil.ring : colors.fog}
              strokeWidth={1.4}
              strokeLinecap="round"
              fill="none"
              opacity={i < runenAn ? 0.95 : 0.3}
            />
          ))}

          {/* Erdboden als Nebelband, darunter die Wurzeln */}
          <Ellipse cx={W / 2} cy={form.boden + 4} rx={W * 0.34} ry={8} fill={colors.fog} opacity={0.07} />
          <Path d={form.schatten} fill={stil.holz[0]} opacity={0.55} />

          {/* Leuchten hinter dem offenen Ast */}
          {fokus && offen !== TOTER_AST && <Circle cx={fokus.x} cy={fokus.y} r={W * 0.13} fill="url(#astSchein)" />}

          {/* der Baum selbst: alle Ebenen von hinten nach vorn */}
          {form.ebenen.map((e, i) =>
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

          {/* Knospenkranz: ein Punkt je Art um jeden Ast-Knopf – so sieht man, wie groß die Sammlung ist */}
          {baum.aeste.map((ast, i) => {
            const p = form.astSpitzen[i];
            const n = ast.eintraege.length;
            const r = KNOPF / 2 + 6;
            const punkt = Math.min(2.6, ((Math.PI * r) / Math.max(n, 1)) * 0.62);
            return ast.eintraege.map((e, k) => {
              const w = -Math.PI / 2 + (k / n) * Math.PI * 2;
              const x = p.x + Math.cos(w) * r;
              const y = p.y + Math.sin(w) * r;
              const ok = e.id in gefunden;
              const s = SELTENHEIT[e.seltenheit];
              if (ok)
                return (
                  <Circle key={e.id} cx={x} cy={y} r={punkt * 1.1} fill={e.seltenheit >= 3 ? s.farbe : stil.ring} />
                );
              // sehr seltene, noch fehlende Arten: hohler Ring (verhüllte Knospe)
              return e.seltenheit >= 3 ? (
                <Circle
                  key={e.id}
                  cx={x}
                  cy={y}
                  r={punkt}
                  fill="none"
                  stroke={s.farbe}
                  strokeWidth={0.8}
                  opacity={0.75}
                />
              ) : (
                <Circle key={e.id} cx={x} cy={y} r={punkt * 0.85} fill={colors.fog} opacity={0.28} />
              );
            });
          })}

          {/* der tote Ast: schwarz, dornig, mit roter Glut an der Spitze – hier lauert die Gefahr */}
          <Circle cx={form.todesPlatz.x} cy={form.todesPlatz.y} r={W * 0.15} fill="url(#glut)" />
          <Path d={form.todesAst.holz} fill={colors.abgrund} stroke={colors.blut} strokeWidth={0.8} opacity={0.97} />
          <Path d={form.todesAst.dornen} fill={colors.abgrund} stroke={colors.blut} strokeWidth={0.6} />
          <Path d={form.todesAst.risse} stroke={colors.blut} strokeWidth={0.9} strokeLinecap="round" opacity={0.8} />

          {/* Augen im Stamm */}
          {form.augen &&
            [-1, 1].map((s) => (
              <Circle
                key={`g${s}`}
                cx={form.augen!.punkt.x + s * form.augen!.abstand}
                cy={form.augen!.punkt.y}
                r={form.augen!.groesse * 3}
                fill="url(#augenGlut)"
              />
            ))}
        </Svg>

        {/* Augen im Stamm: öffnen sich ab und zu */}
        {form.augen &&
          [-1, 1].map((s) => {
            const g = form.augen!.groesse;
            return (
              <Animated.View
                key={s}
                pointerEvents="none"
                style={[
                  stile.auge,
                  {
                    left: form.augen!.punkt.x + s * form.augen!.abstand - g,
                    top: form.augen!.punkt.y - g * 0.75,
                    width: g * 2,
                    height: g * 1.5,
                    borderRadius: g,
                  },
                  augenStil,
                ]}
              />
            );
          })}

        <Partikel art={stil.partikel} breite={W} hoehe={H} farbe={stil.farben.akzentHell} />

        {/* Sterne */}
        {baum.sterne.map((e, i) => (
          <SternKnopf key={e.id} e={e} punkt={form.sternPlaetze[i]} ok={e.id in gefunden} index={i} />
        ))}

        {/* Astspitzen */}
        {baum.aeste.map((a, i) => (
          <AstKnopf
            key={a.name}
            name={a.name}
            gefunden={a.eintraege.filter((e) => e.id in gefunden).length}
            gesamt={a.eintraege.length}
            punkt={form.astSpitzen[i]}
            aktiv={offen === a.name}
            gedimmt={offen !== null && offen !== a.name}
            farbe={stil.ring}
            index={i}
            onPress={() => onWaehle(offen === a.name ? null : a.name)}
          />
        ))}

        {/* Totenkopf-Knopf an der Spitze des toten Asts */}
        <AstKnopf
          name={TOTER_AST_NAME}
          gefunden={baum.toterAst.filter((e) => e.id in gefunden).length}
          gesamt={baum.toterAst.length}
          punkt={form.todesPlatz}
          aktiv={offen === TOTER_AST}
          gedimmt={offen !== null && offen !== TOTER_AST}
          farbe={colors.warn}
          index={baum.aeste.length}
          gefahr
          onPress={() => onWaehle(offen === TOTER_AST ? null : TOTER_AST)}
        />
      </Animated.View>
    </View>
  );
}

const RING_R = KNOPF / 2 - 2;
const RING_U = 2 * Math.PI * RING_R;

function AstKnopf({
  name,
  gefunden,
  gesamt,
  punkt,
  aktiv,
  gedimmt,
  farbe,
  index,
  gefahr,
  onPress,
}: {
  name: string;
  gefunden: number;
  gesamt: number;
  punkt: Punkt;
  aktiv: boolean;
  gedimmt: boolean;
  farbe: string;
  index: number;
  gefahr?: boolean;
  onPress: () => void;
}) {
  const voll = gesamt > 0 && gefunden === gesamt;
  const ringFarbe = voll ? colors.legend : farbe;
  const anteil = gesamt ? gefunden / gesamt : 0;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ expanded: aktiv }}
      accessibilityLabel={
        gefahr
          ? `Toter Ast: Gefährlich und tödlich, ${gefunden} von ${gesamt} gefunden`
          : `Ast ${name}, ${gefunden} von ${gesamt} gefunden`
      }
      style={({ pressed }) => [
        stile.astKnopf,
        { left: punkt.x - KNOPF / 2, top: punkt.y - KNOPF / 2, opacity: gedimmt ? 0.4 : pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          stile.kugel,
          {
            borderColor: gefahr ? colors.blut : colors.moss,
            shadowColor: ringFarbe,
            shadowOpacity: aktiv || voll ? 0.95 : 0.5,
            backgroundColor: aktiv ? colors.forest : gefahr ? colors.abgrund : colors.night,
          },
        ]}
      >
        {/* Fortschrittsring */}
        <Svg width={KNOPF} height={KNOPF} style={StyleSheet.absoluteFill}>
          <Circle
            cx={KNOPF / 2}
            cy={KNOPF / 2}
            r={RING_R}
            stroke={ringFarbe}
            strokeWidth={1}
            opacity={0.25}
            fill="none"
          />
          {anteil > 0 && (
            <Circle
              cx={KNOPF / 2}
              cy={KNOPF / 2}
              r={RING_R}
              stroke={ringFarbe}
              strokeWidth={2.4}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${RING_U * anteil} ${RING_U}`}
              transform={`rotate(-90 ${KNOPF / 2} ${KNOPF / 2})`}
            />
          )}
        </Svg>
        <GruppenIcon
          name={name}
          farbe={aktiv ? colors.moon : ringFarbe}
          augenFarbe={gefahr ? colors.warn : colors.amber}
          groesse={30}
          phase={index}
        />
      </View>
    </Pressable>
  );
}

function SternKnopf({ e, punkt, ok, index }: { e: KatalogEintrag; punkt: Punkt; ok: boolean; index: number }) {
  const ruhig = useReducedMotion();
  const s = SELTENHEIT[e.seltenheit];
  const funkeln = useSharedValue(1);
  useEffect(() => {
    if (ruhig || !ok) return;
    funkeln.value = withDelay(
      index * 700,
      withRepeat(withTiming(0.55, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [ruhig, ok, index, funkeln]);
  const funkelStil = useAnimatedStyle(() => ({ opacity: funkeln.value }));
  const G2 = 46;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/art/[id]', params: { id: e.id } })}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={
        ok
          ? `Stern: ${e.name}, ${s.name}, gesammelt`
          : `Unbekannter Stern, ${s.name}, ${s.punkte} Punkte. Rätsel ansehen`
      }
      style={({ pressed }) => [stile.stern, { left: punkt.x - 45, top: punkt.y - G2 / 2 }, pressed && { opacity: 0.6 }]}
    >
      {ok ? (
        // gefunden: der Taler der Art (im Rang-Emblem), noch nicht gefunden: matter Stern
        <ArtTaler
          id={e.id}
          seltenheit={e.seltenheit}
          zustand="gefunden"
          groesse={58}
          modell={e.modell}
          baumModell={e.baumModell}
        />
      ) : (
        <Animated.View style={funkelStil}>
          <Svg width={G2} height={G2}>
            <Defs>
              <RadialGradient id={`stern${index}`}>
                <Stop offset={0} stopColor={s.farbe} stopOpacity={ok ? 0.65 : 0.12} />
                <Stop offset={1} stopColor={s.farbe} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={G2 / 2} cy={G2 / 2} r={G2 / 2} fill={`url(#stern${index})`} />
            <Path
              d={sternPfad(G2 / 2, G2 / 2, ok ? 11 : 9, ok ? 4.6 : 3.8)}
              fill={ok ? s.farbe : 'none'}
              stroke={ok ? s.farbe : colors.fog}
              strokeWidth={1.2}
              opacity={ok ? 1 : 0.6}
            />
          </Svg>
        </Animated.View>
      )}
      {ok && (
        <Schrift style={[stile.sternName, { color: s.farbe }]} numberOfLines={1}>
          {e.name}
        </Schrift>
      )}
    </Pressable>
  );
}

const stile = StyleSheet.create({
  auge: { position: 'absolute', backgroundColor: colors.amber },
  astKnopf: { position: 'absolute', width: KNOPF, alignItems: 'center' },
  kugel: {
    width: KNOPF,
    height: KNOPF,
    borderRadius: KNOPF / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  stern: { position: 'absolute', width: 90, alignItems: 'center' },
  sternName: { fontFamily: fonts.etikett, fontSize: 9.5, marginTop: -6, textAlign: 'center' },
});
