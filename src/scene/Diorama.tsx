import { Image } from 'expo-image';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useMemo, type ReactNode } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

import { Schrift } from '@/components/Schrift';
import type { KategorieId } from '@/data/artTypen';
import { KATEGORIEN } from '@/data/spiel';
import { bildAufBildschirm, huettenBild, type DioramaSzene, type SzenenEbene } from '@/data/szenen';
import type { HuettenStufe } from '@/logic/fortschritt';
import type { Stimmung } from '@/logic/tageszeit';
import { colors } from '@/theme/theme';

import {
  Fensterlicht,
  GluehwuermchenSchwarm,
  Lichthof,
  Mondstrahlen,
  Nebelbank,
  Rauch,
  TuempelGlitzern,
} from './DioramaEffekte';

/**
 * Startszene als 2,5D-Diorama: Bildebenen (Himmel, Ferne, Mittelgrund, Lichtung, Hütte, Vordergrund)
 * verschieben sich beim Kippen des Handys oder Ziehen mit dem Finger unterschiedlich stark.
 * Effekte und Runensteine kommen aus dem Code. Bilder und Prompts: docs/SZENE-PROMPTS.md
 */
type Props = {
  szene: DioramaSzene;
  /** false = andere Seite liegt darüber: Sensor und Animationen pausieren */
  aktiv: boolean;
  huette: HuettenStufe;
  stimmung: Stimmung;
  ruhig: boolean;
  /** Anteil gesammelter Arten je Kategorie 0–1 */
  fortschritt: Record<KategorieId, number>;
  /** Anzeige unter dem Stein, z. B. "3/12" */
  zaehler: Record<KategorieId, { gefunden: number; gesamt: number }>;
  onRune: (id: KategorieId) => void;
};

/** Kippwinkel (Bogenmaß), bei dem die volle Verschiebung erreicht ist */
const VOLL_GEKIPPT = 0.35;

export function Diorama({ szene, aktiv, huette, stimmung, ruhig, fortschritt, zaehler, onRune }: Props) {
  const { width, height } = useWindowDimensions();
  const g = useMemo(() => bildAufBildschirm(width, height), [width, height]);
  const m = g.massstab;
  const laeuft = aktiv && !ruhig;

  // Verschiebung −1 … 1 aus Lagesensor, Finger und einem langsamen Atmen der Szene
  const kippX = useSharedValue(0);
  const kippY = useSharedValue(0);
  const fingerX = useSharedValue(0);
  const fingerY = useSharedValue(0);
  const atem = useSharedValue(0);

  useEffect(() => {
    if (!laeuft) return;
    let ruhe: { x: number; y: number } | null = null;
    DeviceMotion.setUpdateInterval(50);
    const abo = DeviceMotion.addListener(({ rotation }) => {
      if (!rotation) return;
      // Die Haltung beim Start gilt als "Ruhe" – nur Abweichungen davon verschieben die Szene
      ruhe ??= { x: rotation.gamma, y: rotation.beta };
      const x = Math.max(-1, Math.min(1, (rotation.gamma - ruhe.x) / VOLL_GEKIPPT));
      const y = Math.max(-1, Math.min(1, (rotation.beta - ruhe.y) / VOLL_GEKIPPT));
      kippX.set(withTiming(x, { duration: 140 }));
      kippY.set(withTiming(y, { duration: 140 }));
    });
    return () => abo.remove();
  }, [laeuft, kippX, kippY]);

  useEffect(() => {
    if (!laeuft) return;
    atem.set(withRepeat(withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.sin) }), -1, true));
    return () => cancelAnimation(atem);
  }, [laeuft, atem]);

  const ziehen = useMemo(() => baueZiehen(fingerX, fingerY, width, height), [fingerX, fingerY, width, height]);

  const ebene = (e: SzenenEbene | number, kinder?: ReactNode, bild?: SzenenEbene['bild']) => {
    const tiefe = typeof e === 'number' ? e : e.tiefe;
    return (
      <Ebene
        tiefe={tiefe}
        g={g}
        werte={{ kippX, kippY, fingerX, fingerY, atem }}
        bild={bild ?? (typeof e === 'number' ? undefined : e.bild)}
      >
        {kinder}
      </Ebene>
    );
  };

  const o = szene.orte;
  const huettenQuelle = huettenBild(szene, huette);
  const gluehAnzahl = Math.round(4 + 18 * stimmung.gluehwuermchen);

  return (
    <GestureDetector gesture={ziehen}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.night }]}>
        {ebene(szene.himmel, <Mondstrahlen ort={o.mond} staerke={0.4 + 0.6 * stimmung.sterne} m={m} laeuft={laeuft} />)}
        {ebene(
          szene.ferne,
          <Nebelbank
            nr={0}
            y={o.nebel[0]}
            farbe={stimmung.nebel}
            dichte={stimmung.nebelDichte}
            m={m}
            laeuft={laeuft}
          />,
        )}
        {ebene(
          szene.mittelgrund,
          <Nebelbank
            nr={1}
            y={o.nebel[1]}
            farbe={stimmung.nebel}
            dichte={stimmung.nebelDichte}
            m={m}
            laeuft={laeuft}
          />,
        )}
        {ebene(
          szene.lichtung,
          <>
            <TuempelGlitzern ort={o.tuempel} m={m} laeuft={laeuft} />
            {/* hintere Steine zuerst, damit vordere sie überdecken */}
            {runenNachTiefe(szene)
              .filter((k) => o.runen[k.id].y < o.huette.y2)
              .map((k) => (
                <DioramaRune
                  key={k.id}
                  id={k.id}
                  m={m}
                  laeuft={laeuft}
                  szene={szene}
                  fortschritt={fortschritt[k.id]}
                  zaehler={zaehler[k.id]}
                  onRune={onRune}
                />
              ))}
          </>,
        )}
        {ebene(
          szene.huetteTiefe,
          <>
            <Fensterlicht ort={o.fenster} staerke={stimmung.fenster} m={m} laeuft={laeuft} />
            <Rauch ort={o.schornstein} m={m} laeuft={laeuft} />
            <Nebelbank
              nr={2}
              y={o.nebel[2]}
              farbe={stimmung.nebel}
              dichte={stimmung.nebelDichte}
              m={m}
              laeuft={laeuft}
            />
            <GluehwuermchenSchwarm bereich={o.gluehwuermchen} anzahl={gluehAnzahl} m={m} laeuft={laeuft} />
            {runenNachTiefe(szene)
              .filter((k) => o.runen[k.id].y >= o.huette.y2)
              .map((k) => (
                <DioramaRune
                  key={k.id}
                  id={k.id}
                  m={m}
                  laeuft={laeuft}
                  szene={szene}
                  fortschritt={fortschritt[k.id]}
                  zaehler={zaehler[k.id]}
                  onRune={onRune}
                />
              ))}
          </>,
          huettenQuelle,
        )}
        {ebene(szene.vordergrund)}
      </View>
    </GestureDetector>
  );
}

/** Runensteine von hinten nach vorne (weiter oben im Bild = weiter hinten) */
function runenNachTiefe(szene: DioramaSzene) {
  return [...KATEGORIEN].sort((a, b) => szene.orte.runen[a.id].y - szene.orte.runen[b.id].y);
}

/** Finger ziehen verschiebt die Szene; beim Loslassen federt sie zurück (läuft auf dem UI-Thread) */
function baueZiehen(fingerX: SharedValue<number>, fingerY: SharedValue<number>, breite: number, hoehe: number) {
  return Gesture.Pan()
    .onChange((e) => {
      'worklet';
      fingerX.set(Math.max(-1, Math.min(1, fingerX.get() - (e.changeX / breite) * 2.4)));
      fingerY.set(Math.max(-1, Math.min(1, fingerY.get() - (e.changeY / hoehe) * 2.4)));
    })
    .onFinalize(() => {
      'worklet';
      fingerX.set(withSpring(0, { damping: 14 }));
      fingerY.set(withSpring(0, { damping: 14 }));
    });
}

type Werte = {
  kippX: SharedValue<number>;
  kippY: SharedValue<number>;
  fingerX: SharedValue<number>;
  fingerY: SharedValue<number>;
  atem: SharedValue<number>;
};

function Ebene({
  tiefe,
  g,
  werte,
  bild,
  children,
}: {
  tiefe: number;
  g: ReturnType<typeof bildAufBildschirm>;
  werte: Werte;
  bild?: SzenenEbene['bild'];
  children?: ReactNode;
}) {
  const { kippX, kippY, fingerX, fingerY, atem } = werte;
  const sx = g.spielraumX * 0.95;
  const sy = g.spielraumY * 0.95;
  const stil = useAnimatedStyle(() => {
    const x = Math.max(-1, Math.min(1, kippX.get() + fingerX.get() + (atem.get() - 0.5) * 0.25));
    const y = Math.max(-1, Math.min(1, kippY.get() + fingerY.get()));
    // Vorne bewegt sich gegen die Kipprichtung, hinten fast gar nicht – so entsteht Tiefe
    return { transform: [{ translateX: -x * sx * tiefe }, { translateY: -y * sy * tiefe }] };
  });
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        { position: 'absolute', left: g.links, top: g.oben, width: 1024 * g.massstab, height: 1536 * g.massstab },
        stil,
      ]}
    >
      {bild !== undefined && (
        <Image source={bild} style={StyleSheet.absoluteFill} contentFit="fill" pointerEvents="none" />
      )}
      {children}
    </Animated.View>
  );
}

// ---------- Runenstein (gezeichnet) ----------

/** Einfache Runenzeichen je Kategorie (Striche im Bereich 0–100) */
const RUNE_ZEICHEN: Record<KategorieId, string> = {
  pflanzen: 'M50 20 V80 M50 45 L32 28 M50 45 L68 28',
  pilze: 'M30 35 Q50 15 70 35 M50 35 V80 M38 80 H62',
  voegel: 'M50 20 V80 M50 30 L68 42 L50 54 M50 54 L32 66',
  saeuger: 'M32 20 V80 M68 20 V80 M32 26 L68 58 M68 26 L32 58',
};

function DioramaRune({
  id,
  m,
  laeuft,
  szene,
  fortschritt,
  zaehler,
  onRune,
}: {
  id: KategorieId;
  m: number;
  laeuft: boolean;
  szene: DioramaSzene;
  fortschritt: number;
  zaehler: { gefunden: number; gesamt: number };
  onRune: (id: KategorieId) => void;
}) {
  const ort = szene.orte.runen[id];
  const k = KATEGORIEN.find((x) => x.id === id)!;
  const h = ort.groesse * m;
  const b = h * 0.7;
  // Auch ohne Fund glimmt der Stein ein wenig – er soll neugierig machen
  const glut = 0.2 + 0.8 * fortschritt;

  const puls = useSharedValue(0);
  useEffect(() => {
    if (!laeuft) return;
    puls.set(withRepeat(withTiming(1, { duration: 2600 + ort.x, easing: Easing.inOut(Easing.sin) }), -1, true));
    return () => cancelAnimation(puls);
  }, [laeuft, puls, ort.x]);
  const leuchten = useAnimatedStyle(() => ({ opacity: glut * (0.65 + 0.35 * puls.get()) }));

  const hof = h * 2.2;
  return (
    <Pressable
      onPress={() => onRune(id)}
      accessibilityRole="button"
      accessibilityLabel={`${k.name}: ${zaehler.gefunden} von ${zaehler.gesamt} gesammelt`}
      hitSlop={12}
      style={{ position: 'absolute', left: ort.x * m - b / 2, top: ort.y * m - h, width: b, height: h + 34 }}
    >
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: b / 2 - hof / 2, top: h * 0.45 - hof / 2 }, leuchten]}
      >
        <Lichthof groesse={hof} farbe={colors.rune} />
      </Animated.View>
      <Svg width={b} height={h} viewBox="0 0 70 100" pointerEvents="none">
        {/* Schatten am Boden */}
        <Path d="M4 96 Q35 104 66 96 Q35 90 4 96 Z" fill="#000" opacity={0.45} />
        {/* Stein: unregelmäßig, oben etwas schmaler */}
        <Path d="M10 96 L6 40 Q8 12 30 6 Q52 2 62 22 L66 60 L62 96 Z" fill="#2B3532" />
        <Path d="M10 96 L6 40 Q8 12 30 6 L26 96 Z" fill="#36423E" />
        <Path d="M18 30 Q22 34 20 44 M54 70 Q50 76 56 84" stroke="#3E5A45" strokeWidth={3} fill="none" opacity={0.7} />
      </Svg>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { height: h }, leuchten]}>
        <Svg width={b} height={h} viewBox="0 0 70 100">
          <G transform="translate(8 14) scale(0.54 0.7)">
            <Path
              d={RUNE_ZEICHEN[id]}
              stroke={colors.rune}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </G>
        </Svg>
      </Animated.View>
      <View style={stile.etikett} pointerEvents="none">
        <Schrift art="etikett" style={[stile.mitte, { color: colors.rune }]}>
          {k.tag}
        </Schrift>
        <Schrift art="etikett" style={[stile.mitte, { fontSize: 10 }]}>
          {zaehler.gefunden}/{zaehler.gesamt}
        </Schrift>
      </View>
    </Pressable>
  );
}

const stile = StyleSheet.create({
  etikett: { position: 'absolute', bottom: 0, left: -40, right: -40 },
  mitte: { textAlign: 'center', textShadowColor: colors.night, textShadowRadius: 8 },
});
